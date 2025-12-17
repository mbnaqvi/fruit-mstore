# Fruit mStore - MERN Stack Application

A compact MERN-based web application for a neighbourhood fresh produce retailer.

## System Overview

Fruit mStore is a digital ordering platform that enables customers to browse fresh fruits, add items to cart, and place orders with delivery or pickup options. The system supports two roles:

- **Admin**: Can add new products to the catalogue
- **Customer**: Can browse products, manage cart, and place orders

## Features

- Product catalogue with images, prices, and descriptions
- User authentication (register/login)
- Shopping cart management
- Checkout with delivery/pickup options
- Mock payment (Cash on Delivery or Card)
- Admin product management

## Technology Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
fruit-mstore/
├── backend/
│   ├── models/          (User, Product, Cart, Order)
│   ├── routes/          (auth, products, cart, orders)
│   ├── middleware/      (authentication)
│   ├── server.js
│   └── seed.js
├── frontend/
│   ├── src/
│   │   ├── components/  (Navbar)
│   │   ├── context/     (AuthContext, CartContext)
│   │   ├── pages/       (ProductList, Cart, Checkout, etc.)
│   │   └── App.jsx
│   └── index.html
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)

### Backend Setup
```bash
cd backend
npm install
node seed.js    # Seed database with sample data
npm start       # Starts server on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts dev server on port 5173
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fruitmstore.com | admin123 |
| Customer | fatima@example.com | customer123 |
| Customer | usman@example.com | customer123 |
| Customer | ayesha@example.com | customer123 |

## Payment Flow

The checkout process offers two payment options. When the customer selects "Cash on Delivery", the order is placed immediately with payment status marked as pending, to be collected upon delivery. When "Card Payment" is selected, the customer enters card details (card number, holder name, expiry, CVV) which are validated client-side for format only. This is a mock implementation - no actual payment processing occurs. The card number is stored with only the last 4 digits visible for security. Both payment methods result in successful order placement with the payment method recorded as "COD" or "Card" in the database.

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

### Products
- GET /api/products - List all products
- GET /api/products/:id - Get single product
- POST /api/products - Add product (Admin only)

### Cart
- GET /api/cart - Get user's cart
- POST /api/cart/add - Add item to cart
- PUT /api/cart/update/:itemId - Update quantity
- DELETE /api/cart/remove/:itemId - Remove item
- DELETE /api/cart/clear - Clear cart

### Orders
- POST /api/orders - Create order
- GET /api/orders - Get user's orders
- GET /api/orders/:id - Get single order
