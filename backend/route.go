package main

import (
	"backend/handlers"

	"github.com/labstack/echo/v4"
)

func route(e *echo.Echo) {
	api := e.Group("/api")

	// No JWT auth required
	api.POST("/sign-up", handlers.SignUp)
	api.POST("/login", handlers.Login)

	// JWT auth required
	api.POST("/logout", handlers.Logout)
	api.GET("/validate-token", handlers.ValidateToken)
	api.GET("/users", handlers.GetAllUsers)
	api.GET("/users/:id", handlers.GetUserById)
}
