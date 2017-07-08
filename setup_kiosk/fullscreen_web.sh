#!/bin/bash
chromium-browser \
    --disable \
    --disable-translate \
    --disable-infobars \
    --disable-suggestions-service \
    --disable-save-password-bubble \
    --disk-cache-dir=$CHROMIUM_TEMP/cache/ \
    --user-data-dir=$CHROMIUM_TEMP/user_data/ \
    --start-maximized \
    --noerrdialogs \
    --incognito \
    --kiosk "http://localhost/kiosk.html" &
sleep 5
xdotool search --sync --onlyvisible --class "chromium" key F11
