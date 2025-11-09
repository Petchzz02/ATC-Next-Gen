# ATC Next Gen Online Shop Management System

ระบบจัดการร้านค้าออนไลน์ที่พัฒนาด้วย Node.js และ Express.js พร้อมระบบ Authentication และการจัดการสินค้า

## 🚀 Features

- ✅ **API เบื้องต้น**: Server status และ uptime monitoring
- ✅ **JWT Authentication**: ระบบการเข้าสู่ระบบที่ปลอดภัย
- ✅ **Product Management**: CRUD operations สำหรับสินค้า
- ✅ **Database Integration**: เชื่อมต่อ MongoDB Atlas
- 🔄 **Deployment**: Deploy บน Render/Railway

## 📋 ข้อกำหนดของระบบ

### ข้อ 1: API เบื้องต้น ✅

**1.1** สร้างโปรเจกต์ Node.js ด้วย Express.js
- ติดตั้ง dependencies: `express`, `jsonwebtoken`, `bcryptjs`, `mongoose`, `dotenv`, `cors`

**1.2** สร้าง Endpoint `/api/status`
```json
{
  "server": "ATC Next Gen API",
  "version": "1.0.0", 
  "status": "running",
  "timestamp": "2025-11-09T10:00:00Z",
  "uptime": "125.45s"
}
```

**1.3** Middleware สำหรับตรวจสอบ Server Uptime
- ใช้ `process.uptime()` เพื่อคำนวณเวลาการทำงาน
- แสดงผลใน Console ทุกครั้งที่มี Request

### ข้อ 2: ระบบสินค้า (Product Management API) ✅

#### JWT Authentication
- **POST** `/api/register` - ลงทะเบียนผู้ใช้ใหม่
- **POST** `/api/login` - เข้าสู่ระบบและรับ JWT Token

#### Product Endpoints (ต้องมี Authorization Header)
- **POST** `/api/products` - เพิ่มสินค้าใหม่
- **GET** `/api/products` - ดึงสินค้าทั้งหมด (รองรับ pagination และ filter)
- **GET** `/api/products/:id` - ดึงสินค้าเฉพาะ ID
- **PUT** `/api/products/:id` - แก้ไขข้อมูลสินค้า
- **DELETE** `/api/products/:id` - ลบสินค้า

#### Special Queries
- **GET** `/api/products/low-stock` - สินค้าที่มี stock < 10
- **GET** `/api/products/total-value` - รวมราคาสินค้าทั้งหมดในระบบ

### ข้อ 3: เชื่อมฐานข้อมูลจริง ✅

#### Database Schema
1. **Users Collection**
   - username (String, unique)
   - password (String, hashed)
   - role (admin/user)

2. **Products Collection**
   - name (String)
   - price (Number)
   - stock (Number)
   - description (String)
   - category (String)

3. **Orders Collection**
   - user (ObjectId ref User)
   - products (Array)
   - totalAmount (Number)
   - status (pending/confirmed/shipped/delivered/cancelled)

## 🔧 การติดตั้งและใช้งาน

### 1. Clone และติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/atcshop
PORT=3000
JWT_SECRET=mysecretkey_atc_nextgen_2025
```

### 3. เรียกใช้งาน
```bash
npm start
```
หรือ
```bash
node server.js
```

## 📡 API Usage Examples

### Authentication

#### ลงทะเบียนผู้ใช้
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }'
```

#### เข้าสู่ระบบ
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Product Management

#### เพิ่มสินค้า (ต้องมี Token)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Mechanical Keyboard",
    "price": 1590,
    "stock": 50,
    "category": "Electronics"
  }'
```

#### ดึงสินค้าทั้งหมด
```bash
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛡️ Security Features

### JWT Authentication
- **Token Generation**: ใช้ `jsonwebtoken` library
- **Password Hashing**: ใช้ `bcryptjs` พร้อม salt rounds = 10
- **Token Validation**: Middleware ตรวจสอบ token ในทุก protected endpoint
- **Expiration**: Token หมดอายุใน 24 ชั่วโมง

### Middleware Architecture
```javascript
// 1. Uptime Monitoring Middleware
app.use((req, res, next) => {
  const uptimeInSeconds = process.uptime();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Server Uptime: ${uptimeInSeconds.toFixed(2)}s`);
  next();
});

// 2. Authentication Middleware (สำหรับ protected routes)
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied' });
  }
  // Token validation logic...
};
```

## 🗄️ Database Queries

### ข้อมูลสินค้าที่มี stock ต่ำ
```javascript
Product.find({ stock: { $lt: 10 } }).sort({ stock: 1 })
```

### การคำนวณมูลค่ารวม
```javascript
Product.aggregate([
  {
    $group: {
      _id: null,
      totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
      totalProducts: { $sum: 1 },
      totalStock: { $sum: '$stock' }
    }
  }
])
```

## 🚀 การ Deploy

### เตรียม Code สำหรับ Production
1. ตั้งค่า Environment Variables บน hosting platform
2. อัพเดต `MONGO_URI` ให้เป็น MongoDB Atlas URL
3. ใส่ `JWT_SECRET` ที่ปลอดภัย

### Deploy บน Render
1. เชื่อมต่อ GitHub repository
2. ตั้งค่า Environment Variables
3. Deploy โดยอัตโนมัติ

### Deploy URL ตัวอย่าง
```
https://atcnextgen-api.onrender.com/api/status
```

## 🧪 Testing

### Status Check
```bash
curl https://your-deployed-api.com/api/status
```

### การทดสอบด้วย Postman
1. Import collection จาก GitHub repository
2. ตั้งค่า Environment variables (BASE_URL, TOKEN)
3. Run automated tests

---

## 👨‍💻 Developer Information

**Project**: ATC Next Gen Online Shop Management System  
**Developer**: Backend Developer Team  
**Framework**: Node.js + Express.js  
**Database**: MongoDB Atlas  
**Authentication**: JWT (JSON Web Tokens)  
**Version**: 1.0.0  

---

> **หน้าต่อไป**: Deploy ระบบบน Render และทดสอบ API ผ่าน Public URL