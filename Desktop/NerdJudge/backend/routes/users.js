const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const mockStore = require('../mock/store');

router.get('/', async (req, res) => {
  if (mockStore.USE()) {
    try {
      return res.status(200).json(mockStore.listAllUsersPublic());
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (mockStore.USE()) {
    try {
      const u = mockStore.getUserById(id);
      if (!u) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(mockStore.toPublicUser(u));
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      return res.status(500).json({ error: `Failed to fetch user ${id}` });
    }
  }

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
