package routes

import "github.com/labstack/echo/v4"

func RegisterRoutes(e *echo.Echo) {
	e.GET("/user", getAllUsers)
	e.GET("/user/:id", getUserById)
}
