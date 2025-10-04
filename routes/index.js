
const express = require('express');
const productsRoutes = require('./products');

const router = express.Router();

/**
 * Root endpoint - API welcome message
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Hello World! Welcome to the Products API',
    version: process.env.API_VERSION || 'v1',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/products',
      search: '/api/products/search',
      statistics: '/api/products/statistics',
      documentation: '/api/docs'
    }
  });
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * API documentation endpoint
 */
router.get('/docs', (req, res) => {
  res.json({
    title: 'Products API Documentation',
    version: process.env.API_VERSION || 'v1',
    description: 'RESTful API for product management with CRUD operations and advanced features',
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      'GET /': 'API information and available endpoints',
      'GET /health': 'Health check endpoint',
      'GET /products': 'List all products with filtering, pagination, and sorting',
      'GET /products/search': 'Search products by name or description',
      'GET /products/statistics': 'Get product statistics and analytics',
      'GET /products/:id': 'Get a specific product by ID',
      'POST /products': 'Create a new product (requires authentication)',
      'PUT /products/:id': 'Update an existing product (requires authentication)',
      'DELETE /products/:id': 'Delete a product (requires authentication)'
    },
    authentication: {
      method: 'API Key',
      header: 'X-API-Key',
      description: 'Include API key in X-API-Key header for protected routes'
    },
    queryParameters: {
      filtering: {
        category: 'Filter by product category',
        inStock: 'Filter by stock status (true/false)',
        minPrice: 'Minimum price filter',
        maxPrice: 'Maximum price filter'
      },
      pagination: {
        page: 'Page number (default: 1)',
        limit: 'Items per page (default: 10)'
      },
      sorting: {
        sortBy: 'Field to sort by (default: name)',
        sortOrder: 'Sort order: asc or desc (default: asc)'
      },
      search: {
        q: 'Search query for name or description'
      }
    }
  });
});

// Mount product routes
router.use('/products', productsRoutes);

module.exports = router;
