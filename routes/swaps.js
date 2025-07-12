const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const {
  createSwapRequest,
  respondToSwapRequest,
  getUserSwaps,
  completeSwap
} = require('../controllers/swapController');

// Validation middleware
const validateSwapRequest = [
  body('itemId').isInt().withMessage('Item ID must be a valid integer'),
  body('type').isIn(['swap', 'redeem']).withMessage('Type must be "swap" or "redeem"'),
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message must be less than 500 characters'),
  handleValidationErrors
];

const validateSwapResponse = [
  body('status').isIn(['accepted', 'rejected']).withMessage('Status must be "accepted" or "rejected"'),
  handleValidationErrors
];

// All swap routes require authentication
router.use(auth);

router.post('/', validateSwapRequest, createSwapRequest);
router.put('/:id/respond', validateSwapResponse, respondToSwapRequest);
router.get('/my-swaps', getUserSwaps);
router.put('/:id/complete', completeSwap);

module.exports = router;