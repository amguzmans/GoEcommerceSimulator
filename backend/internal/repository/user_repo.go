package repository

import (
	"database/sql"

	"github.com/amguzmans/GoEcommerceSimulator/backend/internal/models"
)

func GetUserByMail(mail string, db *sql.DB) (*models.User, error) {
	var user models.User

	err := db.QueryRow(
		"SELECT id, mail, pass, role FROM users WHERE mail = ?", mail,
	).Scan(&user.ID, &user.Mail, &user.Password, &user.Role)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func CreateUser(mail, hashedPassword, role string, db *sql.DB) error {
	_, err := db.Exec(
		"INSERT INTO users (mail, pass, role) VALUES (?, ?, ?)",
		mail, hashedPassword, role,
	)
	return err
}
