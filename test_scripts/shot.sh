#!/bin/sh

# Configurations
WIDTH=1000
HEIGHT=1000
QUALITY=100
PREFIX=img

DATE=$(date +"%Y-%m-%d_%H%M%S")
OUTFILE=$PREFIX$DATE.jpg

#raspistill -n -w $WIDTH -h $HEIGHT -q $QUALITY -th none -t 250 -o $OUTFILE
#raspistill -n -q $QUALITY -th none -t 250 -o $OUTFILE
#raspistill -w $WIDTH -h $HEIGHT -q $QUALITY -th 100:100:70 -t 250 -o $OUTFILE
raspistill -vf -ex night -w $WIDTH -h $HEIGHT -q $QUALITY -th 100:100:70 -t 250 -o $OUTFILE

scp $OUTFILE picxenk@192.168.0.17:./MPScreenServer/MPCams/1/
