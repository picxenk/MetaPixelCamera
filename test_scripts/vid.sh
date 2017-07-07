#!/bin/sh

# Configurations
WIDTH=1000
HEIGHT=1000
QUALITY=100
PREFIX=img

DATE=$(date +"%Y-%m-%d_%H%M%S")
OUTFILE=$PREFIX$DATE.jpg

#raspistill -w $WIDTH -h $HEIGHT -q $QUALITY -th 100:100:70 -t 250 -o $OUTFILE
raspivid -t 20000 -w 640 -h 480 -fps 25 -b 1200000 -p 0,0,640,480 -o pivideo.h264
