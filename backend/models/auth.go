package models

import "github.com/golang-jwt/jwt/v5"

// Request
type SignUpParams struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UsernameParams struct {
	Username string `json:"username"`
}

// JWT claims
type AccountClaims struct {
	ID string `json:"id"`
	jwt.RegisteredClaims
}
