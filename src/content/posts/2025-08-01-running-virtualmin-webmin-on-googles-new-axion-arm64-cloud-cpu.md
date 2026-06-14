---
layout: "post"
title: "Running Virtualmin & Webmin on Google\u2019s New Axion Arm64 Cloud CPU"
date: "2025-08-01 14:53:42"
modified: "2025-08-01 14:53:42"
slug: "running-virtualmin-webmin-on-googles-new-axion-arm64-cloud-cpu"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/08/ChatGPT-Image-Aug-1-2025-10_53_22-AM.png"
featured_image_relative: "2025/08/ChatGPT-Image-Aug-1-2025-10_53_22-AM.png"
---

Google recently dropped their Axion CPU — an Arm‑based monster built for speed, efficiency, and cloud‑scale workloads. It powers the new C4A VM family inside Google Cloud, giving you up to 50% better performance and 60% less power usage compared to similar x86 instances. Pretty wild.

But here’s the question I had: Can you run Virtualmin/Webmin on it?
The short answer: Yes — but with a couple of tweaks.

🧠 Quick Background
Virtualmin is a popular web hosting control panel built on Webmin. It lets you easily manage Apache/Nginx, MySQL/PostgreSQL, mail servers, DNS, FTP — all from a browser.

Normally, it’s targeted at x86_64 servers, but Google’s Axion is ARM64 (Arm Neoverse V2, Arm v9). That means some packages need a little massaging before everything plays nice.

✅ The Good News
Webmin works flawlessly on ARM64.

Virtualmin mostly works out‑of‑the‑box.

You can use Ubuntu 24.04 LTS ARM64, Debian 12/13 ARM64, or other supported distros on Google C4A.

For web hosting only (no mail), installation is smooth.

⚠️ The “Gotchas” You Might Hit
No official ARM64 Virtualmin repos yet

You might see warnings like:

nginx
Copy
Edit
Skipping acquire of configured file 'main/binary-arm64/Packages' …
Totally normal — it just means no ARM64‑specific repo exists, so it falls back to universal packages.

Email features need extra work

The package procmail-wrapper isn’t built for ARM64 in Virtualmin’s repos.

If you need mail (Postfix, SpamAssassin, etc.), you’ll have to compile procmail-wrapper manually.

🛠 Fixing the Mail Issue
If you plan to run email on your Virtualmin setup:

bash
Copy
Edit
cd /root
wget https://raw.githubusercontent.com/virtualmin/procmail-wrapper/master/procmail-wrapper.c
gcc procmail-wrapper.c -o procmail-wrapper
mv /usr/bin/procmail-wrapper /usr/bin/procmail-wrapper.backup
cp procmail-wrapper /usr/bin/procmail-wrapper
chmod 4755 /usr/bin/procmail-wrapper
Now mail delivery should work like normal.

🚀 Install Steps on Axion C4A
Deploy a VM on Google Cloud using:

Ubuntu 24.04 LTS ARM64

Debian 12 ARM64

Update system & install prerequisites

bash
Copy
Edit
sudo apt update && sudo apt upgrade -y
sudo apt install wget curl -y
Run Virtualmin install script

bash
Copy
Edit
wget http://software.virtualmin.com/gpl/scripts/install.sh
sudo /bin/sh install.sh
Fix mail (if needed) using the steps above.

📋 Compatibility Summary
Feature	Works on Axion ARM64?
Webmin core	✅ Yes
Virtualmin core	⚠️ Mostly yes
Virtualmin Pro ARM64 support	❌ Not yet
Mail / procmail-wrapper	⚠️ Needs manual fix
DNS, MySQL, Apache, Nginx	✅ Yes

🎯 Final Thoughts
If you’re running a web hosting control panel on Google’s new Axion Arm64 CPUs, Virtualmin/Webmin is 100% doable.

For web‑only hosting: smooth sailing.
For mail hosting: be ready to recompile one tiny component.

In exchange, you get the raw speed, power savings, and scale that Axion C4A VMs deliver — and you’re future‑proofing your stack in an ARM‑driven cloud world.
