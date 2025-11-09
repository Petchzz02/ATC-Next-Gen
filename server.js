// โหลด environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// นำเข้า Routes (ใช้ Mock Database สำหรับ Demo)
const authRoutes = require('./routes/auth-mock');
const productRoutes = require('./routes/products-mock');

const app = express();
const PORT = process.env.PORT || 3000;

// แสดงข้อมูลการเริ่มต้น
console.log('🔥 ATC Next Gen API Starting...');
console.log('📦 Using Mock Database for Demo');

// Middleware สำหรับ CORS
app.use(cors());

// 1.3: Middleware เพื่อตรวจสอบ Uptime
app.use((req, res, next) => {
  // 1.3.1: ใช้ process.uptime()
  const uptimeInSeconds = process.uptime();
  
  // 1.3.2: แสดงผลใน Console
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Server Uptime: ${uptimeInSeconds.toFixed(2)}s`);
  
  // ส่งต่อให้ Endpoint ถัดไปทำงาน
  next();
});

// Middleware สำหรับการ parse JSON
app.use(express.json());

// 1.2: สร้าง Endpoint ที่ /api/status
app.get('/api/status', (req, res) => {
  res.json({
    server: "ATC Next Gen API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`
  });
});

// Routes
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    availableEndpoints: [
      'GET /api/status',
      'POST /api/register',
      'POST /api/login',
      'GET /api/products',
      'POST /api/products',
      'GET /api/products/:id',
      'PUT /api/products/:id',
      'DELETE /api/products/:id'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// เริ่มการทำงานของ Server
const HOST = '0.0.0.0'; // รองรับ Render และ hosting platforms อื่นๆ

app.listen(PORT, HOST, () => {
  console.log(`🚀 ATC Next Gen API Server is running on port ${PORT}`);
  console.log(`📍 Host: ${HOST}`);
  console.log(`📍 Available at: http://localhost:${PORT}`);
  console.log(`📋 Status endpoint: http://localhost:${PORT}/api/status`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});