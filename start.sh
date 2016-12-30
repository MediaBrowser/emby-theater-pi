#/bin/sh

xset s off         # don't activate screensaver
xset -dpms         # disable DPMS (Energy Star) features.
xset s noblank     # don't blank the video device

xdotool mousemove 2000 2000

/usr/local/bin/electron /home/pi/emby-theater-pi cec-client
