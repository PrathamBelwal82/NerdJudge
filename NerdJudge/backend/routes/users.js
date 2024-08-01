const express = require('express');
const router = express.Router();
const User = require('../models/Users'); // Adjust path as per your setup

// Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
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
