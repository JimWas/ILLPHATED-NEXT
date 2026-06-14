---
layout: "post"
title: "911Proxy Illphated"
date: "2025-08-03 20:09:16"
modified: "2025-08-03 20:09:16"
slug: "911proxy-illphated"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/08/image-5.jpg"
featured_image_relative: "2025/08/image-5.jpg"
---

webscraper script UNIX LINUX ubuntu24


#!/bin/bash

# Script: scraper-loop.sh
# Purpose: Run scraper query every 10 seconds

while true; do
    curl -X POST "https://scraper.911proxy.com/v1/query" 
         -H "Authorization: Basic cHJvLWlsbHBoYXRlZDpUZXJyYWZvcm0zMzY=" 
         -H "Content-Type: application/json" 
         -d '{
               "source": "uni-scraper",
               "context": {
                   "url": "https://illphated.com",
                   "screenshot_type": 2
               },
               "geo": "US",
               "locale": "en-US",
               "js_render": true,
               "format": ["html","png"]
             }'
    
    # Wait 10 seconds before the next run
    sleep 10
done
