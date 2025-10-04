# 🚀 Postman Testing Guide for Express.js Products API

## 📋 Prerequisites

1. **Postman installed** - Download from [postman.com](https://www.postman.com/downloads/)
2. **Your server running** - Make sure your Express.js server is running on `http://localhost:3001`

## 🎯 Quick Start

### Method 1: Import Collection (Recommended)
1. Open Postman
2. Click **Import** button
3. Select the `Postman_Collection.json` file from your project folder
4. The collection will be imported with all test requests pre-configured

### Method 2: Manual Setup
Follow the individual request examples below

## 🔧 API Configuration

**Base URL:** `http://localhost:3001`
**API Key:** `test-api-key-123` (for authenticated routes)

## 📚 Available API Keys
- `test-api-key-123` - Standard user
- `admin-key-456` - Admin user  
- `user-key-789` - Regular user

## 🧪 Test Categories

### 1. Basic Routes
- **GET** `/` - Hello World endpoint

### 2. Products CRUD Operations
- **GET** `/api/products` - List all products
- **GET** `/api/products/:id` - Get specific product
- **POST** `/api/products` - Create new product (requires auth)
- **PUT** `/api/products/:id` - Update product (requires auth)
- **DELETE** `/api/products/:id` - Delete product (requires auth)

### 3. Authentication Tests
- Valid API key requests
- Invalid API key requests
- Missing API key requests

### 4. Validation Tests
- Missing required fields
- Invalid data types
- Malformed JSON

### 5. Advanced Features
- **Filtering:** `?category=electronics&inStock=true&minPrice=100&maxPrice=500`
- **Pagination:** `?page=1&limit=5`
- **Sorting:** `?sortBy=price&sortOrder=desc`
- **Search:** `GET /api/products/search?q=laptop`
- **Statistics:** `GET /api/products/statistics`

### 6. Error Handling Tests
- Non-existent resources
- Invalid routes
- Server errors

## 🔍 Step-by-Step Testing

### Step 1: Test Basic Connectivity
```
GET http://localhost:3001/
```
**Expected:** "Hello World! Welcome to the Products API"

### Step 2: Test Product Listing
```
GET http://localhost:3001/api/products
```
**Expected:** Array of products with pagination info

### Step 3: Test Authentication
```
GET http://localhost:3001/api/products
Headers: X-API-Key: test-api-key-123
```
**Expected:** Same as Step 2, but with authentication logged

### Step 4: Test Product Creation
```
POST http://localhost:3001/api/products
Headers: 
  Content-Type: application/json
  X-API-Key: test-api-key-123
Body:
{
  "name": "Test Product",
  "description": "A test product",
  "price": 99.99,
  "category": "testing",
  "inStock": true
}
```
**Expected:** Created product with generated ID

### Step 5: Test Advanced Filtering
```
GET http://localhost:3001/api/products?category=electronics&inStock=true&page=1&limit=3&sortBy=price&sortOrder=desc
```
**Expected:** Filtered, paginated, and sorted results

### Step 6: Test Search
```
GET http://localhost:3001/api/products/search?q=laptop&category=electronics
```
**Expected:** Products matching search criteria

### Step 7: Test Statistics
```
GET http://localhost:3001/api/products/statistics
```
**Expected:** Product analytics and breakdowns

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module" error
**Solution:** Make sure you're running the server from the correct directory:
```bash
cd "C:\PLP\MERN\Week 2\express-js-server-side-framework-nelsonmaranda"
node server.js
```

### Issue: "Connection refused" in Postman
**Solution:** Verify server is running on port 3001:
```bash
netstat -ano | findstr :3001
```

### Issue: Authentication errors
**Solution:** Make sure to include the `X-API-Key` header:
```
X-API-Key: test-api-key-123
```

### Issue: Validation errors
**Solution:** Check that all required fields are present and data types are correct:
- `name`: string (required)
- `description`: string (required)
- `price`: number (required)
- `category`: string (required)
- `inStock`: boolean (required)

## 📊 Expected Response Formats

### Successful Product Response
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "electronics",
  "inStock": true
}
```

### Paginated Response
```json
{
  "products": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalProducts": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "error": "Product not found",
  "statusCode": 404,
  "timestamp": "2025-01-04T12:00:00.000Z",
  "resource": "Product"
}
```

## 🎉 Success Indicators

✅ **Server running:** "Server is running on http://localhost:3001"
✅ **Hello World:** Returns welcome message
✅ **Products listed:** Returns array of products
✅ **Authentication:** Works with valid API key
✅ **CRUD operations:** Create, read, update, delete work
✅ **Filtering:** Query parameters work correctly
✅ **Search:** Search endpoint returns relevant results
✅ **Statistics:** Analytics endpoint provides data breakdown
✅ **Error handling:** Proper error messages and status codes

## 🔄 Testing Workflow

1. **Start server** → `node server.js`
2. **Import collection** → Load `Postman_Collection.json`
3. **Run basic tests** → Hello World, Get Products
4. **Test authentication** → Try with/without API key
5. **Test CRUD** → Create, read, update, delete products
6. **Test validation** → Try invalid data
7. **Test advanced features** → Filtering, search, statistics
8. **Test error handling** → Invalid routes, non-existent resources

## 📝 Notes

- The server logs all requests with timestamps and request IDs
- Authentication is required for POST, PUT, and DELETE operations
- All responses include proper HTTP status codes
- Error responses include detailed information for debugging
- The API supports CORS for web applications

Happy testing! 🚀
