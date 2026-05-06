package models

import "time"

type Order struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	ProductID int       `json:"product_id"`
	Cantidad  int       `json:"cantidad"`
	Status    string    `json:"status"`
	Fecha     time.Time `json:"fecha"`
}

type CartItem struct {
	Name     string  `json:"name"`
	Cantidad int     `json:"cantidad"`
	Price    float64 `json:"price"`
	Status   string  `json:"status"`
}

type AddToCartRequest struct {
	ProductName string `json:"product_name"`
	Cantidad    int    `json:"cantidad"`
}
