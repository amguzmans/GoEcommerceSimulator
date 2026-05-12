package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/amguzmans/GoEcommerceSimulator/backend/database"
	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/handlers"
	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/middleware"
	"github.com/joho/godotenv"
)

func main() {

	godotenv.Load()

	db, err := database.Connect()
	if err != nil {
		log.Fatal("Could not connect to database:", err)
	}
	defer db.Close()

	mux := http.NewServeMux()

	// Auth - rutas públicas
	mux.HandleFunc("POST /api/auth/register", handlers.Register(db))
	mux.HandleFunc("POST /api/auth/login", handlers.Login(db))

	// Products
	mux.Handle("GET /api/products", middleware.Auth(handlers.GetProducts(db)))
	mux.Handle("POST /api/products", middleware.Auth(handlers.CreateProduct(db)))
	mux.Handle("POST /api/products/external", middleware.Auth(handlers.AddExternalProduct(db)))
	mux.Handle("DELETE /api/products/{id}", middleware.Auth(handlers.DeleteProduct(db)))
	// Cart
	mux.Handle("GET /api/cart", middleware.Auth(handlers.GetCart(db)))
	mux.Handle("POST /api/cart", middleware.Auth(handlers.AddToCart(db)))

	// Orders
	mux.Handle("POST /api/orders", middleware.Auth(handlers.PlaceOrder(db)))
	mux.Handle("GET /api/orders/history", middleware.Auth(handlers.GetOrderHistory(db)))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, middleware.CORS(mux)))
}
