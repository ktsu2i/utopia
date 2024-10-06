package main

import (
	"backend/db"
	"backend/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	db.Init()
	e := echo.New()
	routes.RegisterRoutes(e)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
	}))
	// e.GET("/", func(c echo.Context) error {
	// 	return c.JSON(http.StatusOK, map[string]string{
	// 		"message": "Hello, World!",
	// 	})
	// })
	e.Logger.Fatal(e.Start(":1323"))
}
