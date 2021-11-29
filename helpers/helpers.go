package helpers

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jurekbarth/gomailtracking/config"
)

// RespondWithAPIError for API Requests
func RespondWithAPIError(c *gin.Context, code int, message interface{}) {
	c.AbortWithStatusJSON(code, gin.H{"error": message})
}

// RespondWithNotFound for regular request
func RespondWithNotFound(c *gin.Context) {
	c.HTML(http.StatusNotFound, "404.tmpl", gin.H{})
}

func find(slice []string, val string) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}

// IsAdmin checks if user is admin
func IsAdmin(userID string) bool {
	sdgID := "to-be-changed-user-id"
	admins := []string{sdgID}
	return find(admins, userID)
}

// GetFileForUUID searches for file with UUID
func GetFileForUUID(searchString string) *string {
	files, err := ioutil.ReadDir(config.RootFileDirectory + "/files")
	if err != nil {
		fmt.Println(err)
		return nil
	}
	for _, f := range files {
		filename := f.Name()
		s := strings.Split(filename, "--")
		length := len(s)
		if length == 2 {
			cleanUUID := strings.TrimSuffix(s[1], ".json")
			if cleanUUID == searchString {
				return &filename
			}
		}
	}
	return nil
}
