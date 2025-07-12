const { Swap, Item, User } = require('../models');
const { Op } = require('sequelize');

const createSwapRequest = async (req, res) => {
  try {
    const { itemId, type, message } = req.body;
    const requesterId = req.user.id;

    // Get the item
    const item = await Item.findByPk(itemId, {
      include: [{ model: User, as: 'owner' }]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Item is not approved for swapping'
      });
    }

    if (item.userId === requesterId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request to swap your own item'
      });
    }

    // Check if there's already a pending/accepted swap for this item
    const existingSwap = await Swap.findOne({
      where: {
        itemId,
        status: { [Op.in]: ['pending', 'accepted'] }
      }
    });

    if (existingSwap) {
      return res.status(400).json({
        success: false,
        message: 'There is already an active swap request for this item'
      });
    }

    // For redeem type, check if user has enough points
    let pointsUsed = 0;
    if (type === 'redeem') {
      pointsUsed = 50; // Fixed point cost for redemption
      if (req.user.points < pointsUsed) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient points for redemption'
        });
      }
    }

    // Create swap request
    const swap = await Swap.create({
      itemId,
      requesterId,
      ownerId: item.userId,
      type,
      message,
      pointsUsed
    });

    const swapWithDetails = await Swap.findByPk(swap.id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name'] },
        { model: User, as: 'owner', attributes: ['id', 'name'] },
        { model: Item, as: 'item', attributes: ['id', 'title', 'images'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully',
      data: { swap: swapWithDetails }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating swap request',
      error: error.message
    });
  }
};

const respondToSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    const userId = req.user.id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted" or "rejected"'
      });
    }

    const swap = await Swap.findOne({
      where: { id, ownerId: userId, status: 'pending' },
      include: [
        { model: User, as: 'requester' },
        { model: Item, as: 'item' }
      ]
    });

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found or you do not have permission'
      });
    }

    await swap.update({ status });

    if (status === 'accepted') {
      // For redeem type, deduct points from requester
      if (swap.type === 'redeem') {
        await swap.requester.decrement('points', { by: swap.pointsUsed });
        // Award points to owner
        await User.findByPk(userId).then(owner => 
          owner.increment('points', { by: parseInt(process.env.SUCCESSFUL_SWAP_POINTS) || 20 })
        );
      }
      
      // Mark item as swapped
      await swap.item.update({ status: 'swapped' });
    }

    const updatedSwap = await Swap.findByPk(swap.id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name'] },
        { model: User, as: 'owner', attributes: ['id', 'name'] },
        { model: Item, as: 'item', attributes: ['id', 'title', 'images'] }
      ]
    });

    res.json({
      success: true,
      message: `Swap request ${status} successfully`,
      data: { swap: updatedSwap }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error responding to swap request',
      error: error.message
    });
  }
};

const getUserSwaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, page = 1, limit = 10 } = req.query; // type: 'sent' or 'received'

    const offset = (page - 1) * limit;
    let where = {};

    if (type === 'sent') {
      where.requesterId = userId;
    } else if (type === 'received') {
      where.ownerId = userId;
    } else {
      where[Op.or] = [
        { requesterId: userId },
        { ownerId: userId }
      ];
    }

    const { count, rows: swaps } = await Swap.findAndCountAll({
      where,
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name'] },
        { model: User, as: 'owner', attributes: ['id', 'name'] },
        { 
          model: Item, 
          as: 'item', 
          attributes: ['id', 'title', 'images', 'status'],
          include: [
            { model: User, as: 'owner', attributes: ['id', 'name'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        swaps,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user swaps',
      error: error.message
    });
  }
};

const completeSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const swap = await Swap.findOne({
      where: { 
        id, 
        status: 'accepted',
        [Op.or]: [
          { requesterId: userId },
          { ownerId: userId }
        ]
      },
      include: [
        { model: User, as: 'requester' },
        { model: User, as: 'owner' }
      ]
    });

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found or you do not have permission'
      });
    }

    await swap.update({ status: 'completed' });

    // Award points to both parties for successful completion
    const successPoints = parseInt(process.env.SUCCESSFUL_SWAP_POINTS) || 20;
    await swap.requester.increment('points', { by: successPoints });
    await swap.owner.increment('points', { by: successPoints });

    res.json({
      success: true,
      message: 'Swap marked as completed successfully',
      data: { swap }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing swap',
      error: error.message
    });
  }
};

module.exports = {
  createSwapRequest,
  respondToSwapRequest,
  getUserSwaps,
  completeSwap
};