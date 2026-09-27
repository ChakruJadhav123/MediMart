# 💊 MediMart – Full Stack Online Medicine Ordering App

> A production-ready pharmacy platform built with Spring Boot, React, MySQL & JWT.
> Similar to Tata 1mg, with AI chatbot powered by Claude.

---

## 🗂️ Project Structure

```
medimart/
├── backend/                          ← Spring Boot App
│   └── src/main/java/com/medimart/
│       ├── MedimartApplication.java
│       ├── config/
│       │   ├── AppConfig.java        ← ModelMapper, Static Resources
│       │   ├── DataSeeder.java       ← Sample data on startup
│       │   └── SecurityConfig.java  ← JWT + CORS Security
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── MedicineController.java
│       │   ├── CartController.java
│       │   ├── OrderController.java
│       │   ├── UserController.java
│       │   ├── PrescriptionController.java
│       │   └── AdminController.java
│       ├── dto/                      ← Request/Response DTOs
│       ├── entity/                   ← JPA Entities
│       ├── exception/                ← Global Exception Handling
│       ├── repository/               ← Spring Data JPA Repos
│       ├── security/                 ← JWT Utils & Filters
│       └── service/                  ← Business Logic
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                         ← React App
│   └── src/
│       ├── api/index.js              ← Axios API calls
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── MedicineCard.jsx
│       │   └── AIChatbot.jsx         ← Claude-powered chatbot
│       └── pages/
│           ├── Home.jsx
│           ├── Medicines.jsx
│           ├── MedicineDetail.jsx
│           ├── Cart.jsx
│           ├── Checkout.jsx
│           ├── Orders.jsx
│           ├── OrderDetail.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Profile.jsx
│           ├── Prescriptions.jsx
│           ├── About.jsx
│           ├── Contact.jsx
│           └── admin/
│               ├── AdminLayout.jsx
│               ├── AdminDashboard.jsx
│               ├── AdminMedicines.jsx
│               ├── AdminOrders.jsx
│               ├── AdminUsers.jsx
│               └── AdminPrescriptions.jsx
│
└── docs/
    ├── README.md        ← This file
    └── schema.sql       ← Database schema
```

---

## ⚙️ Prerequisites

| Tool        | Version   |
|-------------|-----------|
| Java        | 17+       |
| Maven       | 3.8+      |
| Node.js     | 18+       |
| MySQL       | 8.0+      |

---

## 🚀 Step-by-Step Setup

### Step 1 – MySQL Database

```sql
-- Run in MySQL client or Workbench
CREATE DATABASE medimart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or just run the full schema:
```bash
mysql -u root -p < docs/schema.sql
```

---

### Step 2 – Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Change these to match your MySQL credentials
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# JWT secret (keep this long and random in production)
app.jwt.secret=MediMartSecretKey2024SuperLongSecretKeyForJWTTokenGenerationAndValidation
```

---

### Step 3 – Run the Backend

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

✅ Backend starts at: **http://localhost:8080**

On first run, DataSeeder automatically creates:
- **Admin:** `admin@medimart.com` / `Admin@123`
- **User:**  `user@medimart.com`  / `User@123`
- **15 sample medicines** across all categories

---

### Step 4 – Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend starts at: **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@medimart.com     | Admin@123   |
| User  | user@medimart.com      | User@123    |

> The Login page has **"Demo User"** and **"Demo Admin"** quick-fill buttons.

---

## 🌐 API Endpoints Reference

### Auth
| Method | Endpoint              | Description       | Auth Required |
|--------|-----------------------|-------------------|---------------|
| POST   | /api/auth/register    | Register user     | No            |
| POST   | /api/auth/login       | Login → JWT token | No            |

### Medicines
| Method | Endpoint                     | Description           | Auth     |
|--------|------------------------------|-----------------------|----------|
| GET    | /api/medicines               | List (search/filter)  | No       |
| GET    | /api/medicines/{id}          | Get by ID             | No       |
| GET    | /api/medicines/featured      | Top-rated             | No       |
| GET    | /api/medicines/new-arrivals  | Latest added          | No       |
| GET    | /api/medicines/categories    | All categories        | No       |
| POST   | /api/medicines               | Create medicine       | ADMIN    |
| PUT    | /api/medicines/{id}          | Update medicine       | ADMIN    |
| DELETE | /api/medicines/{id}          | Soft delete           | ADMIN    |

### Cart
| Method | Endpoint               | Description   | Auth  |
|--------|------------------------|---------------|-------|
| GET    | /api/cart              | Get cart      | USER  |
| POST   | /api/cart/add          | Add item      | USER  |
| PUT    | /api/cart/items/{id}   | Update qty    | USER  |
| DELETE | /api/cart/items/{id}   | Remove item   | USER  |
| DELETE | /api/cart/clear        | Clear cart    | USER  |

### Orders
| Method | Endpoint                       | Description        | Auth  |
|--------|--------------------------------|--------------------|-------|
| POST   | /api/orders                    | Place order        | USER  |
| GET    | /api/orders/my-orders          | My order history   | USER  |
| GET    | /api/orders/{id}               | Order detail       | USER  |
| GET    | /api/orders/admin/all          | All orders         | ADMIN |
| PUT    | /api/orders/admin/{id}/status  | Update status      | ADMIN |

### Prescriptions
| Method | Endpoint                           | Description      | Auth  |
|--------|------------------------------------|------------------|-------|
| POST   | /api/prescriptions/upload          | Upload Rx        | USER  |
| GET    | /api/prescriptions/my              | My prescriptions | USER  |
| GET    | /api/prescriptions/admin/all       | All Rx           | ADMIN |
| PUT    | /api/prescriptions/admin/{id}/status | Approve/Reject | ADMIN |

### Admin
| Method | Endpoint                    | Description     | Auth  |
|--------|-----------------------------|-----------------|-------|
| GET    | /api/admin/dashboard        | Dashboard stats | ADMIN |
| GET    | /api/users/admin/all        | All users       | ADMIN |

---

## ✨ Features Implemented

| Feature                    | Status |
|----------------------------|--------|
| JWT Authentication         | ✅     |
| User Registration/Login    | ✅     |
| Medicine Catalog + Search  | ✅     |
| Category Filters           | ✅     |
| Pagination & Sorting       | ✅     |
| Shopping Cart              | ✅     |
| Order Placement            | ✅     |
| Order Tracking             | ✅     |
| Prescription Upload        | ✅     |
| Dummy Payment (4 methods)  | ✅     |
| Admin Dashboard            | ✅     |
| Admin Medicines CRUD       | ✅     |
| Admin Orders Management    | ✅     |
| Admin Users List           | ✅     |
| Admin Prescriptions Review | ✅     |
| AI Chatbot (Claude)        | ✅     |
| Responsive Design          | ✅     |
| Global Exception Handling  | ✅     |
| Data Seeder                | ✅     |

---

## 🏗️ Architecture

```
React Frontend (Port 3000)
        ↓ HTTP + JWT Bearer
Spring Boot Backend (Port 8080)
   ├── Controller Layer   → REST API endpoints
   ├── Service Layer      → Business logic
   ├── Repository Layer   → Spring Data JPA
   └── Security Layer     → JWT filter chain
        ↓ JPA / Hibernate
MySQL Database (Port 3306)
```

---

## 🔒 Security

- Passwords hashed with **BCrypt**
- Stateless sessions with **JWT**
- Role-based access: `ROLE_USER` and `ROLE_ADMIN`
- CORS configured for `localhost:3000`
- File upload validation (type + size)

---

## 🤖 AI Chatbot

The AI chatbot (`AIChatbot.jsx`) uses the Anthropic Claude API directly from the browser. It's pre-configured as "MediBot" with a system prompt tuned for pharmacy assistance. It answers medicine queries, health tips, and platform help.

---

## 📦 Production Tips

1. **Environment Variables** – Move DB credentials and JWT secret to env vars or a vault
2. **HTTPS** – Use HTTPS in production (free with Let's Encrypt)
3. **CORS** – Update `app.cors.allowed-origins` to your production domain
4. **File Storage** – Replace local disk uploads with AWS S3 or Cloudinary
5. **Email** – Configure SMTP in `application.properties` for order confirmations
6. **Rate Limiting** – Add Spring rate limiting to prevent abuse

---

## 🛠️ Tech Stack Summary

| Layer     | Technology              |
|-----------|-------------------------|
| Backend   | Spring Boot 3.2 + Java 17 |
| Security  | Spring Security + JWT    |
| ORM       | Spring Data JPA + Hibernate |
| Database  | MySQL 8                 |
| Frontend  | React 18 + Vite         |
| Styling   | Tailwind CSS            |
| HTTP      | Axios                   |
| AI Chat   | Anthropic Claude API    |
| Icons     | React Icons             |
| Toast     | react-hot-toast         |
