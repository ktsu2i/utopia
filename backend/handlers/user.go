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

func CountFollowing(userID string) int64 {
	var count int64
	if err := db.DB.Model(&models.Follower{}).
		Where("following_id = ?", userID).
		Count(&count).Error; err != nil {
		return 0
	}

	return count
}

func CountFollowed(userID string) int64 {
	var count int64
	if err := db.DB.Model(&models.Follower{}).
		Where("followed_id = ?", userID).
		Count(&count).Error; err != nil {
		return 0
	}

	return count
}

func GetUserID(c echo.Context) (string, error) {
	cookie, err := c.Cookie("token")
	if err != nil {
		return "", fmt.Errorf("cookie not found")
	}

	claims := &models.AccountClaims{}
	token, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil || !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	if claims.ID == "" {
		return "", fmt.Errorf("userID not found")
	}

	return claims.ID, nil
}

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

func GetAllUsers(c echo.Context) error {
	us := []models.User{}
	if db.DB.Find(&us).Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Users not found"})
	}

	res := []models.UserResult{}
	for _, u := range us {
		r := models.UserResult{
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
		res = append(res, r)
	}
	return c.JSON(http.StatusOK, res)
}

func GetUserById(c echo.Context) error {
	currentUserID, err := GetUserID(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
	}

	id := c.Param("id")
	u := models.User{}
	if db.DB.Where("id = ?", id).First(&u).Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "User not found"})
	}

	isFollowing := false
	if err := db.DB.Model(&models.Follower{}).Where("following_id = ? AND followed_id = ?", currentUserID, id).First(&models.Follower{}).Error; err == nil {
		isFollowing = true
	}

	isFollowed := false
	if err := db.DB.Model(&models.Follower{}).Where("following_id = ? AND followed_id = ?", id, currentUserID).First(&models.Follower{}).Error; err == nil {
		isFollowed = true
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
		IsFollowing:     isFollowing,
		IsFollowed:      isFollowed,
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
	}
	return c.JSON(http.StatusOK, res)
}

func UpdateUser(c echo.Context) error {
	id := c.Param("id")

	var req models.UserUpdateParams
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	var u models.User
	if err := db.DB.Where("id = ?", id).First(&u).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "User not found"})
	}

	if req.AccountName != "" {
		u.AccountName = req.AccountName
	}
	if req.Username != "" {
		u.Username = req.Username
	}
	if req.FirstName != "" {
		u.FirstName = req.FirstName
	}
	if req.LastName != "" {
		u.LastName = req.LastName
	}
	if req.Bio != "" {
		u.Bio = req.Bio
	}

	if err := db.DB.Save(&u).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "User successfully updated"})
}

func DeleteUserById(c echo.Context) error {
	id := c.Param("id")
	if db.DB.Where("id = ?", id).Delete(&models.User{}).RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "User not found"})
	}

	NotifyClients("delete_user")

	return c.JSON(http.StatusOK, map[string]string{"message": "User deleted successfully"})
}
