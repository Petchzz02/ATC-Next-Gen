// Mock Database สำหรับการทดสอบ (แทนที่ MongoDB ชั่วคราว)

let users = [
  {
    _id: '1',
    username: 'admin',
    password: '$2a$10$8K1p/a0dUzsAG8q9UrQPUeybwT0W9IjTdUhq8rDRmJ9pU8H8YkNxy', // admin123
    role: 'admin'
  }
];

let products = [
  {
    _id: '1',
    name: 'Mechanical Keyboard',
    price: 1590,
    stock: 50,
    description: 'Gaming mechanical keyboard with RGB lighting',
    category: 'Electronics',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2', 
    name: 'Gaming Mouse',
    price: 890,
    stock: 8,
    description: 'High precision gaming mouse',
    category: 'Electronics',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Monitor 24 inch',
    price: 5500,
    stock: 15,
    description: '1080p IPS monitor for gaming',
    category: 'Electronics',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let orders = [];

let nextUserId = 2;
let nextProductId = 4;
let nextOrderId = 1;

module.exports = {
  users,
  products, 
  orders,
  getNextUserId: () => (nextUserId++).toString(),
  getNextProductId: () => (nextProductId++).toString(),
  getNextOrderId: () => (nextOrderId++).toString()
};