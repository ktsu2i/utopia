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
	api.POST("/check-email-exists", handlers.CheckEmailExists)
	api.GET("/ws", handlers.HandleWebSocket)

	// JWT auth required
	api.POST("/logout", handlers.Logout)
	api.GET("/validate-token", handlers.ValidateToken)
	api.POST("/validate-text", handlers.ValidateText)
	api.GET("/me", handlers.GetCurrentUser)
	api.GET("/users", handlers.GetAllUsers)
	api.GET("/users/:id", handlers.GetUserById)
	api.PATCH("/users/:id", handlers.UpdateUser)
	api.DELETE("/users/:id", handlers.DeleteUserById)
	api.GET("/posts", handlers.GetPosts)
	api.GET("/posts/:id", handlers.GetPost)
	api.POST("/posts", handlers.CreatePost)
	api.DELETE("/posts/:id", handlers.DeletePost)
	api.GET("/parent-replies", handlers.GetParentReplies)
	api.GET("/parent-replies/:postId/count", handlers.CountParentReplies)
	api.GET("/replies", handlers.GetChildReplies)
	api.GET("/replies/:id", handlers.GetReply)
	api.GET("/replies/:id/count", handlers.CountChildReplies)
	api.POST("/replies", handlers.CreateReply)
	api.DELETE("/replies/:id", handlers.DeleteReply)
	api.GET("/emojis", handlers.GetEmojis)
	api.POST("/reactions", handlers.AddReaction)
	api.DELETE("/reactions/:id", handlers.DeleteReaction)
	api.GET("/followers", handlers.GetFollowers)
	api.POST("/followers/:followedId", handlers.Follow)
	api.DELETE("/followers/:followedId", handlers.Unfollow)
	api.GET("/messages", handlers.GetMessages)
	api.POST("/messages", handlers.CreateMessage)
	api.DELETE("/messages/:id", handlers.DeleteMessage)
}
