# 🚀 Express.js Products API

A comprehensive RESTful API for product management built with Express.js, featuring CRUD operations, authentication, validation, filtering, pagination, search, and analytics.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Server](#-running-the-server)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Endpoints](#-endpoints)
- [Request/Response Examples](#-requestresponse-examples)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## ✨ Features

- **RESTful API Design** - Standard HTTP methods and status codes
- **Authentication** - API key-based authentication
- **Data Validation** - Comprehensive input validation
- **Error Handling** - Custom error classes and global error handling
- **Filtering & Pagination** - Advanced query capabilities
- **Search Functionality** - Full-text search across products
- **Analytics** - Product statistics and insights
- **Modular Architecture** - Clean, organized code structure
- **Environment Configuration** - Flexible configuration management
- **CORS Support** - Cross-origin resource sharing enabled

## 🔧 Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Postman** (for API testing - optional)

## 📦 Installation

1. **Clone or download the project**
   ```bash
   # Navigate to the project directory
   cd "C:\PLP\MERN\Week 2\express-js-server-side-framework-nelsonmaranda"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup** (optional)
   ```bash
   # Copy the example environment file
   copy .env.example .env
   ```

## ⚙️ Configuration

The API uses environment variables for configuration. Create a `.env` file or use the defaults:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# API Configuration
API_VERSION=v1

# Authentication
API_KEYS=test-api-key-123,admin-key-456,user-key-789

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## 🚀 Running the Server

### Development Mode
```bash
# Start the server
node server.js

# Or using npm
npm start
```

### Development with Auto-reload
```bash
# Install nodemon globally (if not already installed)
npm install -g nodemon

# Start with auto-reload
npm run dev
```

### Expected Output
```
🚀 Server is running on http://localhost:3001
📚 API Documentation: http://localhost:3001/api/docs
🔑 Available API Keys: test-api-key-123, admin-key-456, user-key-789
🌍 Environment: development
📊 Health Check: http://localhost:3001/api/health
Use X-API-Key header for authentication on protected routes
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001
```

### API Version
```
v1
```

## 🔐 Authentication

The API uses API key authentication for protected routes. Include your API key in the request headers:

```http
X-API-Key: test-api-key-123
```

### Available API Keys
- `test-api-key-123` - Standard user
- `admin-key-456` - Admin user
- `user-key-789` - Regular user

## 🛠️ Endpoints

### 1. Health Check
```http
GET /api/health
```
**Description:** Check if the API is running and healthy.

### 2. API Information
```http
GET /api/
```
**Description:** Get API information and available endpoints.

### 3. API Documentation
```http
GET /api/docs
```
**Description:** Get comprehensive API documentation.

### 4. Products

#### List All Products
```http
GET /api/products
```
**Query Parameters:**
- `category` - Filter by category
- `inStock` - Filter by stock status (true/false)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Field to sort by (default: name)
- `sortOrder` - Sort order: asc or desc (default: asc)

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product
```http
POST /api/products
```
**Authentication:** Required
**Content-Type:** application/json

#### Update Product
```http
PUT /api/products/:id
```
**Authentication:** Required
**Content-Type:** application/json

#### Delete Product
```http
DELETE /api/products/:id
```
**Authentication:** Required

#### Search Products
```http
GET /api/products/search
```
**Query Parameters:**
- `q` - Search query (required)
- `category` - Filter by category
- `inStock` - Filter by stock status
- `page` - Page number
- `limit` - Items per page

#### Product Statistics
```http
GET /api/products/statistics
```

## 📝 Request/Response Examples

### 1. Health Check

**Request:**
```http
GET http://localhost:3001/api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-04T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### 2. List Products

**Request:**
```http
GET http://localhost:3001/api/products?category=electronics&page=1&limit=5
```

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop for work and gaming",
      "price": 999.99,
      "category": "electronics",
      "inStock": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalProducts": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "filters": {
    "category": "electronics",
    "inStock": null,
    "minPrice": null,
    "maxPrice": null
  },
  "sorting": {
    "sortBy": "name",
    "sortOrder": "asc"
  }
}
```

### 3. Create Product

**Request:**
```http
POST http://localhost:3001/api/products
Content-Type: application/json
X-API-Key: test-api-key-123

{
  "name": "New Product",
  "description": "A new product description",
  "price": 199.99,
  "category": "electronics",
  "inStock": true
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "generated-uuid",
    "name": "New Product",
    "description": "A new product description",
    "price": 199.99,
    "category": "electronics",
    "inStock": true
  }
}
```

### 4. Search Products

**Request:**
```http
GET http://localhost:3001/api/products/search?q=laptop&category=electronics
```

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop for work and gaming",
      "price": 999.99,
      "category": "electronics",
      "inStock": true
    }
  ],
  "searchQuery": "laptop",
  "totalResults": 1,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "filters": {
    "category": "electronics",
    "inStock": null
  }
}
```

### 5. Product Statistics

**Request:**
```http
GET http://localhost:3001/api/products/statistics
```

**Response:**
```json
{
  "overview": {
    "totalProducts": 5,
    "inStockProducts": 4,
    "outOfStockProducts": 1,
    "stockPercentage": "80.00"
  },
  "pricing": {
    "minPrice": 49.99,
    "maxPrice": 999.99,
    "averagePrice": 403.99,
    "priceRanges": {
      "under50": 0,
      "between50and200": 2,
      "between200and500": 1,
      "over500": 2
    }
  },
  "categories": {
    "electronics": 2,
    "appliances": 1,
    "sports": 1,
    "books": 1
  },
  "lastUpdated": "2025-01-04T12:00:00.000Z"
}
```

## ❌ Error Handling

The API returns structured error responses with appropriate HTTP status codes:

### Error Response Format
```json
{
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2025-01-04T12:00:00.000Z",
  "requestId": "abc123def4",
  "details": ["Additional error details"],
  "resource": "Product"
}
```

### Common Error Codes
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Missing or invalid API key)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Resource conflict)
- `500` - Internal Server Error

### Example Error Responses

**Validation Error:**
```json
{
  "error": "Validation failed",
  "statusCode": 400,
  "timestamp": "2025-01-04T12:00:00.000Z",
  "requestId": "abc123def4",
  "details": [
    "Name is required and must be a non-empty string",
    "Price must be a non-negative number"
  ]
}
```

**Authentication Error:**
```json
{
  "error": "API key is required in X-API-Key header or Authorization header",
  "statusCode": 401,
  "timestamp": "2025-01-04T12:00:00.000Z",
  "requestId": "abc123def4"
}
```

## 🧪 Testing

### Using Postman

1. **Import the collection:**
   - Open Postman
   - Click "Import"
   - Select `Postman_Collection.json`

2. **Set up environment variables:**
   - `baseUrl`: `http://localhost:3001`
   - `apiKey`: `test-api-key-123`

3. **Run the tests:**
   - Execute individual requests
   - Run the entire collection

### Using cURL

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**List Products:**
```bash
curl http://localhost:3001/api/products
```

**Create Product:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-api-key-123" \
  -d '{
    "name": "Test Product",
    "description": "A test product",
    "price": 99.99,
    "category": "testing",
    "inStock": true
  }'
```

## 📁 Project Structure

```
express-js-server-side-framework-nelsonmaranda/
├── config/
│   └── index.js              # Configuration management
├── middleware/
│   └── index.js              # Custom middleware functions
├── routes/
│   ├── index.js              # Main route configuration
│   └── products.js           # Product-specific routes
├── utils/
│   └── errors.js             # Custom error classes
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── Postman_Collection.json   # Postman test collection
├── POSTMAN_TESTING_GUIDE.md  # Testing guide
└── README.md                 # This file
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:3001/api/health
   ```

4. **Import Postman collection:**
   - Open Postman
   - Import `Postman_Collection.json`
   - Start testing!

## 📊 API Features Summary

| Feature | Description | Endpoint |
|---------|-------------|----------|
| **Health Check** | Server status | `GET /api/health` |
| **List Products** | Get all products with filtering | `GET /api/products` |
| **Get Product** | Get single product | `GET /api/products/:id` |
| **Create Product** | Add new product | `POST /api/products` |
| **Update Product** | Modify existing product | `PUT /api/products/:id` |
| **Delete Product** | Remove product | `DELETE /api/products/:id` |
| **Search Products** | Search by name/description | `GET /api/products/search` |
| **Product Stats** | Analytics and insights | `GET /api/products/statistics` |
| **API Docs** | Interactive documentation | `GET /api/docs` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Nelson Maranda**
- Express.js Products API
- Week 2 Assignment
- MERN Stack Development

---

**Happy Coding! 🚀**