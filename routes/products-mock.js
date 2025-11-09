const express = require('express');
const { products, getNextProductId } = require('../mockDB');
const authMiddleware = require('../middleware/auth-mock');

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
    const newProduct = {
      _id: getNextProductId(),
      name,
      price: Number(price),
      stock: Number(stock) || 0,
      description,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    products.push(newProduct);

    res.status(201).json({
      message: 'Product created successfully.',
      product: newProduct
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

    // Filter products
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category && product.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= Number(minPrice));
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= Number(maxPrice));
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      products: paginatedProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / Number(limit))
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
    const lowStockProducts = products
      .filter(product => product.stock < 10)
      .sort((a, b) => a.stock - b.stock);

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
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const averagePrice = totalStock > 0 ? (totalValue / totalStock).toFixed(2) : 0;

    res.json({
      message: 'Total inventory value calculated.',
      statistics: {
        totalValue,
        totalProducts,
        totalStock,
        averagePrice: Number(averagePrice)
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
    const product = products.find(product => product._id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ product });

  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({ error: 'Server error while fetching product.' });
  }
});

// PUT /api/products/:id - แก้ไขข้อมูลสินค้า
router.put('/:id', async (req, res) => {
  try {
    const { name, price, stock, description, category } = req.body;
    
    const productIndex = products.findIndex(product => product._id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // อัพเดตข้อมูลสินค้า
    if (name !== undefined) products[productIndex].name = name;
    if (price !== undefined) products[productIndex].price = Number(price);
    if (stock !== undefined) products[productIndex].stock = Number(stock);
    if (description !== undefined) products[productIndex].description = description;
    if (category !== undefined) products[productIndex].category = category;
    products[productIndex].updatedAt = new Date();

    res.json({
      message: 'Product updated successfully.',
      product: products[productIndex]
    });

  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ error: 'Server error during product update.' });
  }
});

// DELETE /api/products/:id - ลบสินค้า
router.delete('/:id', async (req, res) => {
  try {
    const productIndex = products.findIndex(product => product._id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    res.json({
      message: 'Product deleted successfully.',
      product: deletedProduct
    });

  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ error: 'Server error during product deletion.' });
  }
});

module.exports = router;
