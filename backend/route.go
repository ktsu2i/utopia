package main

import (
	"backend/handlers"

	"github.com/labstack/echo/v4"
)

func route(e *echo.Echo) {
	api := e.Group("/api")
	api.GET("/users", handlers.GetAllUsers)
	api.GET("/users/:id", handlers.GetUserById)
}
