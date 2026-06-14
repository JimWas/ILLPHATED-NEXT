---
layout: "post"
title: "Fadcam volume button script"
date: "2025-01-25 23:52:26"
modified: "2025-01-25 23:54:04"
slug: "fadcam-volume-button-script"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/01/1000006595.jpg"
featured_image_relative: "2025/01/1000006595.jpg"
---

[keysh](https://illphated.com/fadcam-volume-button-script/illphated/keysh/)

 

 

set -eu

# Time-out in seconds for single volume press
TO=0.150
# Time-out in seconds for holding down volume button
TO_HOLD=0.100
# Duration of vibration in ms
DUR_S=100
# How long to keep your phone awake when using volume buttons in ms
WL_MAX=1500

# Track the toggle state
STATE=0 # 0 = Start Activity, 1 = Stop Activity

on_both_pressed() {
if [ "$STATE" -eq 0 ]; then
# Launch RecordingStartActivity
cmd intent -t activity -p com.fadcam/.RecordingStartActivity
STATE=1
else
# Launch RecordingStopActivity
cmd intent -t activity -p com.fadcam/.RecordingStopActivity
STATE=0
fi
cmd vibrate $DUR_S
}

on_up() {
read -t $TO key && {
[ "$key" = "$PRESS_DOWN" ] && {
on_both_pressed
return
}
cmd volume current up
return
}
while true; do
read -t $TO_HOLD key || {
cmd volume current up
continue
}
return
done
}

on_down() {
read -t $TO key && {
[ "$key" = "$PRESS_UP" ] && {
on_both_pressed
return
}
cmd volume current down
return
}
while true; do
read -t $TO_HOLD key || {
cmd volume current down
continue
}
return
done
}

loop() {
while read key; do
cmd wakelock acquire $WL_MAX
case "$key" in
"$PRESS_UP" )
on_up
;;
"$PRESS_DOWN" )
on_down
;;
esac
cmd wakelock release
done
}

encode_list() {
ENCODED=""; for arg in "$@"; do
ENCODED="${ENCODED}${#arg}:${arg}"
done
ENCODED="${#ENCODED}:$ENCODED"
}
cmd() {
encode_list "$@";
echo "$ENCODED"
}

loop
