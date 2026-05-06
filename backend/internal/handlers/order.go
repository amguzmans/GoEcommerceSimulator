package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/middleware"
	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/models"
	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/repository"
	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/services"
)

func AddToCart(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(middleware.UserIDKey).(int)

		var req models.AddToCartRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if err := services.AddToCart(userID, req.ProductName, req.Cantidad, db); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": req.ProductName + " added to cart"})
	}
}

func GetCart(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(middleware.UserIDKey).(int)

		items, err := services.GetCart(userID, db)
		if err != nil {
			http.Error(w, "Could not fetch cart", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(items)
	}
}

func PlaceOrder(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(middleware.UserIDKey).(int)

		total, err := services.PlaceOrder(userID, db)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Order placed successfully",
			"total":   total,
		})
	}
}

func GetOrderHistory(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		role := r.Context().Value(middleware.RoleKey).(string)
		if role != "admin" {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		orders, err := repository.GetOrderHistory(db)
		if err != nil {
			http.Error(w, "Could not fetch orders", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(orders)
	}
}
