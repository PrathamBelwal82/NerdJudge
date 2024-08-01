const User = require('../models/Users'); 

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId); // Fetch user from database
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};