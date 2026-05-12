package repository

import (
	"database/sql"

	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/models"
)

func GetAllProducts(db *sql.DB) ([]models.Product, error) {
	rows, err := db.Query("SELECT id, name, price, amount FROM products")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	products := []models.Product{}
	for rows.Next() {
		var p models.Product
		rows.Scan(&p.ID, &p.Name, &p.Price, &p.Amount)
		products = append(products, p)
	}

	return products, nil
}

func CreateProduct(name string, price float64, amount int, db *sql.DB) error {
	_, err := db.Exec(
		"INSERT INTO products (name, price, amount) VALUES (?, ?, ?)",
		name, price, amount,
	)
	return err
}

func GetProductByName(name string, db *sql.DB) (*models.Product, error) {
	var p models.Product

	err := db.QueryRow(
		"SELECT id, name, price, amount FROM products WHERE LOWER(name) = LOWER(?)", name,
	).Scan(&p.ID, &p.Name, &p.Price, &p.Amount)

	if err != nil {
		return nil, err
	}

	return &p, nil
}

func UpdateStock(name string, amount int, db *sql.DB) error {
	_, err := db.Exec(
		"UPDATE products SET amount = ? WHERE name = ?", amount, name,
	)
	return err
}

func UpdatePrice(name string, price float64, db *sql.DB) error {
	_, err := db.Exec(
		"UPDATE products SET price = ? WHERE name = ?", price, name,
	)
	return err
}
