
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require('../utils/errors');
const { asyncHandler } = require('../utils/errors');
const { authMiddleware, validateProductCreation, validateProductUpdate } = require('../middleware');

const router = express.Router();

// In-memory products storage (in production, this would be a database)
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop for work and gaming',
    price: 999.99,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest smartphone with advanced features',
    price: 699.99,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Automatic coffee maker for home use',
    price: 149.99,
    category: 'appliances',
    inStock: false
  },
  {
    id: '4',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for athletes',
    price: 129.99,
    category: 'sports',
    inStock: true
  },
  {
    id: '5',
    name: 'Book: JavaScript Guide',
    description: 'Comprehensive guide to JavaScript programming',
    price: 49.99,
    category: 'books',
    inStock: true
  }
];

/**
 * GET /api/products - List all products with filtering, pagination, and sorting
 */
router.get('/', asyncHandler(async (req, res) => {
  const { 
    category, 
    inStock, 
    minPrice, 
    maxPrice, 
    page = 1, 
    limit = 10, 
    sortBy = 'name', 
    sortOrder = 'asc' 
  } = req.query;

  let filteredProducts = [...products];

  // Apply filters
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (inStock !== undefined) {
    const stockFilter = inStock === 'true';
    filteredProducts = filteredProducts.filter(product => product.inStock === stockFilter);
  }

  if (minPrice !== undefined) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
      filteredProducts = filteredProducts.filter(product => product.price >= min);
    }
  }

  if (maxPrice !== undefined) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      filteredProducts = filteredProducts.filter(product => product.price <= max);
    }
  }

  // Apply sorting
  filteredProducts.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    } else {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }
  });

  // Apply pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Calculate pagination info
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / limitNum);

  const response = {
    products: paginatedProducts,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalProducts,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    },
    filters: {
      category: category || null,
      inStock: inStock !== undefined ? inStock === 'true' : null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null
    },
    sorting: {
      sortBy,
      sortOrder
    }
  };

  res.json(response);
}));

/**
 * GET /api/products/search - Search products by name or description
 */
router.get('/search', asyncHandler(async (req, res) => {
  const { q, category, inStock, page = 1, limit = 10 } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({
      error: 'Search query is required',
      statusCode: 400,
      timestamp: new Date().toISOString()
    });
  }

  let searchResults = products.filter(product => 
    product.name.toLowerCase().includes(q.toLowerCase()) ||
    product.description.toLowerCase().includes(q.toLowerCase())
  );

  // Apply additional filters
  if (category) {
    searchResults = searchResults.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (inStock !== undefined) {
    const stockFilter = inStock === 'true';
    searchResults = searchResults.filter(product => product.inStock === stockFilter);
  }

  // Apply pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedResults = searchResults.slice(startIndex, endIndex);

  const totalResults = searchResults.length;
  const totalPages = Math.ceil(totalResults / limitNum);

  res.json({
    products: paginatedResults,
    searchQuery: q,
    totalResults,
    pagination: {
      currentPage: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    },
    filters: {
      category: category || null,
      inStock: inStock !== undefined ? inStock === 'true' : null
    }
  });
}));

/**
 * GET /api/products/statistics - Get product statistics and analytics
 */
router.get('/statistics', asyncHandler(async (req, res) => {
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;

  // Price statistics
  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  // Category breakdown
  const categoryBreakdown = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  // Price ranges
  const priceRanges = {
    under50: products.filter(p => p.price < 50).length,
    between50and200: products.filter(p => p.price >= 50 && p.price < 200).length,
    between200and500: products.filter(p => p.price >= 200 && p.price < 500).length,
    over500: products.filter(p => p.price >= 500).length
  };

  res.json({
    overview: {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      stockPercentage: totalProducts > 0 ? ((inStockProducts / totalProducts) * 100).toFixed(2) : 0
    },
    pricing: {
      minPrice,
      maxPrice,
      averagePrice: parseFloat(avgPrice.toFixed(2)),
      priceRanges
    },
    categories: categoryBreakdown,
    lastUpdated: new Date().toISOString()
  });
}));

/**
 * GET /api/products/:id - Get a specific product by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);

  if (!product) {
    throw new NotFoundError('Product');
  }

  res.json(product);
}));

/**
 * POST /api/products - Create a new product (requires authentication)
 */
router.post('/', authMiddleware, validateProductCreation, asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  const newProduct = {
    id: uuidv4(),
    name: name.trim(),
    description: description.trim(),
    price: parseFloat(price),
    category: category.trim(),
    inStock: Boolean(inStock)
  };

  products.push(newProduct);

  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
}));

/**
 * PUT /api/products/:id - Update an existing product (requires authentication)
 */
router.put('/:id', authMiddleware, validateProductUpdate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    throw new NotFoundError('Product');
  }

  const { name, description, price, category, inStock } = req.body;
  const existingProduct = products[productIndex];

  // Update only provided fields
  const updatedProduct = {
    ...existingProduct,
    ...(name !== undefined && { name: name.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(price !== undefined && { price: parseFloat(price) }),
    ...(category !== undefined && { category: category.trim() }),
    ...(inStock !== undefined && { inStock: Boolean(inStock) })
  };

  products[productIndex] = updatedProduct;

  res.json({
    message: 'Product updated successfully',
    product: updatedProduct
  });
}));

/**
 * DELETE /api/products/:id - Delete a product (requires authentication)
 */
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    throw new NotFoundError('Product');
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
}));

module.exports = router;
