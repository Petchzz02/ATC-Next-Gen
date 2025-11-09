const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, getNextUserId } = require('../mockDB');

const router = express.Router();

// POST /api/register - ลงทะเบียนผู้ใช้ใหม่
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required.' 
      });
    }

    // ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username already exists.' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // สร้างผู้ใช้ใหม่
    const newUser = {
      _id: getNextUserId(),
      username,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date()
    };

    users.push(newUser);

    res.status(201).json({ 
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/login - เข้าสู่ระบบ
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required.' 
      });
    }

    // ค้นหาผู้ใช้จาก mock database
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials.' 
      });
    }

    // ตรวจสอบรหัสผ่าน
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials.' 
      });
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;