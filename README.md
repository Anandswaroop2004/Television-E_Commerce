# Television E-Commerce Platform

A full-stack, enterprise-grade Television E-Commerce Application built with **React (Vite)**, **Spring Boot 3**, **JWT Authentication**, **MySQL**, and **Razorpay Payment Integration**.

---

## 📁 Repository Structure

```
Television-E_Commerce/
├── frontend/             # React 18, Vite, React Router, Context API, CSS
├── backend/              # Spring Boot 3, Spring Security, JPA Hibernate, JWT
├── database/             # MySQL schema, tables, and seed dataset
├── run.ps1               # Automation runner script for backend
└── README.md             # Project documentation
```

---

## 🚀 Key Features

- **Storefront & Catalog**: Browse 4K Ultra HD, Gaming, QLED, OLED, and Curved TVs with dynamic sorting, filtering, and live search.
- **Cart & Wishlist**: Real-time cart management with quantity controls and wishlist persistence.
- **Secure Authentication**: JWT-based authentication with bcrypt password encryption and Email OTP verification.
- **Payment Processing**: Integrated Razorpay payment gateway with signature verification.
- **Enterprise Admin Dashboard**:
  - Real-time revenue & order statistics
  - Interactive SVG revenue line charts & order bar graphs
  - Complete Product & Category Inventory CRUD
  - User Directory & role moderation
  - Orders & transactions tracking
  - Coupon code generation & discount management
  - Review moderation & store settings
- **100% Mobile & Tablet Responsive**: Fully optimized across desktop monitors, tablets, and smartphones.

---

## 🛠️ Getting Started

### 1. Database Setup
```bash
# Create database and import schema
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS Telivision;"
mysql -u root -p Telivision < database/schema.sql
```

### 2. Backend Setup (Spring Boot)
```bash
cd backend
# Run using Maven Wrapper
./mvnw spring-boot:run
```
*Backend runs on `http://localhost:8080`*

### 3. Frontend Setup (React / Vite)
```bash
cd frontend
# Install dependencies
npm install

# Start development server
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🌐 Hosting & Deployment

- **Frontend**: Can be hosted on Vercel, Netlify, or Cloudflare Pages (includes `_redirects` and `vercel.json` for SPA routing).
- **Backend**: Can be hosted on Render, Railway, AWS EC2, or Heroku.
- Set `VITE_API_BASE_URL` in frontend environment variables pointing to your hosted backend URL.
