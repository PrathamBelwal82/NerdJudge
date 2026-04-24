const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const verifyToken = require('../middleware/authMiddleware');

// Fetch current user (JWT payload uses `id` from authController)
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    res.status(500).json({ error: `Failed to fetch user ${id}` });
  }
});

module.exports = router;
