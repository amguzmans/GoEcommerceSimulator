# GoEcommerce Simulator

# mintTech
A full-stack e-commerce application built with Go + React + MySQL, originally developed as a team project and later refactored and extended into a production-ready full-stack application.
- Live Demo: go-ecommerce-simulator.vercel.app

## Origin
This project started as a collaborative team effort — a TCP-based console application for managing users, products, and orders. I later refactored and extended it into a full-stack application with a REST API backend in Go and a React + TypeScript frontend.

## Structure of the project
```bash
mintTech/
├── backend/
│   │   └── main.go
│   ├── internal/
│   │   ├── handlers/       # HTTP layer
│   │   ├── services/       # Business logic
│   │   ├── repository/     # Database queries
│   │   ├── models/         # Data structs
│   │   └── middleware/     # JWT auth + CORS
│   ├── database/
│   │   └── schema.sql
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/            # Backend calls
│   │   ├── pages/          # Login, Register, Products, Cart, AdminDashboard
│   │   ├── types/          # TypeScript interfaces
│   │   └── context/        # Auth state (JWT + user)
│   └── vercel.json
├── docker-compose.yml
└── README.md          
```
---
 
## Features
 
### Client
- Register and login with JWT authentication
- Browse products from local DB and Fake Store API
- Search products by name or category
- Filter products by category
- Add products to cart (local and external)
- Place orders and view total
### Admin
- Add products with name, price, stock and image URL
- Soft delete products (products with orders are deactivated, not deleted)
- View all products and order history
  
---

## Tech Stack
 
| Layer | Technology |
|---|---|
| Backend | Go, REST API |
| Authentication | JWT, bcrypt |
| Database | MySQL |
| Frontend | React + TypeScript + Tailwind CSS |
| External API | Fake Store API |
| Deploy | Railway (backend) + Vercel (frontend) |
| Containers | Docker + Docker Compose |

## Local Setup
 
### Requirements
 
- Go
- MySQL Server
- Node.js
- Git
Verify installations:
 
```bash
go version
mysql --version
node --version
git --version
```
 
---
 
### 1. Install MySQL Server
 
**Windows:**
```bash
winget install Oracle.MySQL
```
 
Start the service:
```bash
net start MySQL
```
 
If that doesn't work:
```bash
net start MySQL84
```
 
> If MySQL is not recognized after installation, add its path to your system PATH. Search for "Edit environment variables" in Windows.
 
---
 
### 2. Clone the repository
 
```bash
git clone https://github.com/amguzmans/GoEcommerceSimulator.git
```
 
---
 
### 3. Create the database
 
```bash
mysql -u root -p
```
 
```sql
CREATE DATABASE go_store;
exit
```
 
Run the schema:
```bash
mysql -u root -p go_store < backend/database/schema.sql
```
 
---
 
### 4. Configure environment variables
 
Create a `.env` file inside `backend/` based on `.env.example`:
 
```
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=go_store
JWT_SECRET=your_secret_key
PORT=8080
```
 
---
 
### 5. Run the backend
 
```bash
cd backend
go mod tidy
go run cmd/main.go
```
 
You should see:
```
Connected to MySQL
Server running on port 8080
```
 
---
 
### 6. Run the frontend
 
```bash
cd frontend
npm install
npm run dev
```
 
Open `http://localhost:5173`
 
---
 
### 7. Run with Docker (optional)
 
```bash
docker-compose up --build
```
 
This starts the backend, frontend and MySQL together with a single command.
 
---
 
## Testing the API
 
**Register a client:**
```cmd
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"mail\":\"user@gmail.com\",\"password\":\"123\",\"role\":\"client\"}"
```
 
**Register an admin:**
```cmd
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"mail\":\"admin@gmail.com\",\"password\":\"123\",\"role\":\"admin\"}"
```
 
**Login:**
```cmd
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"mail\":\"user@gmail.com\",\"password\":\"123\"}"
```
 
**Create product (admin only):**
```cmd
curl -X POST http://localhost:8080/api/products -H "Content-Type: application/json" -H "Authorization: Bearer ADMIN_TOKEN" -d "{\"name\":\"Laptop\",\"price\":999.99,\"amount\":10,\"image\":\"https://image-url.com\"}"
```
 
**See products:**
```cmd
curl http://localhost:8080/api/products -H "Authorization: Bearer YOUR_TOKEN"
```
 
**Add to cart:**
```cmd
curl -X POST http://localhost:8080/api/cart -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"product_name\":\"Laptop\",\"cantidad\":1}"
```
 
**Place order:**
```cmd
curl -X POST http://localhost:8080/api/orders -H "Authorization: Bearer YOUR_TOKEN"
```
 
**Order history (admin only):**
```cmd
curl http://localhost:8080/api/orders/history -H "Authorization: Bearer ADMIN_TOKEN"
```
 
---
