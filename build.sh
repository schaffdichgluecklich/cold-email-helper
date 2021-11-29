#!/bin/sh

GOOS=linux GOARCH=amd64 go build

scp gomailtracking username@192.168.2.1:/username
# include for new server
scp gomailtracking.service username@192.168.2.1:/etc/systemd/system

ssh username@192.168.2.1 sudo systemctl stop gomailtracking
ssh username@192.168.2.1 systemctl daemon-reload
ssh username@192.168.2.1 mv /username/gomailtracking /var/www/


ssh username@192.168.2.1 sudo systemctl start gomailtracking
ssh username@192.168.2.1 sudo systemctl enable gomailtracking