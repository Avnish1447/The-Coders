const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const {
  getPendingItems,
  moderateItem,
  deleteItem,
  toggleFeaturedItem,
  getStats,
  getAllUsers,
  toggleUserStatus
} = require('../controllers/adminController');

// Validation middleware
const validateModeration = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be "approved" or "rejected"'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters'),
  handleValidationErrors
];

// All admin routes require authentication and admin role
router.use(auth, admin);

// Item moderation
router.get('/items/pending', getPendingItems);
router.put('/items/:id/moderate', validateModeration, moderateItem);
router.delete('/items/:id', deleteItem);
router.put('/items/:id/featured', toggleFeaturedItem);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

// Statistics
router.get('/stats', getStats);

module.exports = router;