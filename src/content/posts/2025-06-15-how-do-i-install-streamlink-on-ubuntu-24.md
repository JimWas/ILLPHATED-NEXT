---
layout: "post"
title: "How do I install streamlink on ubuntu 24"
date: "2025-06-15 10:11:01"
modified: "2025-06-15 10:11:01"
slug: "how-do-i-install-streamlink-on-ubuntu-24"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/06/ChatGPT-Image-Jun-15-2025-05_10_29-AM.png"
featured_image_relative: "2025/06/ChatGPT-Image-Jun-15-2025-05_10_29-AM.png"
---

Here are your best options to install Streamlink on Ubuntu 24.04 LTS:

🟢 Option 1: Install via APT (PPA)
This is the easiest method, but may not provide the latest version:

bash
Copy
Edit
sudo apt update
sudo add-apt-repository ppa:nilarimogard/webupd8        # add PPA
sudo apt update
sudo apt install streamlink
This installs Streamlink along with recommended media players (VLC/mpv), which might pull desktop dependencies 
pypi.org
+11
linode.com
+11
reddit.com
+11
.

🟡 Option 2: Install via pip (recommended for most users)
This ensures you get the latest official release:

Remove any previous APT installation, if present:

bash
Copy
Edit
sudo apt remove streamlink python3-streamlink
Confirm you have Python and pip:

bash
Copy
Edit
sudo apt update
sudo apt install python3-pip python3-venv
Install Streamlink for your user only (avoids system conflicts):

bash
Copy
Edit
pip3 install --upgrade --user streamlink
Add Streamlink to your PATH (usually ~/.local/bin):

bash
Copy
Edit
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.profile
source ~/.profile
Verify installation:

bash
Copy
Edit
streamlink --version
Streamlink 7.4.0 was just released on June 8, 2025 
linode.com
pypi.org
+1
streamlink.github.io
+1
.

🟣 Option 3: Use Virtual Environments or pipx
To isolate the installation:

With venv:

bash
Copy
Edit
python3 -m venv ~/stream-env
source ~/stream-env/bin/activate
pip install --upgrade streamlink
# Use via: streamlink [...]
deactivate
With pipx (handy CLI isolation):

bash
Copy
Edit
pip3 install --user pipx
pipx install streamlink
Both options avoid interfering with system packages and ensure the latest version 
reddit.com
+5
streamlink.github.io
+5
github.com
+5
en.ubunlog.com
.

🔁 Post-Install Usage
Once installed, run:

bash
Copy
Edit
streamlink [OPTIONS]  [QUALITY]
For example, to play a Twitch stream at best quality via VLC:

bash
Copy
Edit
streamlink -p vlc https://www.twitch.tv/CHANNEL best
Or without specifying a player:

bash
Copy
Edit
streamlink twitch.tv/CHANNEL best
linode.com
snapcraft.io
+7
linode.com
+7
en.ubunlog.com
+7
en.ubunlog.com

✅ Summary
Method	Pros	Cons
APT PPA	Easy installation	May lag behind latest version; pulls extra dependencies
pip	Latest release, lightweight	Requires user-level PATH setup
venv/pipx	Isolated, clean install	Slightly more setup initial overhead
