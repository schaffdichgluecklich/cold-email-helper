package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jurekbarth/gomailtracking/config"
	"github.com/jurekbarth/gomailtracking/controllers"
	"github.com/jurekbarth/gomailtracking/middlewares"
)

func main() {
	config.Initialize()

	if !config.IsDev && config.IsProd {
		fmt.Println("Running in production")
	}
	r := gin.Default()
	r.Use(middlewares.Cors())

	r.GET("/mailassets/:uuid", controllers.GetTrackingPixel())
	r.GET("/l/:uuid/:hash", controllers.GetLink())
	api := r.Group("/api")

	api.Use(middlewares.AuthRequired())

	api.POST("/mail/send", controllers.SendMail())
	api.GET("/mail", controllers.ListMails())

	api.POST("/mail/preview", controllers.PreviewMail())

	r.Run(":5555")
}
