const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../models/Users'); // Adjust the path to your User model

const storeTokenInCookie = (token, res) => {
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days expiry
    secure: process.env.NODE_ENV === 'production' ? true : false, // Set secure to true in production
  });
};

module.exports = { storeTokenInCookie };