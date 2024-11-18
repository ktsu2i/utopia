package handlers

import (
	"backend/db"
	"backend/models"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func hash(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

func refreshToken(c echo.Context) error {
	cookie, err := c.Cookie("refresh_token")
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	token, err := jwt.ParseWithClaims(cookie.Value, &models.AccountClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	claims, ok := token.Claims.(*models.AccountClaims)
	if !ok || !token.Valid {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	newClaims := &models.AccountClaims{
		ID: claims.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 1)),
		},
	}

	// Create new JWT
	token = jwt.NewWithClaims(jwt.SigningMethodHS256, newClaims)
	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	// Set new JWT to HTTP-Only cookie
	cookie = &http.Cookie{
		Name:     "token",
		Value:    t,
		HttpOnly: true,
		Secure:   c.Scheme() == "https",
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
	}
	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, map[string]string{"id": newClaims.ID})
}

func ValidateToken(c echo.Context) error {
	cookie, err := c.Cookie("token")
	if err != nil {
		return refreshToken(c)
	}

	token, err := jwt.ParseWithClaims(cookie.Value, &models.AccountClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return refreshToken(c)
	}

	claims, ok := token.Claims.(*models.AccountClaims)
	if !ok {
		return refreshToken(c)
	}

	var u models.User
	if err := db.DB.Where("id = ?", claims.ID).First(&u).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "User not found"})
	}

	res := models.UserResult{
		ID:              u.ID,
		AccountName:     u.AccountName,
		Username:        u.Username,
		FirstName:       u.FirstName,
		LastName:        u.LastName,
		Email:           u.Email,
		ProfileImageUrl: u.ProfileImageUrl,
		Bio:             u.Bio,
		FollowingCount:  CountFollowing(u.ID),
		FollowedCount:   CountFollowed(u.ID),
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
	}

	return c.JSON(http.StatusOK, res)
}

func CheckUsernameExists(c echo.Context) error {
	var req models.UsernameParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	u := models.User{}
	if err := db.DB.Where("username = ?", req.Username).First(&u).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusOK, nil)
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusConflict, map[string]string{"message": "Username already exists"})
}

func CheckEmailExists(c echo.Context) error {
	var req models.EmailParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	u := models.User{}
	if err := db.DB.Where("email = ?", req.Email).First(&u).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusOK, nil)
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusConflict, map[string]string{"message": "Email already exists"})
}

func SignUp(c echo.Context) error {
	var req models.SignUpParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	hashed, err := hash(req.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	u := models.User{
		ID:             uuid.NewString(),
		AccountName:    req.AccountName,
		Username:       req.Username,
		Email:          req.Email,
		HashedPassword: hashed,
		CreatedAt:      time.Now().UTC(),
		UpdatedAt:      time.Now().UTC(),
	}

	if err := db.DB.Create(&u).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	// Create JWT claims
	claims := &models.AccountClaims{
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
		Path:     "/",
		Domain:   "localhost",
		SameSite: http.SameSiteLaxMode,
	}
	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, map[string]string{"message": "successfully registered"})
}

func Login(c echo.Context) error {
	var req models.LoginParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	var u models.User
	if err := db.DB.Where("email = ?", req.Email).First(&u).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "No user found"})
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.HashedPassword), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": err.Error()})
	}

	res := &models.UserResult{
		ID:              u.ID,
		AccountName:     u.AccountName,
		Username:        u.Username,
		FirstName:       u.FirstName,
		LastName:        u.LastName,
		Email:           u.Email,
		ProfileImageUrl: u.ProfileImageUrl,
		Bio:             u.Bio,
	}

	// Create JWT claims
	claims := &models.AccountClaims{
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
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
	}
	c.SetCookie(cookie)

	// Create refresh token
	refreshClaims := &models.AccountClaims{
		ID: u.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)),
		},
	}
	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	rt, err := newToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	// Set refresh token to HTTP-Only Cookie
	refreshCookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    rt,
		HttpOnly: true,
		Secure:   c.Scheme() == "https",
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
	}
	c.SetCookie(refreshCookie)

	return c.JSON(http.StatusOK, res)
}

func Logout(c echo.Context) error {
	cookie := &http.Cookie{
		Name:     "token",
		Value:    "",
		HttpOnly: true,
		Secure:   c.Scheme() == "https",
		Expires:  time.Unix(0, 0),
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
	}
	c.SetCookie(cookie)

	refreshCookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		HttpOnly: true,
		Secure:   c.Scheme() == "https",
		Expires:  time.Unix(0, 0),
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
	}
	c.SetCookie(refreshCookie)

	return c.JSON(http.StatusOK, map[string]string{"message": "successfully logged out"})
}
