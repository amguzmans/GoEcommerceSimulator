package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/middleware"
	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/models"
	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/services"
)

func GetProducts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		products, err := services.GetProducts(db)
		if err != nil {
			http.Error(w, "Could not fetch products", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(products)
	}
}

func CreateProduct(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		role := r.Context().Value(middleware.RoleKey).(string)
		if role != "admin" {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		var req models.CreateProductRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if err := services.CreateProduct(req.Name, req.Price, req.Amount, db); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "Product created"})
	}
}
