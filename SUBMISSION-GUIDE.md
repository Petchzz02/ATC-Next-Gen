# 📦 ATC Next Gen Online Shop Management System
## รายการไฟล์ที่ส่งให้อาจารย์

---

## 📁 Core System Files

### 1. Main Application
- **`server.js`** - ไฟล์หลักของ API server
- **`package.json`** - ข้อมูลโปรเจกต์และ dependencies
- **`.env`** - Environment variables (สำหรับ development)
- **`.env.production`** - Environment variables (สำหรับ production)

### 2. Database & Models
- **`db.js`** - การเชื่อมต่อ MongoDB
- **`mockDB.js`** - Mock database สำหรับ demo
- **`models/User.js`** - Schema สำหรับผู้ใช้
- **`models/Product.js`** - Schema สำหรับสินค้า  
- **`models/Order.js`** - Schema สำหรับคำสั่งซื้อ

### 3. Routes (API Endpoints)
- **`routes/auth.js`** - Authentication routes (MongoDB)
- **`routes/products.js`** - Product CRUD routes (MongoDB)
- **`routes/auth-mock.js`** - Authentication routes (Mock DB)
- **`routes/products-mock.js`** - Product CRUD routes (Mock DB)

### 4. Middleware
- **`middleware/auth.js`** - JWT authentication middleware (MongoDB)
- **`middleware/auth-mock.js`** - JWT authentication middleware (Mock DB)

---

## 📋 Documentation Files

### 5. Documentation  
- **`README.md`** - คำอธิบายหลักการทำงานของ Middleware และ JWT
- **`PROJECT-SUMMARY.md`** - สรุปผลการพัฒนาทั้งหมด
- **`DEPLOYMENT-GUIDE.md`** - วิธีการ Deploy และขั้นตอนการใช้งาน

### 6. Testing & Deployment
- **`test-api.sh`** - Script สำหรับทดสอบ API
- **`ATC-NextGen-API.postman_collection.json`** - Postman collection
- **`render.yaml`** - Configuration สำหรับ Render deployment

---

## 🎯 สิ่งที่เสร็จสมบูรณ์

### ✅ ข้อ 1: API เบื้องต้น
- [x] สร้างโปรเจกต์ Node.js + Express.js
- [x] Endpoint `/api/status` ส่งข้อมูล JSON
- [x] Middleware ตรวจสอบ Server Uptime
- [x] ใช้ `process.uptime()` แสดงใน Console

### ✅ ข้อ 2: ระบบสินค้า + Authentication  
- [x] JWT Authentication (Login/Register)
- [x] Product CRUD APIs (POST, GET, PUT, DELETE)
- [x] Authorization middleware ป้องกัน endpoints
- [x] Bearer Token authentication

### ✅ ข้อ 3: เชื่อมฐานข้อมูล
- [x] MongoDB Schema (Users, Products, Orders)
- [x] Database connection (db.js)
- [x] Special queries (Low stock, Total value)
- [x] Mock database สำหรับ demo

### 🔄 ข้อ 4: Deploy (พร้อมใช้งาน)
- [x] Environment configuration
- [x] Production-ready setup  
- [x] Deployment guides (Render, Railway)
- [x] MongoDB Atlas integration

---

## 🧪 วิธีการทดสอบ

### การรัน Server
```bash
# ติดตั้ง dependencies
npm install

# เริ่ม server
npm start
# หรือ
node server.js
```

### การทดสอบด้วย cURL
```bash
# 1. Status check
curl http://localhost:3001/api/status

# 2. Register
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"admin"}'

# 3. Login (รับ token)
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 4. ใช้ token ทดสอบ products
curl -H "Authorization: Bearer <TOKEN>" \
     http://localhost:3001/api/products
```

### การทดสอบด้วย Script
```bash
# ให้สิทธิ์ execute
chmod +x test-api.sh

# รัน test
./test-api.sh
```

### การทดสอบด้วย Postman
1. Import ไฟล์ `ATC-NextGen-API.postman_collection.json`
2. ตั้งค่า BASE_URL = `http://localhost:3001`
3. Run collection เพื่อทดสอบทุก endpoint

---

## 🔐 ความปลอดภัย

### JWT Authentication
- Password hashing ด้วย BCryptJS (salt rounds = 10)
- JWT token expiration = 24 hours  
- Bearer token authorization
- Protected endpoints

### Input Validation
- Required fields validation
- Data type checking (price, stock = numbers)
- Username uniqueness validation

---

## 🌐 พร้อม Deploy

### Environment Variables ที่ต้องตั้งค่า
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/atcshop
JWT_SECRET=secure_random_string
PORT=10000
NODE_ENV=production
```

### Deployment Platforms
- **Render**: https://render.com (แนะนำ)
- **Railway**: https://railway.app  
- **Vercel**: https://vercel.com

### Database
- **MongoDB Atlas**: https://cloud.mongodb.com (ฟรี 512MB)

---

## 📸 Screenshots ที่ควรถ่ายส่งอาจารย์

1. **Server Console**: แสดงการเริ่ม server และ uptime logs
2. **Postman Tests**: ทดสอบ endpoints ต่างๆ รวมถึง JWT token
3. **API Responses**: ผลลัพธ์จาก low-stock และ total-value queries  
4. **Deployment**: หลังจาก deploy ขึ้น production

---

## 🏆 สรุป

โปรเจกต์ **ATC Next Gen Online Shop Management System** ได้พัฒนาเสร็จสมบูรณ์ตามข้อกำหนดทั้ง 3 ข้อ และพร้อม Deploy ตามข้อ 4

**ความพร้อมใช้งาน: 100%** 🎯

### ผู้พัฒนา
- **ทีมงาน**: ATC Next Gen Backend Developer
- **เทคโนโลยี**: Node.js, Express.js, MongoDB, JWT
- **ความปลอดภัย**: BCrypt + JWT Authentication
- **การทดสอบ**: Postman + cURL + Custom Scripts

---

**📞 Contact**: หากมีคำถามเพิ่มเติมเกี่ยวกับการใช้งานหรือ deployment สามารถสอบถามได้