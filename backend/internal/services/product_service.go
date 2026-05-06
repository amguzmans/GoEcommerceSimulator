package services

import (
	"database/sql"
	"fmt"
	"sync"

	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/models"
	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/repository"
)

var mu sync.Mutex

func GetProducts(db *sql.DB) ([]models.Product, error) {
	return repository.GetAllProducts(db)
}

func CreateProduct(name string, price float64, amount int, db *sql.DB) error {
	if name == "" {
		return fmt.Errorf("name is required")
	}
	if price <= 0 {
		return fmt.Errorf("price must be greater than 0")
	}
	if amount < 0 {
		return fmt.Errorf("amount cannot be negative")
	}

	return repository.CreateProduct(name, price, amount, db)
}

func AddToCart(userID int, productName string, cantidad int, db *sql.DB) error {
	mu.Lock()
	defer mu.Unlock()

	if cantidad <= 0 {
		return fmt.Errorf("cantidad must be greater than 0")
	}

	product, err := repository.GetProductByName(productName, db)
	if err != nil {
		return fmt.Errorf("product '%s' not found", productName)
	}

	if cantidad > product.Amount {
		return fmt.Errorf("insufficient stock, only %d available", product.Amount)
	}

	err = repository.AddToCart(userID, product.ID, cantidad, db)
	if err != nil {
		return err
	}

	return repository.UpdateStock(product.Name, product.Amount-cantidad, db)
}

func GetCart(userID int, db *sql.DB) ([]models.CartItem, error) {
	return repository.GetCart(userID, db)
}

func PlaceOrder(userID int, db *sql.DB) (float64, error) {
	mu.Lock()
	defer mu.Unlock()

	cart, err := repository.GetCart(userID, db)
	if err != nil || len(cart) == 0 {
		return 0, fmt.Errorf("cart is empty")
	}

	total, err := repository.GetCartTotal(userID, db)
	if err != nil {
		return 0, err
	}

	err = repository.PlaceOrder(userID, db)
	if err != nil {
		return 0, err
	}

	return total, nil
}
