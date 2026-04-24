const jwt = require('jsonwebtoken');
const mockStore = require('../mock/store');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (mockStore.USE() && token.startsWith('mock-')) {
    const id = token.slice(5);
    const user = mockStore.getUserById(id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = { id: user._id, email: user.email };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
