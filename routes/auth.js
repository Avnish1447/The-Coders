const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;