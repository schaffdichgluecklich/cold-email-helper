package controllers

import (
	b64 "encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/smtp"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/parser"
	"github.com/google/uuid"

	"github.com/jordan-wright/email"
	"github.com/jurekbarth/gomailtracking/config"
	"github.com/jurekbarth/gomailtracking/helpers"
)

func openEmail(filename string) *Email {
	jsonFile, err := os.Open(filename)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var mail Email

	err = json.Unmarshal(byteValue, &mail)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	return &mail

}

func GetTrackingPixel() gin.HandlerFunc {
	return func(c *gin.Context) {
		uuidParam := c.Param("uuid")
		cleanUUID := strings.TrimSuffix(uuidParam, filepath.Ext(uuidParam))
		filename := helpers.GetFileForUUID(cleanUUID)
		if filename == nil {
			c.Data(http.StatusNotFound, "text/plain", []byte("not found"))
			return
		}
		filenameString := fmt.Sprintf("%v/files/%v", config.RootFileDirectory, *filename)
		mail := openEmail(filenameString)
		if mail == nil {
			c.Data(http.StatusNotFound, "text/plain", []byte("not found"))
			return
		}
		mmail := *mail
		currentTime := time.Now()
		mmail.Opened = append(mmail.Opened, currentTime.Format(time.RFC3339))
		jsonContents, err := json.Marshal(mmail)
		if err != nil {
			fmt.Println(err)
			c.Data(http.StatusNotFound, "text/plain", []byte("not found"))
			return
		}
		err = ioutil.WriteFile(filenameString, jsonContents, 0644)
		if err != nil {
			fmt.Println(err)
			c.Data(http.StatusNotFound, "text/plain", []byte("not found"))
			return
		}
		c.File(fmt.Sprintf("%v/beacon.png", config.RootFileDirectory))
	}
}

func GetLink() gin.HandlerFunc {
	return func(c *gin.Context) {
		uuidParam := c.Param("uuid")
		linkHashParam := c.Param("hash")
		linkBytes, err := b64.StdEncoding.DecodeString(linkHashParam)
		if err != nil {
			fmt.Println(err)
			c.Data(http.StatusNotFound, "text/plain", []byte("not found"))
			return
		}
		link := string(linkBytes)
		filename := helpers.GetFileForUUID(uuidParam)
		if filename == nil {
			c.Data(http.StatusNotFound, "text/plain", []byte("not found"))
			return
		}
		filenameString := fmt.Sprintf("%v/files/%v", config.RootFileDirectory, *filename)
		mail := openEmail(filenameString)
		if mail == nil {
			c.Data(http.StatusNotFound, "text/plain", []byte("not found"))
			return
		}
		mmail := *mail
		_, exists := mmail.LinkClicks[link]
		currentTime := time.Now()
		timeString := currentTime.Format(time.RFC3339)
		if exists {
			mmail.LinkClicks[link] = append(mmail.LinkClicks[link], timeString)
		} else {

			if len(mmail.LinkClicks) == 0 {
				mmail.LinkClicks = make(map[string][]string)
			}
			mmail.LinkClicks[link] = []string{timeString}
		}
		jsonContents, err := json.Marshal(mmail)
		if err != nil {
			fmt.Println(err)
			c.Data(http.StatusNotFound, "text/plain", []byte("not found"))
			return
		}
		err = ioutil.WriteFile(filenameString, jsonContents, 0644)
		if err != nil {
			fmt.Println(err)
			c.Data(http.StatusNotFound, "text/plain", []byte("not found"))
			return
		}
		c.Redirect(http.StatusTemporaryRedirect, string(link))
	}
}

func subreplacer(s string, emailID string) string {
	s = strings.ReplaceAll(s, "\"", "")
	base64encoded := b64.StdEncoding.EncodeToString([]byte(s))
	return fmt.Sprintf("\"https://yourdomain.tld/l/%v/%v\"", emailID, base64encoded)
}

func replacer(s string, emailID string) string {
	re := regexp.MustCompile(`(?i)("https?:\/\/[^\s]+")`)
	if strings.Contains(s, "https://yourdomain.tld") {
		return s
	}
	return re.ReplaceAllStringFunc(s, func(ss string) string { return subreplacer(ss, emailID) })
}

func SendMail() gin.HandlerFunc {
	return func(c *gin.Context) {
		extensions := parser.CommonExtensions | parser.AutoHeadingIDs
		parser := parser.NewWithExtensions(extensions)
		var emailInput EmailInput
		if err := c.ShouldBindJSON(&emailInput); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		md := []byte(emailInput.Message)
		uuidWithHyphen := uuid.New()
		html := fmt.Sprintf("<!DOCTYPE html><html><head><meta charset=\"UTF-8\"></head><body><div>%v<img src=\"https://email.heyper.link/mailassets/%v.png\"/></div></body></html>", string(markdown.ToHTML(md, parser, nil)), uuidWithHyphen.String())

		re := regexp.MustCompile(`(?i)<a (.+ )?href="([^"]+)"([^>]+)?>`)
		html = re.ReplaceAllStringFunc(html, func(ss string) string { return replacer(ss, uuidWithHyphen.String()) })

		fileName := fmt.Sprintf("%v/files/%v--%v.json", config.RootFileDirectory, emailInput.To, uuidWithHyphen.String())
		contents := Email{
			Message:   emailInput.Message,
			From:      emailInput.From,
			To:        emailInput.To,
			Subject:   emailInput.Subject,
			CreatedAt: time.Now(),
			UUID:      uuidWithHyphen.String(),
		}
		jsonContents, err := json.Marshal(contents)
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		e := email.NewEmail()
		e.From = emailInput.From
		e.To = []string{emailInput.To}
		e.Subject = emailInput.Subject
		e.Text = []byte(emailInput.Message)
		e.HTML = []byte(html)
		if !config.IsDev && config.IsProd {
			err = e.Send("smtp.gmail.com:587", smtp.PlainAuth("", config.EmailUser, config.EmailPassword, "smtp.gmail.com"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}

		err = ioutil.WriteFile(fileName, jsonContents, 0644)
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	}
}

func PreviewMail() gin.HandlerFunc {
	return func(c *gin.Context) {
		extensions := parser.CommonExtensions | parser.AutoHeadingIDs
		parser := parser.NewWithExtensions(extensions)
		var emailInput EmailInput
		if err := c.ShouldBindJSON(&emailInput); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		md := []byte(emailInput.Message)
		html := markdown.ToHTML(md, parser, nil)

		c.JSON(http.StatusOK, gin.H{
			"html":    string(html),
			"from":    emailInput.From,
			"to":      emailInput.To,
			"subject": emailInput.Subject,
		})
	}
}

func ListMails() gin.HandlerFunc {
	return func(c *gin.Context) {
		extensions := parser.CommonExtensions | parser.AutoHeadingIDs

		files, err := ioutil.ReadDir(config.RootFileDirectory + "/files")
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		mails := []Email{}
		for _, f := range files {
			filenameString := fmt.Sprintf("%v/files/%v", config.RootFileDirectory, f.Name())
			mail := openEmail(filenameString)
			if mail != nil {
				mmail := *mail
				md := []byte(mmail.Message)
				parser := parser.NewWithExtensions(extensions)
				mmail.Message = string(markdown.ToHTML(md, parser, nil))
				mails = append(mails, mmail)
			}
		}

		c.JSON(http.StatusOK, mails)
	}
}
