---
layout: "post"
title: "kasmwebtorSH"
date: "2025-04-17 16:40:57"
modified: "2025-04-17 16:40:57"
slug: "kasmwebtorsh"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/04/Gemini_Generated_Image_tll8rptll8rptll8.jpeg"
featured_image_relative: "2025/04/Gemini_Generated_Image_tll8rptll8rptll8.jpeg"
---

#!/bin/bash

# Define port range
port_start=6909
port_end=6916  # 8 instances

# Function to start Docker containers in the same terminal window
start_containers() {
    for ((i=0; i<=3; i++)); do
        port=$((port_start + i))
        # Run each container in detached mode to avoid TTY issues
        docker run --rm -d --shm-size=512m -p $port:6901 -e VNC_PW=password -e LAUNCH_URL=https://www.twitch.tv/illphated kasmweb/tor-browser:1.16.0
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
    sleep 25

    echo "Starting all Docker containers..."
    start_containers

    # Wait for 10 minutes before restarting everything
    sleep 300
done
