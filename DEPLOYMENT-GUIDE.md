# 🚀 ATC Next Gen API - วิธีการ Deploy

## ขั้นตอนการ Deploy บน Render

### 1. เตรียมโค้ด
```bash
# อัพโหลดไฟล์ทั้งหมดไปยัง GitHub repository
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. สร้างบัญชี Render
1. ไปที่ https://render.com
2. สมัครสมาชิกด้วย GitHub account
3. เชื่อมต่อ repository

### 3. สร้าง Web Service
1. คลิก "New" → "Web Service"
2. เลือก repository ที่อัพโหลด
3. ตั้งค่าดังนี้:
   - **Name**: `atcnextgen-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 4. ตั้งค่า Environment Variables
ใน Render Dashboard เพิ่ม Environment Variables:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/atcshop
JWT_SECRET=super_secure_jwt_secret_2025
NODE_ENV=production
PORT=10000
```

### 5. Deploy
- Render จะ deploy โดยอัตโนมัติ
- รอประมาณ 2-3 นาที
- ได้ URL เช่น: `https://atcnextgen-api.onrender.com`

## ขั้นตอนการ Deploy บน Railway

### 1. สร้างบัญชี Railway
1. ไปที่ https://railway.app
2. เข้าสู่ระบบด้วย GitHub

### 2. Deploy จาก GitHub
1. คลิก "New Project"
2. เลือก "Deploy from GitHub repo"
3. เลือก repository

### 3. ตั้งค่า Environment
Railway จะตั้งค่าอัตโนมัติ แต่ต้องเพิ่ม:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/atcshop
JWT_SECRET=super_secure_jwt_secret_2025
```

### 4. การใช้งาน
- ได้ URL เช่น: `https://atcnextgen-api-production.up.railway.app`

## การใช้งาน MongoDB Atlas

### 1. สร้าง Cluster
1. ไปที่ https://cloud.mongodb.com
2. สมัครสมาชิก (ฟรี 512MB)
3. สร้าง Cluster

### 2. ตั้งค่า Security
1. Database Access: สร้าง user/password
2. Network Access: เพิ่ม IP `0.0.0.0/0` (allow all)

### 3. รับ Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/atcshop
```

## Testing Production API

### ทดสอบ Status
```bash
curl https://your-deployed-url.com/api/status
```

### ทดสอบ Authentication
```bash
# Register
curl -X POST https://your-deployed-url.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123", "role": "admin"}'

# Login  
curl -X POST https://your-deployed-url.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### ทดสอบ Products
```bash
# Get products (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-deployed-url.com/api/products
```

## URL ตัวอย่างที่ได้
```
https://atcnextgen-api.onrender.com/api/status
https://atcnextgen-api.onrender.com/api/login
https://atcnextgen-api.onrender.com/api/products
```

---

## 📸 Screenshot ที่ต้องถ่ายส่งอาจารย์

1. **Render/Railway Dashboard**: แสดงการ deploy สำเร็จ
2. **Postman/Browser**: ทดสอบ API จาก URL จริง
3. **MongoDB Atlas**: แสดงการเชื่อมต่อและข้อมูล
4. **Console Logs**: แสดงการทำงานของ server

---

## 🔧 Troubleshooting

### ปัญหา Deploy ไม่สำเร็จ
- ตรวจสอบ `package.json` มี start script
- ตรวจสอบ Environment Variables ครบถ้วน
- ดู Build Logs ใน Dashboard

### ปัญหา Database Connection
- ตรวจสอบ MONGO_URI ถูกต้อง
- ตรวจสอบ Network Access ใน MongoDB Atlas
- ตรวจสอบ username/password

### ปัญหา JWT
- ตรวจสอบ JWT_SECRET ตั้งค่าแล้ว
- ตรวจสอบ Authorization Header format: `Bearer <token>`

---

**✅ เมื่อ Deploy สำเร็จแล้ว** จะได้ URL สาธารณะที่ใช้งานได้จริง สำหรับส่งให้อาจารย์ตรวจสอบ!