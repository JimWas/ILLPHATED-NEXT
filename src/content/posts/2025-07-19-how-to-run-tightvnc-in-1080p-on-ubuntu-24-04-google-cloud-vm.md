---
layout: "post"
title: "How to Run TightVNC in 1080p on Ubuntu 24.04 Google Cloud VM"
date: "2025-07-19 19:00:48"
modified: "2025-07-19 19:00:48"
slug: "how-to-run-tightvnc-in-1080p-on-ubuntu-24-04-google-cloud-vm"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/07/ChatGPT-Image-Jul-19-2025-03_00_38-PM.png"
featured_image_relative: "2025/07/ChatGPT-Image-Jul-19-2025-03_00_38-PM.png"
---

How to Run TightVNC in 1080p on Ubuntu 24.04 Google Cloud VM
If you're running an Ubuntu 24.04 virtual machine on Google Cloud and need remote desktop access, TightVNC is a lightweight and efficient solution. However, by default, VNC sessions start at low resolutions, which can make remote work frustrating.

This guide shows you how to install TightVNC and run it in Full HD (1920x1080 resolution) on a Google Cloud VM.

Why Use TightVNC?
Lightweight and fast for cloud environments

Works well over SSH tunnels

Compatible with multiple VNC clients

No graphical display attached needed (perfect for headless servers)

Step 1: Set Up Your Google Cloud VM
Make sure your Google Cloud VM:

Runs Ubuntu 24.04

Has the firewall rule open for TCP port 5901 (or use SSH tunneling for security)

Step 2: Install TightVNC and XFCE4
Update your system:

bash
Copy
Edit
sudo apt update
sudo apt install tightvncserver xfce4 xfce4-goodies dbus-x11 -y
Step 3: Start VNC for the First Time
Run:

bash
Copy
Edit
vncserver :1
You'll be asked to set a VNC password.
This starts the VNC server with a default low resolution, but you’ll fix that in the next step.

Step 4: Configure 1080p Resolution
Kill the default VNC session:

bash
Copy
Edit
vncserver -kill :1
Now restart VNC with Full HD resolution:

bash
Copy
Edit
vncserver :1 -geometry 1920x1080 -depth 24
Step 5: Set Up XFCE4 for TightVNC
Edit the xstartup file:

bash
Copy
Edit
nano ~/.vnc/xstartup
Replace its contents with:

bash
Copy
Edit
#!/bin/bash
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS

export XDG_SESSION_TYPE=x11
export XDG_CURRENT_DESKTOP=XFCE
export DESKTOP_SESSION=xfce

xrdb $HOME/.Xresources || true

if [ -z "$DBUS_SESSION_BUS_ADDRESS" ]; then
    eval $(dbus-launch --sh-syntax --exit-with-session)
fi

startxfce4 &
Make it executable:

bash
Copy
Edit
chmod +x ~/.vnc/xstartup
Step 6: Connect to Your Server
Use your favorite VNC viewer (RealVNC, TigerVNC, TightVNC client, etc.)
Connect to:

makefile
Copy
Edit
your-server-ip:5901
If you're concerned about security, consider SSH tunneling instead of exposing port 5901 to the internet:

bash
Copy
Edit
ssh -L 5901:localhost:5901 youruser@yourserverip
Then connect your VNC viewer to localhost:5901.

Optional: Prevent Display Errors
If XFCE complains about "Unable to change RandR display settings," you can disable display auto-detection by creating this file:

bash
Copy
Edit
mkdir -p ~/.config/xfce4/xfconf/xfce-perchannel-xml
nano ~/.config/xfce4/xfconf/xfce-perchannel-xml/displays.xml
Paste:

xml
Copy
Edit



  
  
    
  

Summary
Command	Purpose
vncserver :1 -geometry 1920x1080 -depth 24	Start VNC in 1080p
chmod +x ~/.vnc/xstartup	Ensure VNC can run XFCE4
SSH Tunnel	Secure remote access

Final Thoughts
Running TightVNC in Full HD on Google Cloud Ubuntu 24.04 is a simple way to get a remote desktop without the overhead of heavier solutions like Remote Desktop Protocol (RDP).

This setup works great for:

Managing servers visually

Running lightweight GUI apps

Teaching and demonstrations in the cloud

Need help automating this setup or deploying multiple desktops on Google Cloud?
Drop a comment or reach out on illphated.com.
