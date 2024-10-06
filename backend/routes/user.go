package routes

import (
	"backend/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func getAllUsers(c echo.Context) error {
	us, err := models.GetAllUsers()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, us)
}

func getUserById(c echo.Context) error {
	id := c.Param("id")
	u, err := models.GetUserById(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, u)
}
