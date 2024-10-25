package handlers

import (
	"backend/db"
	"backend/models"
	"fmt"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func GetCurrentUser(c echo.Context) error {
	cookie, err := c.Cookie("token")
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	token, err := jwt.ParseWithClaims(cookie.Value, &models.AccountClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	claims, ok := token.Claims.(*models.AccountClaims)
	if !ok || !token.Valid {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	var u models.User
	if err := db.DB.Where("id = ?", claims.ID).First(&u).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "User not found"})
	}

	res := models.UserResult{
		ID:              u.ID,
		FirstName:       u.FirstName,
		LastName:        u.LastName,
		Username:        u.Username,
		Email:           u.Email,
		ProfileImageUrl: u.ProfileImageUrl,
		Bio:             u.Bio,
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
	}

	return c.JSON(http.StatusOK, res)
}

func GetAllUsers(c echo.Context) error {
	us := []models.User{}
	if db.DB.Find(&us).Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Users not found"})
	}

	res := []models.UserResult{}
	for _, u := range us {
		r := models.UserResult{
			ID:              u.ID,
			FirstName:       u.FirstName,
			LastName:        u.LastName,
			Username:        u.Username,
			Email:           u.Email,
			ProfileImageUrl: u.ProfileImageUrl,
			Bio:             u.Bio,
			CreatedAt:       u.CreatedAt,
			UpdatedAt:       u.UpdatedAt,
		}
		res = append(res, r)
	}
	return c.JSON(http.StatusOK, res)
}

func GetUserById(c echo.Context) error {
	id := c.Param("id")
	u := models.User{}
	if db.DB.Where("id = ?", id).First(&u).Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "User not found"})
	}

	res := models.UserResult{
		ID:              u.ID,
		FirstName:       u.FirstName,
		LastName:        u.LastName,
		Username:        u.Username,
		Email:           u.Email,
		ProfileImageUrl: u.ProfileImageUrl,
		Bio:             u.Bio,
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
	}
	return c.JSON(http.StatusOK, res)
}

func DeleteUserById(c echo.Context) error {
	id := c.Param("id")
	if db.DB.Where("id = ?", id).Delete(&models.User{}).RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "User not found"})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "User deleted successfully"})
}
