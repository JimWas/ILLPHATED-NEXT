---
layout: "post"
title: "How to enable Windows file sharing on your steam deck"
date: "2025-07-15 17:40:56"
modified: "2025-07-15 17:40:56"
slug: "how-to-enable-windows-file-sharing-on-your-steam-deck"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/07/file_00000000af1462309d4b1eb73fcdd96b.png"
featured_image_relative: "2025/07/file_00000000af1462309d4b1eb73fcdd96b.png"
---

Here’s a step-by-step guide to share files from your Steam Deck to your Windows laptop over Wi-Fi using SMB (Samba):

Step 1: Enable Desktop Mode on Steam Deck

1. Hold the power button on your Steam Deck.


2. Select Switch to Desktop to enter KDE Plasma desktop mode.




---

Step 2: Install and Configure Samba (SMB Server)

Install Samba

1. Open Discover Store or Konsole terminal.


2. In Konsole, run:

sudo pacman -S samba


3. If prompted for a password, use your sudo password (default is usually deck unless changed).




---

Configure Samba

1. Edit Samba config file:

sudo nano /etc/samba/smb.conf


2. Add this section at the bottom to share a folder (replace /home/deck/Shared with your folder path):

[SteamDeckShare]
path = /home/deck/Shared
browseable = yes
read only = no
guest ok = yes
create mask = 0777
directory mask = 0777


3. Save & exit nano:

Press CTRL + X, then Y, then Enter.





---

Create the Shared Folder

mkdir /home/deck/Shared
chmod 777 /home/deck/Shared


---

Set Samba User (Optional for Security)

If you want to set a username/password (recommended for privacy):

sudo smbpasswd -a deck

Enter a password you’ll remember.


---

Start Samba Services

sudo systemctl enable smb nmb
sudo systemctl start smb nmb


---

Step 3: Find Your Steam Deck IP Address

Run in terminal:

ip addr

Look for your Wi-Fi interface (usually wlan0) and note the inet IP address (example: 192.168.1.45).


---

Step 4: Access the Steam Deck SMB Share from Windows

1. On your Windows laptop, press Win + R.


2. Type:

\192.168.X.XSteamDeckShare

Replace 192.168.X.X with your Steam Deck’s IP.


3. If prompted for credentials:

Username: deck

Password: the one you set with smbpasswd (or leave blank if you enabled guest access).





---

Optional: Make the Share Persistent

In Windows:

1. Open File Explorer.


2. Right-click This PC > Map Network Drive.


3. Choose a letter (e.g., Z:) and enter:

\192.168.X.XSteamDeckShare


4. Check Reconnect at sign-in.




---

Summary Checklist:

Task	Command / Action

Install Samba	sudo pacman -S samba
Create folder	mkdir ~/Shared
Edit config	sudo nano /etc/samba/smb.conf
Start services	sudo systemctl enable --now smb nmb
Access from Windows	\[Steam Deck IP]SteamDeckShare



---

Troubleshooting Tips

Firewall: Steam Deck’s firewall may block SMB. Disable it temporarily for testing:

sudo systemctl stop firewalld

Windows Network Discovery: Make sure Windows has Network Discovery turned on in settings.
