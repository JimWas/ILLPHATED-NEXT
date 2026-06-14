---
layout: "post"
title: "How to Install Google\u00a0Chrome & Chromedriver on Ubuntu\u202f24.04 (July\u202f2025\u00a0Guide)"
date: "2025-07-04 23:37:26"
modified: "2025-07-04 23:37:26"
slug: "how-to-install-google-chrome-chromedriver-on-ubuntu-24-04-july-2025-guide"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/07/Screenshot-2025-07-04-at-7.36.04\u202fPM.png"
featured_image_relative: "2025/07/Screenshot-2025-07-04-at-7.36.04\u202fPM.png"
---

How to Install Google Chrome & Chromedriver on Ubuntu 24.04 (July 2025 Guide)
Quick‑look: Get the latest Google Chrome 138 & a matching Chromedriver on Ubuntu 24.04 using apt, keep them auto‑updated, and learn when you actually need them for tools like Streamlink.

Why this matters in 2025 🔒
Chrome 138.0.7204.92 is the current stable build for Linux, rolling out in early July 2025 alongside urgent zero‑day patches. Keeping your browser and driver updated is critical for security and automated testing pipelines. 
chromereleases.googleblog.com
thehackernews.com

Prerequisites
bash
Copy
Edit
sudo apt update && sudo apt upgrade -y
sudo apt install wget gnupg unzip -y   # utilities we’ll need
1 — Install Google Chrome via apt
Google’s .deb package adds the official repository so future apt upgrade runs keep Chrome patched automatically.

bash
Copy
Edit
# 1. Download the latest stable .deb
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

# 2. Install & pull dependencies
sudo apt install ./google-chrome-stable_current_amd64.deb -y
Launch with:

bash
Copy
Edit
google-chrome
Tip: Check your version anytime:

bash
Copy
Edit
google-chrome --version   # should report 138.0.7204.xx or newer
chromereleases.googleblog.com

2 — Install a Matching Chromedriver
Chromedriver must match Chrome’s major version (138.*).

Option A — Ubuntu repo (works for Chromium only)
bash
Copy
Edit
sudo apt install chromium-chromedriver -y
Good for open‑source Chromium users, but it often lags behind Google Chrome.

Option B — Exact match for Google Chrome (recommended)
1. Find your full Chrome build:

bash
Copy
Edit
google-chrome --version
# e.g. Google Chrome 138.0.7204.92
2. Download the same major version’s driver:

bash
Copy
Edit
CHROME_VER=$(google-chrome --version | awk '{print $3}' | cut -d'.' -f1)
wget -q "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_VER}" -O /tmp/LATEST
VER=$(cat /tmp/LATEST)
wget "https://chromedriver.storage.googleapis.com/${VER}/chromedriver_linux64.zip"
unzip chromedriver_linux64.zip
chmod +x chromedriver
sudo mv chromedriver /usr/local/bin/
3. Verify:

bash
Copy
Edit
chromedriver --version   # "ChromeDriver 138.0.xxxx.yyy"
3 — Installing Chromium (optional)
Prefer the open‑source build?

bash
Copy
Edit
sudo apt install chromium-browser -y   # may install as a snap
If you want the pure .deb build without Snap, see our separate guide.

4 — Do You Need Chrome for Streamlink? 🤔
Short answer: no. Streamlink pulls streams directly; Chrome/Chromedriver are only useful if you:

1. Automate login‑protected sites with Selenium.
2. Extract auth cookies/tokens, then pass them to Streamlink with --http-cookie.

Unless you’re scripting that workflow, stick to streamlink + mpv/vlc.

5 — Keeping Everything Updated
Because the .deb added /etc/apt/sources.list.d/google-chrome.list, Chrome will track new 138.x security fixes automatically:

bash
Copy
Edit
sudo apt update && sudo apt upgrade
Repeat the Chromedriver download whenever Chrome’s major version bumps (139, 140, …).

SEO‑Friendly FAQ
Question	Answer (2025)
Latest Chrome for Ubuntu?	138.0.7204.92 on Linux. 
whatismybrowser.com
Is Chromedriver in Ubuntu’s repos?	Yes, but only for Chromium (chromium-chromedriver).
Can I install Chrome with Snap?	Google provides only .deb; Snap installs Chromium, not Chrome.
Does Streamlink need a browser?	No. Only required for advanced automation/login scraping.

Final Thoughts
That’s all you need to keep Google Chrome and Chromedriver humming on Ubuntu 24.04 in 2025. Secure browsing, reliable Selenium tests, and optional Streamlink workflows—sorted!

Enjoy the neon‑lit web, and if this helped, check out our other Linux guides on illphated.com 🚀
