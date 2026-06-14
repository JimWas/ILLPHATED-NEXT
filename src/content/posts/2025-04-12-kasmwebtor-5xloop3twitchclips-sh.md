---
layout: "post"
title: "kasmwebtor-5xloop3twitchclips.sh"
date: "2025-04-12 18:58:42"
modified: "2025-04-12 18:58:42"
slug: "kasmwebtor-5xloop3twitchclips-sh"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/04/Gemini_Generated_Image_e2w11ce2w11ce2w1.jpeg"
featured_image_relative: "2025/04/Gemini_Generated_Image_e2w11ce2w11ce2w1.jpeg"
---

#!/bin/bash

# Define port range
port_start=6909
port_end=6916  # 8 instances

# Function to start Docker containers in the same terminal window
start_containers() {
    for ((i=0; i<=5; i++)); do
        port=$((port_start + i))
        # Run each container in detached mode to avoid TTY issues
        docker run --rm -d --shm-size=512m -p $port:6901 -e VNC_PW=password -e LAUNCH_URL=https://www.twitch.tv/illphated/clip/TacitLivelyPheasantPanicBasket-rBlf9snYxlceVI0w kasmweb/tor-browser:1.16.0
    done
}

# Infinite loop to kill all containers and restart them every 10 minutes
while true; do
    echo "Killing all Docker containers..."
    
    # Get the list of running containers and kill them if any exist
    running_containers=$(docker ps -q)
    if [ -n "$running_containers" ]; then
        docker kill $running_containers
    else
        echo "No running containers to kill."
    fi

    # Wait for containers to stop
    sleep 20

    echo "Starting all Docker containers..."
    start_containers

    # Wait for 10 minutes before restarting everything
    sleep 500
done
