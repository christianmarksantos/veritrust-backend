# VeriTrust: An API-Integrated E-Commerce Product and Review Verification System

**Course:** ITEC 116 — IT Elective 4 (Systems Integration and Architecture 2)  
**Project Type:** Individual Backend Prototype

## Project Overview

VeriTrust is a RESTful backend platform designed to combat fake product reviews ("review baiting") and deceptive e-commerce listings where delivered items do not match advertised seller images. It implements role-based e-commerce workflows alongside automated review text spam detection, unboxing image mismatch evaluation, verification logging, and dynamic product trust scoring.

## Technology Stack

- **Backend Framework:** NestJS (TypeScript / Node.js)
- **ORM:** TypeORM
- **Database:** MySQL
- **Authentication & Security:** JWT (`@nestjs/jwt`, `passport-jwt`), `bcrypt` password hashing, Role-Based Access Control (`Buyer`, `Seller`, `Admin`), `class-validator` DTO validation
- **API Testing:** Postman

## Database Schema

The MySQL database (`veritrust_db`) consists of five normalized relational entities:

1. **`user_accounts`**: Stores registered Buyers, Sellers, and Admins with `bcrypt`-hashed passwords.
2. **`products`**: Stores seller listings, official display image URLs, and dynamic `trustScore` ratings (`0.00`–`100.00`).
3. **`order_transactions`**: Links Buyers to purchased Products (`Pending`, `Completed`, `Cancelled`).
4. **`product_reviews`**: Stores verified buyer ratings, written feedback, and unboxing image URLs (`1:1` with orders).
5. **`verification_logs`**: Stores automated `spamScore`, `imageMatchScore`, and `flagStatus` (`Clean`, `Flagged`, `Under Review`) metrics (`1:1` with reviews).

## Local Setup & Installation

### 1. Prerequisites

- Node.js (LTS v18+)
- XAMPP (MySQL & Apache)

### 2. Database Setup

1. Start **Apache** and **MySQL** in XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin` and create a database named `veritrust_db` (or import `veritrust_db.sql`).

### 3. Install Dependencies & Configure Environment

```bash
git clone [https://github.com/christianmarksantos/veritrust-backend.git](https://github.com/christianmarksantos/veritrust-backend.git)
cd veritrust-backend
npm install
```
