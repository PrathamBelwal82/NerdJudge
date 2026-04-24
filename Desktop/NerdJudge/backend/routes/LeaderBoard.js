const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/Users');
const mockStore = require('../mock/store');

router.get('/', async (req, res) => {
  if (mockStore.USE()) {
    try {
      return res.status(200).json(mockStore.recalcLeaderboardPayload());
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return res.status(500).json({ message: 'Failed to load leaderboard data.' });
    }
  }

  try {
    const leaderboardEntries = await Leaderboard.find()
      .sort({ problemsSolved: -1 })
      .limit(10)
      .populate('userId', 'firstName lastName');

    res.status(200).json(
      leaderboardEntries.map((entry) => ({
        _id: entry.userId._id,
        firstName: entry.userId.firstName,
        lastName: entry.userId.lastName,
        problemsSolved: entry.problemsSolved,
      }))
    );
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to load leaderboard data.' });
  }
});

module.exports = router;
