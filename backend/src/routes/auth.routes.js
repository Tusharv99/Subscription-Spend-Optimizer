const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator
} = require('../validators/auth.validator');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

// Private routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidator, validate, updateProfile);
router.post('/change-password', protect, changePasswordValidator, validate, changePassword);

module.exports = router;