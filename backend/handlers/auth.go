package handlers

import (
	"backend/db"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

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

// JWT claims
type AccountClaims struct {
	ID string `json:"id"`
	jwt.RegisteredClaims
}

// DB
type User struct {
	ID             string    `json:"id"`
	FirstName      string    `json:"firstName"`
	LastName       string    `json:"lastName"`
	Username       string    `json:"username"`
	Email          string    `json:"email"`
	HashedPassword string    `json:"hashed_password"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

func hash(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

func ValidateToken(c echo.Context) error {
	cookie, err := c.Cookie("token")
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	token, err := jwt.ParseWithClaims(cookie.Value, &AccountClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	claims, ok := token.Claims.(*AccountClaims)
	if !ok || !token.Valid {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	return c.JSON(http.StatusOK, map[string]string{"id": claims.ID})
}

func SignUp(c echo.Context) error {
	var req SignUpParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	hashed, err := hash(req.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	u := User{
		ID:             uuid.NewString(),
		Username:       req.Username,
		Email:          req.Email,
		HashedPassword: hashed,
	}

	if err := db.DB.Create(&u).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	// Create JWT claims
	claims := &AccountClaims{
		ID: u.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 1)),
		},
	}

	// Create JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	// Set JWT to HTTP-Only Cookie
	cookie := &http.Cookie{
		Name:     "token",
		Value:    t,
		HttpOnly: true,
		Secure:   c.Scheme() == "https",
		MaxAge:   3600, // 1 hour
		Path:     "/",
		Domain:   "localhost",
		SameSite: http.SameSiteStrictMode,
	}
	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, map[string]string{"message": "successfully registered"})
}

func Login(c echo.Context) error {
	var req LoginParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	var u User
	if err := db.DB.Where("email = ?", req.Email).First(&u).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "No user found"})
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.HashedPassword), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": err.Error()})
	}

	// Create JWT claims
	claims := &AccountClaims{
		ID: u.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 1)),
		},
	}

	// Create JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	// Set JWT to HTTP-Only Cookie
	cookie := &http.Cookie{
		Name:     "token",
		Value:    t,
		HttpOnly: true,
		Secure:   c.Scheme() == "https",
		MaxAge:   3600, // 1 hour
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
	}
	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, map[string]string{"message": "successfully logged in"})
}

func Logout(c echo.Context) error {
	cookie := &http.Cookie{
		Name:     "token",
		Value:    "",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Unix(0, 0),
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
	}
	c.SetCookie(cookie)
	return c.JSON(http.StatusOK, map[string]string{"message": "successfully logged out"})
}
