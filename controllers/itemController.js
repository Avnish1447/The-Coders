const { Item, User, Swap } = require('../models');
const { Op } = require('sequelize');

const createItem = async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      userId: req.user.id
    };

    const item = await Item.create(itemData);

    // Award points for uploading an item
    await req.user.increment('points', { 
      by: parseInt(process.env.ITEM_UPLOAD_POINTS) || 10 
    });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message
    });
  }
};

const getItems = async (req, res) => {
  try {
    const { 
      category, 
      size, 
      condition, 
      featured, 
      status = 'approved',
      page = 1, 
      limit = 20,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status };

    // Add filters
    if (category) where.category = category;
    if (size) where.size = size;
    if (condition) where.condition = condition;
    if (featured) where.featured = featured === 'true';
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: items } = await Item.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
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
      message: 'Error fetching items',
      error: error.message
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'createdAt']
        },
        {
          model: Swap,
          as: 'swaps',
          where: { status: { [Op.in]: ['pending', 'accepted'] } },
          required: false,
          include: [
            {
              model: User,
              as: 'requester',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if item is available (not already swapped and approved)
    const isAvailable = item.status === 'approved' && 
                       !item.swaps.some(swap => swap.status === 'accepted');

    res.json({
      success: true,
      data: { 
        item: {
          ...item.toJSON(),
          isAvailable
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error.message
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const item = await Item.findOne({
      where: { id, userId }
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found or you do not have permission to update it'
      });
    }

    // Don't allow updates if item is already swapped
    if (item.status === 'swapped') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update item that has been swapped'
      });
    }

    await item.update(req.body);

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const whereClause = isAdmin ? { id } : { id, userId };
    const item = await Item.findOne({ where: whereClause });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found or you do not have permission to delete it'
      });
    }

    // Don't allow deletion if there are active swaps
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

const getUserItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    const where = { userId };

    if (status) where.status = status;

    const { count, rows: items } = await Item.findAndCountAll({
      where,
      include: [
        {
          model: Swap,
          as: 'swaps',
          required: false,
          include: [
            {
              model: User,
              as: 'requester',
              attributes: ['id', 'name']
            }
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
      message: 'Error fetching user items',
      error: error.message
    });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getUserItems
};