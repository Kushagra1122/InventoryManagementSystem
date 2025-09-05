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

Register:

```bash
curl -X POST http://localhost:3000/register -H 'Content-Type: application/json' -d '{"name":"Alice","email":"a@example.com","password":"secret","businessId":"biz_123"}'
```

Login:

```bash
curl -X POST http://localhost:3000/login -H 'Content-Type: application/json' -d '{"email":"a@example.com","password":"secret"}'
```

Create product (requires Bearer token):

```bash
curl -X POST http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"name":"Widget","price":99.99,"stock":10,"businessId":"biz_123"}'
```

Create sale transaction:

```bash
curl -X POST http://localhost:3000/transactions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"type":"sale","customerId":"cust_1","products":[{"productId":"prod_1","quantity":2,"price":50}],"totalAmount":100,"businessId":"biz_123"}'
```
