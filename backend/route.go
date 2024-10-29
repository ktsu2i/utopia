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
	api.POST("/check-username-exists", handlers.CheckUsernameExists)

	// JWT auth required
	api.POST("/logout", handlers.Logout)
	api.GET("/validate-token", handlers.ValidateToken)
	api.POST("/validate-text", handlers.ValidateText)
	api.GET("/me", handlers.GetCurrentUser)
	api.GET("/users", handlers.GetAllUsers)
	api.GET("/users/:id", handlers.GetUserById)
	api.DELETE("/users/:id", handlers.DeleteUserById)
	api.GET("/posts", handlers.GetPosts)
	api.POST("/posts", handlers.CreatePost)
	api.DELETE("/posts/:id", handlers.DeletePost)
}
