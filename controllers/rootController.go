package controllers

import "time"

type EmailInput struct {
	Message string `json:"message" binding:"required"`
	From    string `json:"from" binding:"required"`
	To      string `json:"to" binding:"required"`
	Subject string `json:"subject" binding:"required"`
}

type Email struct {
	Message    string              `json:"message" binding:"required"`
	From       string              `json:"from" binding:"required"`
	To         string              `json:"to" binding:"required"`
	Subject    string              `json:"subject" binding:"required"`
	CreatedAt  time.Time           `json:"createdat" binding:"required"`
	UUID       string              `json:"uuid" binding:"required"`
	Opened     []string            `json:"opened" binding:"required"`
	LinkClicks map[string][]string `json:"linkclicks" binding:"required"`
}
