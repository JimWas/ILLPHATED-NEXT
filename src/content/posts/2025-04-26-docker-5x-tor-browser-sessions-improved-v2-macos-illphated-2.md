---
layout: "post"
title: "DOCKER 5X TOR BROWSER SESSIONS IMPROVED V2 MACOS ILLPHATED"
date: "2025-04-26 16:18:25"
modified: "2025-04-26 16:18:25"
slug: "docker-5x-tor-browser-sessions-improved-v2-macos-illphated-2"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/04/ChatGPT-Image-Apr-26-2025-10_43_48-AM.png"
featured_image_relative: "2025/04/ChatGPT-Image-Apr-26-2025-10_43_48-AM.png"
---

python3 -m venv env
source env/bin/activate






DOCKER-COMPOSE.YML

services:
  tor_browser:
    image: kasmweb/tor-browser:1.16.0
    deploy:
      replicas: 5
    ports:
      - "6909-6916:6901"
    environment:
      VNC_PW: password
      LAUNCH_URL: https://illphated.com/
    shm_size: 768m
    restart: always
    command: >
      /bin/bash -c "
        (sleep $((600 + RANDOM % 60)) && kill 1) &
        /dockerstartup/vnc_startup.sh
      "
Since Docker Compose V2, the version: field at the top of docker-compose.yml is no longer needed and is ignored.
The warning you see:

csharp
Copy
Edit
WARN[0003] ... docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
just means: "Hey, you don't need version: '3.8' anymore, just remove it."

How to fix it cleanly:
Simply edit your docker-compose.yml and delete the version: '3.8' line completely.

Your docker-compose.yml should now start like this:

yaml
Copy
Edit
services:
  tor_browser:
    image: kasmweb/tor-browser:1.16.0
    deploy:
      replicas: 8
    ports:
      - "6909-6916:6901"
    environment:
      VNC_PW: password
      LAUNCH_URL: https://tinyurl.com/3hfeb3zu
    shm_size: 768m
    restart: always
    command: >
      /bin/bash -c "
        (sleep $((600 + RANDOM % 60)) && kill 1) &
        /dockerstartup/vnc_startup.sh
      "
✅ After that, docker-compose up -d will run without any warnings.
