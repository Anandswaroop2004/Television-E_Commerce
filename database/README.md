# Television E-Commerce Database

This directory contains the database initialization and seed scripts for the **Television E-Commerce Platform**.

## Files
- `schema.sql`: Contains the complete MySQL database schema, tables (`users`, `products`, `categories`, `orders`, `order_items`, `reviews`, `coupons`), and pre-populated television product records.

## Database Import Instructions

1. **Start MySQL Server** (Port `3306`).
2. **Create Database**:
   ```sql
   CREATE DATABASE IF NOT EXISTS Telivision;
   USE Telivision;
   ```
3. **Import the SQL File**:
   ```bash
   mysql -u root -p Telivision < database/schema.sql
   ```
4. **Backend Configuration**:
   Ensure `backend/src/main/resources/application.properties` matches your MySQL username and password:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/Telivision?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```
