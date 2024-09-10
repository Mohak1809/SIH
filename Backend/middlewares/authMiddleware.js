const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = 'schedule_line_crew&manager:999';

// Middleware to verify token and attach user to request
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = await User.find({id:decoded.id});
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error); // Log detailed error
    res.status(401).json({ message: `Failed to authenticate token: ${error.message}` });
  }
};


// Middleware to check if user is a manager
const managerAuthMiddleware = (req, res, next) => {
  console.log('User from req.user:', req.user); // Log user data
  console.log('User from req.user: role is ', req.user[0].role); // Log user data

  if (req.user[0].role !== 'manager') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
module.exports = { authMiddleware, managerAuthMiddleware };

// module.exports = {verifyToken,authMiddleware,managerAuthMiddleware};
