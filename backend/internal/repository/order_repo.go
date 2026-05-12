package repository

import (
	"database/sql"

	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/models"
)

func AddToCart(userID, productID, cantidad int, db *sql.DB) error {
	_, err := db.Exec(
		"INSERT INTO orders (id_user, id_product, cantidad, order_status) VALUES (?, ?, ?, 'in cart')",
		userID, productID, cantidad,
	)
	return err
}

func GetCart(userID int, db *sql.DB) ([]models.CartItem, error) {
	rows, err := db.Query(`
        SELECT p.name, o.cantidad, p.price, o.order_status
        FROM orders o
        JOIN products p ON o.id_product = p.id
        WHERE o.id_user = ? AND o.order_status = 'in cart'
    `, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []models.CartItem{}
	for rows.Next() {
		var item models.CartItem
		rows.Scan(&item.Name, &item.Cantidad, &item.Price, &item.Status)
		items = append(items, item)
	}

	return items, nil
}

func GetCartTotal(userID int, db *sql.DB) (float64, error) {
	var total float64

	err := db.QueryRow(`
        SELECT SUM(p.price * o.cantidad)
        FROM orders o
        JOIN products p ON o.id_product = p.id
        WHERE o.id_user = ? AND o.order_status = 'in cart'
    `, userID).Scan(&total)

	return total, err
}

func PlaceOrder(userID int, db *sql.DB) error {
	_, err := db.Exec(
		"UPDATE orders SET order_status = 'completed' WHERE id_user = ? AND order_status = 'in cart'",
		userID,
	)
	return err
}

func GetOrderHistory(db *sql.DB) ([]models.Order, error) {
	rows, err := db.Query(`
        SELECT o.id, o.id_user, o.id_product, o.cantidad, o.order_status, o.fecha
        FROM orders o
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	orders := []models.Order{}
	for rows.Next() {
		var o models.Order
		rows.Scan(&o.ID, &o.UserID, &o.ProductID, &o.Cantidad, &o.Status, &o.Fecha)
		orders = append(orders, o)
	}

	return orders, nil
}
