const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model
    required: true
  },
  problemsSolved: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
