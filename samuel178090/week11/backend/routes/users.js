const express = require('express');
const { getAllUsers, searchUsers, getUserProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.get('/profile', getUserProfile);

module.exports = router;