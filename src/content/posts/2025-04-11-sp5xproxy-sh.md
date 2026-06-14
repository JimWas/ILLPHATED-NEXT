---
layout: "post"
title: "SP5xproxy.sh"
date: "2025-04-11 22:29:15"
modified: "2025-04-11 22:29:15"
slug: "sp5xproxy-sh"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/04/JOI_HERO_ILLPHATED_4.jpg"
featured_image_relative: "2025/04/JOI_HERO_ILLPHATED_4.jpg"
---

#!/bin/bash

# Full path to your Python script
SCRIPT="/Users/jamescoder/smartproxy.py"

# Infinite loop
while true; do
    echo "Launching 5 parallel processes..."

    # Launch 5 instances in parallel
    python3 "$SCRIPT" &
    python3 "$SCRIPT" &
    python3 "$SCRIPT" &
    python3 "$SCRIPT" &
    python3 "$SCRIPT" &

    # Wait for all 5 to complete before looping again
    wait

    echo "All 5 finished. Restarting loop..."
done
