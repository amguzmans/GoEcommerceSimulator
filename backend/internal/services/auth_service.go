package services

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/models"
	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

func Register(mail, password, role string, db *sql.DB) error {
	if mail == "" || password == "" || role == "" {
		return fmt.Errorf("all fields are required")
	}

	role = strings.ToLower(role)
	if role != "admin" && role != "client" {
		return fmt.Errorf("role must be 'admin' or 'client'")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return fmt.Errorf("could not hash password")
	}

	return repository.CreateUser(mail, string(hashed), role, db)
}

func Login(mail, password string, db *sql.DB) (*models.User, error) {
	if mail == "" || password == "" {
		return nil, fmt.Errorf("all fields are required")
	}

	user, err := repository.GetUserByMail(mail, db)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	return user, nil
}
