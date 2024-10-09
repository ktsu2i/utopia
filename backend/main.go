package main

import (
	"backend/db"
	"backend/handlers"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	db.Init()
	e := echo.New()

	// Middleware
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())

	// CORS settings
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowCredentials: true,
	}))

	api := e.Group("/api")
	api.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey:  []byte("secret"), // change secret
		TokenLookup: "cookie:token",
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(handlers.AccountClaims)
		},
		Skipper: func(c echo.Context) bool {
			path := c.Path()
			return path == "/api/sign-up" || path == "/api/login"
		},
	}))

	// API routes
	route(e)

	// Run server
	e.Logger.Fatal(e.Start(":8080"))
}
