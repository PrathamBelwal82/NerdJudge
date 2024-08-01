// authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const { storeTokenInCookie } = require('../middleware/cookie');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist', register: true });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '15d' });
    console.log('Generated JWT Token:', token);

    storeTokenInCookie(token, res);
    res.status(200).json(
      token
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '15d' });

    storeTokenInCookie(token, res);
    res.status(200).json(
      token
    );

    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
