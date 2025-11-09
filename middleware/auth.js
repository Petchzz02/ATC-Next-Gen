const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // ตรวจสอบ Header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided or invalid format.' 
      });
    }

    // แยก Token จาก "Bearer "
    const token = authHeader.substring(7);

    // ตรวจสอบและ decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ค้นหาผู้ใช้จาก database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // เก็บข้อมูลผู้ใช้ไว้ใน request object
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

module.exports = authMiddleware;