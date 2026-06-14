---
layout: "post"
title: "How to Crawl Your Entire Site with JavaScript and UTM Parameters Using Crawlbase on macOS"
date: "2025-07-11 17:14:10"
modified: "2025-07-11 17:14:10"
slug: "how-to-crawl-your-entire-site-with-javascript-and-utm-parameters-using-crawlbase-on-macos"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/07/ChatGPT-Image-Jul-11-2025-01_13_57-PM.png"
featured_image_relative: "2025/07/ChatGPT-Image-Jul-11-2025-01_13_57-PM.png"
---

How to Crawl Your Entire Site with JavaScript and UTM Parameters Using Crawlbase on macOS
At illphated.com, I like to automate everything—especially when it comes to tracking page performance and how different links behave. Recently, I needed a reliable way to crawl all pages of my site, including those with dynamic JavaScript and UTM parameters, for SEO and analytics research.

Enter Crawlbase (formerly ProxyCrawl), a powerful scraping platform that supports real browser rendering—perfect for modern websites with JavaScript and multimedia.

Here’s how I automated crawling illphated.com from macOS using a simple shell script, including support for ?utm=1 through ?utm=999.

🔧 The Problem
Most scrapers choke on JavaScript-heavy pages or fail to simulate realistic browser traffic. I needed something that:

Renders JavaScript like a real browser

Handles multimedia and dynamic loading

Looks like a real user (not a bot)

Can cycle through all my UTM-tracked URLs

🚀 The Solution: Crawlbase + Shell Script
Using Crawlbase’s JavaScript token, I built a macOS script to crawl:

✅ Static pages like /about, /blog, etc.
✅ Dynamic URLs like /?utm=1 through /?utm=999
✅ Rendered JavaScript just like a real user would see
✅ A modern Windows Chrome user-agent to stay stealthy

🧠 The Script (Save as crawl_illphated.sh)



#!/bin/bash

# Crawlbase JavaScript Token
TOKEN="GqmUjbLgg1HOFyfYIQnhlQ"
BASE_URL="https://api.crawlbase.com"
SITE_URL="https://illphated.com"

# Latest Windows Chrome user-agent (July 2025)
USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36"

# Output directory
OUTPUT_DIR="./crawl_results"
mkdir -p "$OUTPUT_DIR"

# Encode URLs for the API
urlencode() {
  local raw="$1"
  python3 -c "import urllib.parse; print(urllib.parse.quote('''$raw''', safe=''))"
}

# Static paths to crawl
STATIC_PATHS=(
  ""
  "/about"
  "/blog"
  "/contact"
  "/travel"
  "/search?q=cyberpunk"
)

# Crawl static pages
echo "🚀 Crawling static pages..."
for path in "${STATIC_PATHS[@]}"; do
  FULL_URL="${SITE_URL}${path}"
  ENCODED_URL=$(urlencode "$FULL_URL")
  OUTPUT_FILE="$OUTPUT_DIR/$(echo "$path" | tr '/?' '__' | sed 's/^_//').html"

  echo "🔍 Crawling: $FULL_URL"
  curl -s -A "$USER_AGENT" 
       -H "Accept-Encoding: gzip" 
       "$BASE_URL/?token=$TOKEN&url=$ENCODED_URL&render=true" 
       -o "$OUTPUT_FILE"
  sleep 0.25
done

# Crawl all ?utm=1 to ?utm=999 URLs
echo "🚀 Crawling UTM query pages..."
for i in $(seq 1 999); do
  FULL_URL="${SITE_URL}/?utm=$i"
  ENCODED_URL=$(urlencode "$FULL_URL")
  OUTPUT_FILE="$OUTPUT_DIR/utm_$i.html"

  echo "🔍 Crawling: $FULL_URL"
  curl -s -A "$USER_AGENT" 
       -H "Accept-Encoding: gzip" 
       "$BASE_URL/?token=$TOKEN&url=$ENCODED_URL&render=true" 
       -o "$OUTPUT_FILE"
  sleep 0.25
done

echo "🎉 Full crawl complete! Results saved to $OUTPUT_DIR"






🧪 How to Run It on macOS
Save the script as crawl_illphated.sh

Make it executable:

bash
Copy
Edit
chmod +x crawl_illphated.sh
Run it:

bash
Copy
Edit
./crawl_illphated.sh
It will create a folder called crawl_results/ filled with rendered HTML files from every page crawled.

🎯 Why It’s Useful
This is perfect for:

Verifying UTM tracking link functionality

Benchmarking SEO and rendering speed

Testing dynamic elements or lazy-loaded content

Running offline snapshots of your website for archival or QA

👀 What’s Next?
Want to level it up?

Add link discovery to crawl deeper from internal pages

Parse HTML and export metadata (title, meta tags, H1s)

Auto-upload the data to S3 or Google Drive for backup

Schedule this script via cron for nightly automation

If you’re obsessed with automation like I am, this is just the beginning.

Follow @illphated for more web hacking, automation, and real-world digital wizardry.

🛰️
