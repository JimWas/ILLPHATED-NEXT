---
layout: "post"
title: "Staggered KASM WEB TOR DOCKER LOADER MACOS ILLPHATED"
date: "2025-07-14 15:02:52"
modified: "2025-07-14 15:02:52"
slug: "staggered-kasm-web-tor-docker-loader-macos-illphated"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/07/ChatGPT-Image-Jul-14-2025-11_01_49-AM.png"
featured_image_relative: "2025/07/ChatGPT-Image-Jul-14-2025-11_01_49-AM.png"
---

Here’s your full revised script with randomized staggered container startups over up to 5 minutes total.

Complete Script
bash
Copy
Edit
#!/bin/bash

# ======= Configuration ========
PORT_START=6909
PORT_END=6916  # 8 instances total (inclusive)
VNC_PORT_INTERNAL=6901
VNC_PASSWORD="password"
LAUNCH_URL="https://www.twitch.tv/illphated/"
CONTAINER_IMAGE="kasmweb/tor-browser:1.16.0"
CONTAINER_PREFIX="tor_instance"

MIN_RUNTIME_SEC=600   # 10 minutes before restart
MAX_TOTAL_START_DELAY=300  # 5 minutes total for all containers to start

# ======= Utility Functions ========
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

start_containers_randomly() {
    local ports=()
    for ((port=PORT_START; port0; i--)); do
        j=$((RANDOM % (i+1)))
        tmp=${ports[i]}
        ports[i]=${ports[j]}
        ports[j]=$tmp
    done

    local total_delay=0

    for idx in "${!ports[@]}"; do
        local port=${ports[$idx]}
        local name="${CONTAINER_PREFIX}_${port}"

        # Calculate remaining time and containers left
        local containers_left=$(( ${#ports[@]} - idx ))
        local max_remaining_delay=$(( MAX_TOTAL_START_DELAY - total_delay ))

        # Random delay for this container
        local delay=0
        if (( containers_left > 1 )); then
            local max_delay_for_this=$(( max_remaining_delay / containers_left ))
            delay=$(( (RANDOM % (max_delay_for_this + 1)) + 10 ))  # Base delay of at least 10s
        fi

        total_delay=$(( total_delay + delay ))

        (
            sleep $total_delay
            log "Starting container $name on port $port after ${total_delay}s total delay..."
            docker run -d 
                --name "$name" 
                --shm-size=512m 
                -p $port:$VNC_PORT_INTERNAL 
                -e VNC_PW=$VNC_PASSWORD 
                -e LAUNCH_URL=$LAUNCH_URL 
                $CONTAINER_IMAGE
        ) &
    done

    wait  # Wait for all background processes
    log "All containers launched over ${total_delay}s total delay."
}

cleanup_running_containers() {
    local containers=$(docker ps --filter "name=${CONTAINER_PREFIX}_" -q)
    if [ -n "$containers" ]; then
        log "Stopping containers with prefix ${CONTAINER_PREFIX}_..."
        docker stop $containers
        log "Removing containers..."
        docker rm $containers
    else
        log "No containers to stop."
    fi
}

# ======= Main Loop ========
while true; do
    cleanup_running_containers
    sleep 10

    log "Starting new set of containers with randomized staggered delays..."
    start_containers_randomly

    log "Sleeping for $((MIN_RUNTIME_SEC / 60)) minutes before restart..."
    sleep $MIN_RUNTIME_SEC
done
Features Recap:
Randomized port order

Random staggered launches over 5 minutes max

10+ second minimum per-container delay to avoid instant starts

Cleans up containers before restarting the loop

How to Run:
Save as tor_random_launcher.sh

Run:

bash
Copy
Edit
chmod +x tor_random_launcher.sh
./tor_random_launcher.sh
