import { verifyToken } from '../utils/jwt.utils.js';
import User from '../models/User.model.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Please log in to access this resource.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    
    let user;
    if (process.env.MOCK_DB === 'true') {
      user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name || 'Demo User',
        email: decoded.email,
      };
    } else {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
        clearToken: true,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Session expired. Please log in again.',
      clearToken: true,
    });
  }
};

export default authenticate;