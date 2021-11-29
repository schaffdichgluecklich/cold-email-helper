package config

import (
	"log"
	"os"

	"github.com/lestrrat-go/jwx/jwk"
)

var cognitoKeys = "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_abc/.well-known/jwks.json"

var cognitoIssuer = "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_abc"

// CognitoUserPoolID for user creation
var CognitoUserPoolID = "eu-central-1_abc"

// S3Region public
const S3Region = "eu-central-1"

// KeySet public
var KeySet *jwk.Set

// IsDev Env
var IsDev = os.Getenv("DEV") == "true"

// IsProd Env
var IsProd = os.Getenv("PROD") == "true"

// RootFileDirectory for storage
var RootFileDirectory = os.Getenv("GOMAILTRACKING_FILES")

// EmailUser for storage
var EmailUser = os.Getenv("GOMAILTRACKING_USER")

// EmailPassword for storage
var EmailPassword = os.Getenv("GOMAILTRACKING_PASSWORD")

// Initialize gets called once on app start
func Initialize() {
	var err error
	KeySet, err = jwk.Fetch(cognitoKeys)
	if err != nil {
		log.Fatal(err)
		return
	}
}
