package models

type User struct {
	ID       int    `json:"id"`
	Mail     string `json:"mail"`
	Password string `json:"-"`
	Role     string `json:"role"`
}

type RegisterRequest struct {
	Mail     string `json:"mail"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type LoginRequest struct {
	Mail     string `json:"mail"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
