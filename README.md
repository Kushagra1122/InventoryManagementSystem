# Inventory & Billing Backend

---

## Table of Contents

* [Overview](#overview)
* [Why this project](#why-this-project)
* [Features](#features)
* [Architecture & Project Structure](#architecture--project-structure)
* [Data Models (Schemas)](#data-models-schemas)
* [API Reference (quick)](#api-reference-quick)
* [Setup & Running](#setup--running)
* [Environment Variables](#environment-variables)
* [Usage Examples](#usage-examples)
* [Security & Best Practices](#security--best-practices)

---

## Overview

This repository contains a **scalable Node.js + Express** backend built for small businesses to manage products, contacts (customers/vendors), transactions (sales & purchases) and reports. It focuses on clarity, good defaults, and modularity so you can plug it into a web or mobile frontend quickly.

---

## Why this project

* Minimal, production-ready patterns (JWT auth, role-based checks, database separation by `businessId`).
* Stock-aware transactions (sales decrement stock; purchases increment stock).
* Clean separation of controllers, models and routes for easy extension.

---

## Features

* 🔐 JWT-based authentication (register, login)
* 📦 Full product CRUD with categories and stock counts
* 👥 Contact management (customers & vendors)
* 💳 Transaction handling (sales & purchases) with automatic stock adjustment
* 📊 Basic reports: inventory, transactions and contact histories
* ✅ Role support (`admin`, `user`) and business scoping via `businessId`

---

## Architecture & Project Structure

```
├── index.js                # App entry point
├── config/                 # DB & env configuration
│   └── database.js         # Mongo connection
├── controllers/            # Route handlers
│   ├── authController.js
│   ├── productController.js
│   ├── contactController.js
│   ├── transactionController.js
│   └── reportController.js
├── middleware/
│   ├── auth.js             # JWT auth + role checks
│   └── validation.js       # Request body validation
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Contact.js
│   └── Transaction.js
├── routes/                 # API routes (one file per resource)
└── README.md
```

---

## Data Models (Schemas)

### User

```js
{
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed (bcrypt)
  businessId: String,
  role: { type: String, default: 'user' } // admin | user
}
```

### Product

```js
{
  name: String,
  description: String,
  price: Number,
  stock: { type: Number, default: 0 },
  category: String,
  businessId: String,
  sku?: String
}
```

### Contact

```js
{
  name: String,
  phone: String,
  email: String,
  address: String,
  type: 'customer' | 'vendor',
  businessId: String
}
```

### Transaction

```js
{
  type: 'sale' | 'purchase',
  contactId?: String,          // customerId or vendorId
  products: [
    { productId: String, quantity: Number, price: Number }
  ],
  totalAmount: Number,
  date: { type: Date, default: Date.now },
  businessId: String,
  meta: Object                 // optional extra fields (invoice#, payment method)
}
```

---

## 📌 API Reference (Quick)

### 🔑 Authentication
- `POST /api/auth/register` — create user (returns user without password)  
- `POST /api/auth/login` — returns `{ token }` (JWT)  
- `GET /api/auth/logout` — logout  

### 📦 Products
- `GET /api/products/` — list (supports `?q=&category=&page=&limit=`)  
- `POST /api/products/` — create (protected)  
- `PUT /api/products/:id` — update  
- `DELETE /api/products/:id` — remove  

### 👥 Contacts
- `GET /api/contacts` — list (filter `?type=customer`)  
- `POST /api/contacts` — create  
- `PUT /api/contacts/:id` — update  
- `DELETE /api/contacts/:id` — delete  

### 💰 Transactions
- `GET /api/transactions` — list (filters: `?type=&from=&to=&contactId=`)  
- `POST /api/transactions` — create sale or purchase (atomic stock update)  

### 📊 Reports
- `GET /api/reports/inventory` — aggregated stock levels  
- `GET /api/reports/transactions` — filtered transactions with totals  

> ⚠️ All protected routes require `Authorization: Bearer <JWT>` header.

---
## Setup & Running

1. Clone & install

```bash
git clone https://github.com/Kushagra1122/InventoryManagementSystem.git
cd InventoryManagementSystem
npm install
```

2. Copy env and set values

```bash
cp .env.example .env
# edit .env accordingly
```

3. Start (development)

```bash
npm run dev
```

4. Start (production)

```bash
npm start
```

---

## Environment Variables

```
PORT=9000
MONGO_URI=mongodb://localhost:27017/inventory-db
JWT_SECRET=your_jwt_secret_here
```

---

## Usage Examples

##############################
# 🔑 AUTHENTICATION
##############################

# Register a new user
POST http://localhost:9000/api/auth/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret",
  "businessId": "biz_123"
}

---

# Login to get JWT token
POST http://localhost:9000/api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "secret"
}

---

##############################
# 📦 PRODUCTS
##############################

# Get all products
GET http://localhost:9000/api/products
Authorization: Bearer {{token}}

---

# Create a new product
POST http://localhost:9000/api/products
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Widget",
  "description": "Test item",
  "price": 50,
  "stock": 10,
  "category": "Tools",
  "businessId": "biz_123"
}

---

# Update a product
PUT http://localhost:9000/api/products/{{PRODUCT_ID}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Updated Widget",
  "price": 75,
  "stock": 15
}

---

# Delete a product
DELETE http://localhost:9000/api/products/{{PRODUCT_ID}}
Authorization: Bearer {{token}}

---

##############################
# 👥 CONTACTS (CUSTOMERS / VENDORS)
##############################

# Get all contacts
GET http://localhost:9000/api/contacts
Authorization: Bearer {{token}}

---

# Create a new contact
POST http://localhost:9000/api/contacts
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Bob",
  "phone": "1234567890",
  "email": "bob@example.com",
  "address": "Street 1",
  "type": "customer",
  "businessId": "biz_123"
}

---

# Update a contact
PUT http://localhost:9000/api/contacts/{{CONTACT_ID}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "phone": "9876543210"
}

---

# Delete a contact
DELETE http://localhost:9000/api/contacts/{{CONTACT_ID}}
Authorization: Bearer {{token}}

---

##############################
# 💰 TRANSACTIONS
##############################

# Get all transactions
GET http://localhost:9000/api/transactions
Authorization: Bearer {{token}}

---

# Create a sale transaction (decreases stock)
POST http://localhost:9000/api/transactions
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "type": "sale",
  "customerId": "{{CUSTOMER_ID}}",
  "products": [
    {
      "productId": "{{PRODUCT_ID}}",
      "quantity": 2,
      "price": 50
    }
  ],
  "totalAmount": 100,
  "businessId": "biz_123"
}

---

# Create a purchase transaction (increases stock)
POST http://localhost:9000/api/transactions
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "type": "purchase",
  "vendorId": "{{VENDOR_ID}}",
  "products": [
    {
      "productId": "{{PRODUCT_ID}}",
      "quantity": 5,
      "price": 40
    }
  ],
  "totalAmount": 200,
  "businessId": "biz_123"
}

---

##############################
# 📊 REPORTS
##############################

# Get current inventory levels
GET http://localhost:9000/api/reports/inventory
Authorization: Bearer {{token}}

---

# Get all transactions with filters
GET http://localhost:9000/api/reports/transactions
Authorization: Bearer {{token}}

---

## Security & Best Practices

* **Hash passwords** with bcrypt before saving.
* **Never** return password fields in API responses.
* **Validate and sanitize** user input (use a library like Joi or express-validator).
* Use **rate limiting**, **CORS** restrictions and **helmet** for basic hardening.
* Consider token revocation / blacklisting for logout if needed.

---
