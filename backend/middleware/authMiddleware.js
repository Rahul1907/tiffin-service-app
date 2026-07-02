import jwt from 'jsonwebtoken';

// Protect routes for logged-in users
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Temporarily store credentials decoded from the token.
      // Once the User model is established, we will fetch user details from DB.
      req.user = {
        id: decoded.id,
        phone: decoded.phone,
        role: decoded.role || 'customer'
      };
      
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized: invalid token'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized: token missing'));
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
