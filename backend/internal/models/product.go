package models

type Product struct {
	ID     int     `json:"id"`
	Name   string  `json:"name"`
	Price  float64 `json:"price"`
	Amount int     `json:"amount"`
}

type CreateProductRequest struct {
	Name   string  `json:"name"`
	Price  float64 `json:"price"`
	Amount int     `json:"amount"`
}
