package middlewares

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/jurekbarth/gomailtracking/config"
	"github.com/jurekbarth/gomailtracking/helpers"
)

// AuthRequired is a middleware to check for a cookie
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := strings.Replace(c.GetHeader("Authorization"), "Bearer ", "", 1)
		token, err := jwt.Parse(authHeader, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			kid, ok := token.Header["kid"].(string)
			if !ok {
				return nil, errors.New("kid header not found")
			}
			keys := config.KeySet.LookupKeyID(kid)
			if len(keys) == 0 {
				return nil, fmt.Errorf("key %v not found", kid)
			}
			var key interface{} // This is the raw key, like *rsa.PrivateKey or *ecdsa.PrivateKey
			if err := keys[0].Raw(&key); err != nil {
				return nil, fmt.Errorf("failed to create public key: %s", err)
			}
			return key, nil
		})
		if err != nil {
			fmt.Println(err)
			helpers.RespondWithAPIError(c, http.StatusUnauthorized, "error verifying key")
			return
		}
		if !token.Valid {
			helpers.RespondWithAPIError(c, http.StatusUnauthorized, "invalid token")
			return
		}
		claims := token.Claims.(jwt.MapClaims)

		if claims["email_verified"] != true {
			helpers.RespondWithAPIError(c, http.StatusUnauthorized, "email not verified")
			return
		}

		userID := fmt.Sprintf("%v", claims["sub"])
		if !helpers.IsAdmin(userID) {
			helpers.RespondWithAPIError(c, http.StatusUnauthorized, "user is not an admin")
			return
		}

		c.Set("claims", claims)
		c.Set("userid", claims["sub"])

		c.Next()
	}
}
