const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader); // Debugging tip

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted token:', token); // Debugging tip

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Decoded User:', decoded); // Debugging tip
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error); // Debugging tip
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
