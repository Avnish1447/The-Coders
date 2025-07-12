const { Item, User, Swap } = require('../models');
const { Op } = require('sequelize');

const getPendingItems = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: items } = await Item.findAndCountAll({
      where: { status: 'pending' },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        items,
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
      message: 'Error fetching pending items',
      error: error.message
    });
  }
};

const moderateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body; // status: 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "approved" or "rejected"'
      });
    }

    const item = await Item.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Item has already been moderated'
      });
    }

    await item.update({ status });

    // Log moderation action (you could create a separate ModerationLog model)
    console.log(`Item ${id} ${status} by admin ${req.user.id}. Reason: ${reason || 'None provided'}`);

    res.json({
      success: true,
      message: `Item ${status} successfully`,
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error moderating item',
      error: error.message
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check for active swaps
    const activeSwaps = await Swap.findOne({
      where: {
        itemId: id,
        status: { [Op.in]: ['pending', 'accepted'] }
      }
    });

    if (activeSwaps) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete item with active swap requests'
      });
    }

    await item.destroy();

    // Log deletion (you could create a separate ModerationLog model)
    console.log(`Item ${id} deleted by admin ${req.user.id}. Reason: ${reason || 'None provided'}`);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message
    });
  }
};

const toggleFeaturedItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved items can be featured'
      });
    }

    await item.update({ featured: !item.featured });

    res.json({
      success: true,
      message: `Item ${item.featured ? 'featured' : 'unfeatured'} successfully`,
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating featured status',
      error: error.message
    });
  }
};

const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalItems,
      pendingItems,
      approvedItems,
      totalSwaps,
      completedSwaps
    ] = await Promise.all([
      User.count(),
      Item.count(),
      Item.count({ where: { status: 'pending' } }),
      Item.count({ where: { status: 'approved' } }),
      Swap.count(),
      Swap.count({ where: { status: 'completed' } })
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalItems,
          pendingItems,
          approvedItems,
          totalSwaps,
          completedSwaps
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'role', 'points', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        users,
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
      message: 'Error fetching users',
      error: error.message
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate admin users'
      });
    }

    await user.update({ isActive: !user.isActive });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

module.exports = {
  getPendingItems,
  moderateItem,
  deleteItem,
  toggleFeaturedItem,
  getStats,
  getAllUsers,
  toggleUserStatus
};