---
layout: "post"
title: "Why is my VNC server connect on MACOS saying there is already a concurrent connection when I don't have one open"
date: "2025-06-18 18:17:26"
modified: "2025-06-18 18:17:26"
slug: "why-is-my-vnc-server-connect-on-macos-saying-there-is-already-a-concurrent-connection-when-i-dont-have-one-open"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/06/VNC-CONNECT-SESSION-IN-PROGRESS-ILLPHATED.png"
featured_image_relative: "2025/06/VNC-CONNECT-SESSION-IN-PROGRESS-ILLPHATED.png"
---

The "concurrent connection" message in macOS VNC (Screen Sharing or third-party VNC servers like RealVNC, TigerVNC, etc.) typically means the server thinks someone is already connected, even if there's no visible session. Here are the common causes and how to fix them:

🔍 Common Causes
Zombie Session / Stale Socket

A previous VNC session was not terminated properly and the server still thinks it’s active.

Often caused by force-quitting VNC clients or network drops.

Login Window User Session

macOS allows one GUI session at a time (per user). If you're trying to connect while someone else is logged in—or your user is logged in via GUI—it may count as a "concurrent" session.

VNC Server Misconfiguration or Bug

Some third-party VNC servers like TigerVNC or Vine Server may not clear state properly after a crash.

macOS Screen Sharing Restrictions

Apple's built-in screen sharing (VNC-compatible) allows only one session at a time, and it can get "stuck" if a session wasn’t cleanly closed.

✅ Fixes
🔄 Restart the VNC Server
For Apple’s built-in screen sharing:

bash
Copy
Edit
sudo /System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -restart -agent
For third-party VNC servers (e.g., TigerVNC):

bash
Copy
Edit
pkill -f vnc
# or specific command depending on which server you're using
🧹 Delete Stale Lock Files (for some servers)
Some VNC servers write lock files like .X0-lock or .vnc/*.pid. You can clear them:

bash
Copy
Edit
rm -f ~/.vnc/*.pid ~/.vnc/*.log
🧍‍♂️ Log Out All GUI Users
If a user is logged in to the Mac physically or remotely:

Log them out via Apple Menu > Log Out

Or kill the GUI session:

bash
Copy
Edit
sudo pkill loginwindow
🔐 Change VNC Server Settings
Check if your VNC server allows only one connection at a time and adjust that if your setup allows for multiple.

♻️ Reboot (if all else fails)
If you're unsure what process is holding it, just reboot the Mac:

bash
Copy
Edit
sudo reboot
🧠 Pro Tip: Check Active Sessions
Run this to see active Screen Sharing sessions:

bash
Copy
Edit
ps aux | grep ARDAgent
Or check for logged-in users:

bash
Copy
Edit
who
