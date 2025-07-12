const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const { validateItem } = require('../middleware/validation');
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getUserItems
} = require('../controllers/itemController');

// Public routes
router.get('/', optionalAuth, getItems);
router.get('/:id', optionalAuth, getItemById);

// Protected routes
router.post('/', auth, validateItem, createItem);
router.put('/:id', auth, validateItem, updateItem);
router.delete('/:id', auth, deleteItem);
router.get('/user/my-items', auth, getUserItems);

module.exports = router;