import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes for logged-in users
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Query the database for the active user details (excluding OTP codes)
      req.user = await User.findById(decoded.id).select('-otp -otpExpires');
      
      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized: User no longer exists'));
      }
      
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized: Invalid token'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized: Token missing'));
  }
};

// Guard for admin-only access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    return next(new Error('Not authorized as an admin'));
  }
};
