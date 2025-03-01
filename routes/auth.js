const express = require('express');
const { check } = require('express-validator');  // Add this line to import 'check'
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

// Public Routes
router.post('/register', [
  check('email', 'Please provide a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
], authController.registerAdmin);

router.post('/login', [
  check('email', 'Please provide a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], authController.loginAdmin);

module.exports = router;
