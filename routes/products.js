const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ใช้ Authentication Middleware สำหรับทุก endpoint
router.use(authMiddleware);

// POST /api/products - เพิ่มสินค้าใหม่
router.post('/', async (req, res) => {
  try {
    const { name, price, stock, description, category } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !price) {
      return res.status(400).json({ 
        error: 'Name and price are required.' 
      });
    }

    // สร้างสินค้าใหม่
    const newProduct = new Product({
      name,
      price,
      stock: stock || 0,
      description,
      category
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully.',
      product: savedProduct
    });

  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ error: 'Server error during product creation.' });
  }
});

// GET /api/products - ดึงสินค้าทั้งหมด
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;

    // สร้าง filter conditions
    const filter = {};
    if (category) filter.category = new RegExp(category, 'i');
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ error: 'Server error while fetching products.' });
  }
});

// GET /api/products/low-stock - ดึงสินค้าที่มี stock < 10
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .sort({ stock: 1 });

    res.json({
      message: `Found ${lowStockProducts.length} products with low stock.`,
      products: lowStockProducts
    });

  } catch (error) {
    console.error('Get Low Stock Products Error:', error);
    res.status(500).json({ error: 'Server error while fetching low stock products.' });
  }
});

// GET /api/products/total-value - รวมราคาสินค้าทั้งหมดในระบบ
router.get('/total-value', async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);

    const stats = result[0] || { totalValue: 0, totalProducts: 0, totalStock: 0 };

    res.json({
      message: 'Total inventory value calculated.',
      statistics: {
        totalValue: stats.totalValue,
        totalProducts: stats.totalProducts,
        totalStock: stats.totalStock,
        averagePrice: stats.totalProducts > 0 ? (stats.totalValue / stats.totalStock).toFixed(2) : 0
      }
    });

  } catch (error) {
    console.error('Calculate Total Value Error:', error);
    res.status(500).json({ error: 'Server error while calculating total value.' });
  }
});

// GET /api/products/:id - ดึงสินค้าเฉพาะ ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ product });

  } catch (error) {
    console.error('Get Product Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid product ID format.' });
    }
    
    res.status(500).json({ error: 'Server error while fetching product.' });
  }
});

// PUT /api/products/:id - แก้ไขข้อมูลสินค้า
router.put('/:id', async (req, res) => {
  try {
    const { name, price, stock, description, category } = req.body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({
      message: 'Product updated successfully.',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update Product Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid product ID format.' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error.',
        details: error.message 
      });
    }
    
    res.status(500).json({ error: 'Server error during product update.' });
  }
});

// DELETE /api/products/:id - ลบสินค้า
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({
      message: 'Product deleted successfully.',
      product: deletedProduct
    });

  } catch (error) {
    console.error('Delete Product Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid product ID format.' });
    }
    
    res.status(500).json({ error: 'Server error during product deletion.' });
  }
});

module.exports = router;