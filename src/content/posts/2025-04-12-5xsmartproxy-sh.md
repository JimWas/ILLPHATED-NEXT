---
layout: "post"
title: "5xsmartproxy.sh"
date: "2025-04-12 18:58:05"
modified: "2025-04-12 18:58:05"
slug: "5xsmartproxy-sh"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/04/image-8.jpg"
featured_image_relative: "2025/04/image-8.jpg"
---

import requests
  
url = "https://scraper-api.smartproxy.com/v2/scrape"
  
payload = {
      "url": "https://illphated.com",
      "headless": "html"
}
  
headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "Basic VTAwMDAyNTgzOTk6UFdfMWFhYWQ3M2E0ZGY2OTAyZGE3Njg3OWU0NTZlNzM0YjJk"
}
  
response = requests.post(url, json=payload, headers=headers)
  
print(response.text)
