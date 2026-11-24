const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getAllUsers } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);
router.get('/me', getProfile);
router.put('/profile', updateProfile);
router.get('/users', getAllUsers);

module.exports = router;
