const express = require('express');
const router = express.Router();
const User = require('../models/Users'); // Adjust path as per your setup
const verifyToken = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

const token = req.cookies.token;

if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }



// Fetch all users
router.get('/', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
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
