---
layout: "post"
title: "How I Launched 5,000 ScraperAPI Jobs Automatically from My Mac (Without Going Crazy)"
date: "2025-07-12 15:32:19"
modified: "2025-07-12 15:32:19"
slug: "how-i-launched-5000-scraperapi-jobs-automatically-from-my-mac-without-going-crazy"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/07/ChatGPT-Image-Jul-12-2025-11_31_33-AM.png"
featured_image_relative: "2025/07/ChatGPT-Image-Jul-12-2025-11_31_33-AM.png"
---

How I Launched 5,000 ScraperAPI Jobs Automatically from My Mac (Without Going Crazy)
How I Launched 5,000 ScraperAPI Jobs Automatically from My Mac (Without Going Crazy)
Posted by illphated
Category: Automation | Coding | Web Scraping

Lately, I’ve been experimenting with ways to automate web scraping tasks across multiple devices, proxies, and job types. I wanted to run a lot of requests—fast, in parallel, and with a cool-down loop between each batch. Here's how I pulled off running 5,000 async ScraperAPI jobs directly from my Mac, hands-free.

🧪 The Goal
I wanted to:

Launch 50 parallel POST requests every 3 minutes

Repeat that cycle 100 times

Automate everything via a shell script

Trigger ScraperAPI jobs with rendering, screenshots, and geo-targeting

Why? Mostly for fun, testing resiliency, and proving I could.

🐍 The Python Code (What Runs in Parallel)
This Python snippet uses requests.post() to launch a job via ScraperAPI's async endpoint:

python
Copy
Edit
import requests

r = requests.post(
    url="https://async.scraperapi.com/jobs",
    json={
        "apiKey": "9adf6ad54b6b25649b5a1ddd40a22409",
        "urls": ["https://illphated.com"],
        "apiParams": {
            "render": "true",
            "screenshot": "true",
            "wait_for_selector": "g34h4h4h",
            "binary_target": "true",
            "device_type": "desktop",
            "country_code": "us"
        }
    }
)
print(r.text)
That’s one job. But I needed 5,000.

🛠️ The Shell Script (50 Parallel Requests x 100 Loops)
Here’s the bash script I wrote on macOS that runs 50 of those Python scripts in parallel, waits for all of them to finish, then does it again 99 more times.

bash
Copy
Edit
#!/bin/bash

PARALLEL=50     # How many jobs per cycle
REPEAT=100      # How many cycles
INTERVAL=180    # Seconds between each cycle (3 minutes)

PYTHON_CODE='import requests

r = requests.post(
    url="https://async.scraperapi.com/jobs",
    json={
        "apiKey": "9adf6ad54b6b25649b5a1ddd40a22409",
        "urls": ["https://illphated.com"],
        "apiParams": {
            "render": "true",
            "screenshot": "true",
            "wait_for_selector": "g34h4h4h",
            "binary_target": "true",
            "device_type": "desktop",
            "country_code": "us"
        }
    }
)
print(r.text)
'

# Write temp file
echo "$PYTHON_CODE" > temp_post_script.py

for i in $(seq 1 $REPEAT); do
  echo "Run #$i starting at $(date)"
  for j in $(seq 1 $PARALLEL); do
    python3 temp_post_script.py &
  done
  wait
  echo "Run #$i completed at $(date)"
  [ $i -lt $REPEAT ] && sleep $INTERVAL
done

rm temp_post_script.py
⚙️ How to Run It
Save that script as repeat_parallel_post_requests.sh

Make it executable:

bash
Copy
Edit
chmod +x repeat_parallel_post_requests.sh
Then just:

bash
Copy
Edit
./repeat_parallel_post_requests.sh
And boom—watch your terminal flood like a ScraperAPI super soaker.

💡 Lessons Learned
ScraperAPI's async endpoint is way more scalable than trying to block on responses.

Doing this from macOS Terminal works well, but you’ll want to use tmux or redirect logs if you’re AFK.

If you're doing something like this in production, set throttle and error handling, especially for rate-limited services.

📎 Want the Code?
I’ll drop the full script on my GitHub soon, or hit me up if you want help setting it up.

Stay ill,
– illphated
