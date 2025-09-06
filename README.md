# Inventory & Billing Backend

> A lightweight and scalable backend system to manage **authentication, products, contacts, transactions, and reports** for small businesses.

---

## 📑 Table of Contents

* [Description](#description)
* [Features](#features)
* [Project Structure](#project-structure)
* [Schemas](#schemas)
* [API Endpoints](#api-endpoints)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Running](#running)
* [Examples (curl)](#examples-curl)

## 📝 Description

This backend application offers a **complete inventory and billing solution** tailored for small businesses. With secure **JWT-based authentication**, **stock-aware product handling**, **transaction tracking**, and **real-time reports**, it can serve as the foundation for a POS or ERP system.

## ✨ Features

* 🔐 **Authentication** — JWT-based login & session handling
* 📦 **Product Management** — CRUD, stock updates, categories
* 👥 **Contacts** — Customers & Vendors with full CRUD
* 💳 **Transactions** — Record sales/purchases, auto stock adjustment
* 📊 **Reports** — Inventory, transactions, contact history
* ⚡ **Scalable** — Modular structure ready for business growth

## 📂 Project Structure

```
├── index.js                # App entry
├── config/                 # DB connection
│   └── database.js         
├── controllers/            # Request handlers
│   ├── authController.js
│   ├── productController.js
│   ├── contactController.js
│   ├── transactionController.js
│   └── reportController.js
├── middleware/             # Auth, validation, error handlers
│   ├── auth.js
│   └── validation.js
├── models/                 # Mongoose models
│   ├── User.js
│   ├── Product.js
│   ├── Contact.js
│   └── Transaction.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── products.js
│   ├── contacts.js
│   ├── transactions.js
│   └── reports.js
└── README.md
```

## 🗂️ Schemas

### User

```js
{
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  businessId: String,
  role: String // e.g., admin, user
}
```

### Product

```js
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  businessId: String
}
```

### Contact (Customer/Vendor)

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
  customerId?: String,
  vendorId?: String,
  products: [
    { productId: String, quantity: Number, price: Number }
  ],
  totalAmount: Number,
  date: Date,
  businessId: String
}
```

## 🚀 API Endpoints

### Authentication

* `POST /register` — Register a new user
* `POST /login` — Login, returns JWT
* `GET /logout` — Logout (client-side removal or token blacklist)

### Products

* `GET /products` — List products (with `?q=search&category=...`)
* `POST /products` — Create product
* `PUT /products/:id` — Update product
* `DELETE /products/:id` — Delete product

### Contacts

* `GET /contacts` — List contacts (filter by type)
* `POST /contacts` — Create contact
* `PUT /contacts/:id` — Update contact
* `DELETE /contacts/:id` — Delete contact

### Transactions

* `GET /transactions` — List transactions (filters: date, type)
* `POST /transactions` — Create transaction (sale or purchase)

  * On `sale`: stock decreases
  * On `purchase`: stock increases

### Reports

* `GET /reports/inventory` — Current stock levels
* `GET /reports/transactions` — Filterable transaction list
* `GET /reports/contacts/:id` — History for a customer/vendor

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Kushagra1122/InventoryManagementSystem.git
cd InventoryManagementSystem
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment:

```bash
cp .env.example .env
# then edit .env
```

## 🔑 Environment Variables

Example `.env`:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/inventory-db
JWT_SECRET=your_jwt_secret
```

## 🏃 Running

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## 📌 Examples (curl)

##############################
# 🔑 AUTHENTICATION
##############################

# Register a new user
POST http://localhost:3000/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret",
  "businessId": "biz_123"
}

---

# Login to get JWT token
POST http://localhost:3000/login
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
GET http://localhost:3000/products
Authorization: Bearer {{token}}

---

# Create a new product
POST http://localhost:3000/products
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
PUT http://localhost:3000/products/{{PRODUCT_ID}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Updated Widget",
  "price": 75,
  "stock": 15
}

---

# Delete a product
DELETE http://localhost:3000/products/{{PRODUCT_ID}}
Authorization: Bearer {{token}}

---

##############################
# 👥 CONTACTS (CUSTOMERS / VENDORS)
##############################

# Get all contacts
GET http://localhost:3000/contacts
Authorization: Bearer {{token}}

---

# Create a new contact
POST http://localhost:3000/contacts
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
PUT http://localhost:3000/contacts/{{CONTACT_ID}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "phone": "9876543210"
}

---

# Delete a contact
DELETE http://localhost:3000/contacts/{{CONTACT_ID}}
Authorization: Bearer {{token}}

---

##############################
# 💰 TRANSACTIONS
##############################

# Get all transactions
GET http://localhost:3000/transactions
Authorization: Bearer {{token}}

---

# Create a sale transaction (decreases stock)
POST http://localhost:3000/transactions
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
POST http://localhost:3000/transactions
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
GET http://localhost:3000/reports/inventory
Authorization: Bearer {{token}}

---

# Get all transactions with filters
GET http://localhost:3000/reports/transactions
Authorization: Bearer {{token}}

---

# Get transaction history for a specific contact
GET http://localhost:3000/reports/contacts/{{CONTACT_ID}}
Authorization: Bearer {{token}}

