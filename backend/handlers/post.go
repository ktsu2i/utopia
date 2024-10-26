package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetAllPosts(c echo.Context) error {
	return c.JSON(http.StatusOK, nil)
}
