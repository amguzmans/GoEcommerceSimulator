# GoEcommerce Simulator

A full-stack (in progress, just backend for now) e-commerce application built with **Go + MySQL**, originally developed as a team project and later extended into a REST API with JWT authentication and a layered architecture.

This project started as a collaborative team effort, a TCP-based console application for managing users, products, and orders. I later refactored and extended it into a production-ready REST API with proper authentication, a clean architecture, and a React frontend (in progress).

## Structure of the project
GoEcommerceSimulator/
├── backend/
│   ├── main.go
│   ├── internal/
│   │   ├── handlers/       # HTTP layer
│   │   ├── services/       # Business logic
│   │   ├── repository/     # Database queries
│   │   ├── models/         # Data structs
│   │   └── middleware/     # JWT auth
│   ├── database/
│   │   └── schema.sql
│   └── .env.example
├── frontend/               # In progress

## Requirements
* Go
* MySQL Server
* Git

Verify instalations

```bash
go version
mysql --version
git --version
```

---

# Install MySQL Server

## Windows

Install **MySQL Server** using winget:

```bash
winget install Oracle.MySQL
```

Verify instalation

```bash
mysql --version
```

If MySQL is not recognized after installation, add its path to your system PATH environment variable. Search for "Edit environment variables" in Windows.

Start the service

```bash
net start MySQL
```

If that doesnt work

```bash
net start MySQL84
```

# Clone repository

```bash
git clone https://github.com/jfong088/GoEcommerceSimulator.git
```

---

# Create the database

```bash
mysql -u root -p
```

```bash
CREATE DATABASE go_store;
```

```bash
exit
```

In the root project, execute the command

```bash
mysql -u root -p go_store < src/server/database/schema.sql
```

This will automatically execute the file
``` bash
database/schema.sql
```
---

# Install Go dependencies

```bash
cd backend 
go get golang.org/x/crypto/bcrypt
go get github.com/joho/godotenv
go get github.com/golang-jwt/jwt/v5
go get github.com/go-sql-driver-/mysql

go mod tidy
```

Configure environment variables
Create a .env file inside backend/ based on .env.example:

```go
DB_USER=root
DB_PASSWORD=password
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=go_store
JWT_SECRET=your_secret_key
PORT=8080
```

# Run the server

```
cd backend
go run main.go
```
# Testing the API
### Register an user
```bash
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"mail\":\"user@gmail.com\",\"password\":\"123\",\"role\":\"client\"}"

```
### Register an admin
```bash
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"mail\":\"admin@gmail.com\",\"password\":\"123\",\"role\":\"admin\"}"

```
### Login as an user 
```bash
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"mail\":\"user@gmail.com\",\"password\":\"123\"}"

```
### Login as an admin
```bash
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"mail\":\"admin@gmail.com\",\"password\":\"123\"}"
```
### Create new product (action only an admin can do)
```bash
curl -X POST http://localhost:8080/api/products -H "Content-Type: application/json" -H "Authorization: Bearer ADMIN_TOKEN" -d "{\"name\":\"Laptop\",\"price\":999.99,\"amount\":10}"
```
### See products
```bash
curl http://localhost:8080/api/products -H "Authorization: Bearer YOUR_TOKEN"
```
### Add to cart 
```bash
curl -X POST http://localhost:8080/api/cart -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"product_name\":\"Laptop\",\"cantidad\":1}"
```
### Make an order 
```bash
curl -X POST http://localhost:8080/api/orders -H "Authorization: Bearer YOUR_TOKEN"
```
### See history (action only an admin can do)
```bash
curl http://localhost:8080/api/orders/history -H "Authorization: Bearer ADMIN_TOKEN"
```