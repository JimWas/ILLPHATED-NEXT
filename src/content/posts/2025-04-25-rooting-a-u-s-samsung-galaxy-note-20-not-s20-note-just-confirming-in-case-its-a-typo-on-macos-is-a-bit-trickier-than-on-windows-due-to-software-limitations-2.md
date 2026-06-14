---
layout: "post"
title: "Rooting a U.S. Samsung Galaxy Note 20 (not S20 Note\u2014just confirming in case it's a typo) on macOS is a bit trickier than on Windows due to software limitations"
date: "2025-04-25 04:04:35"
modified: "2025-04-25 04:04:35"
slug: "rooting-a-u-s-samsung-galaxy-note-20-not-s20-note-just-confirming-in-case-its-a-typo-on-macos-is-a-bit-trickier-than-on-windows-due-to-software-limitations-2"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/04/image-1.jpg"
featured_image_relative: "2025/04/image-1.jpg"
---

To install ADB (Android Debug Bridge) on macOS, you can use either Homebrew (quickest) or install it manually via the Android SDK Platform Tools. Here's both methods:

✅ Method 1: Install ADB with Homebrew (Easiest)
Open Terminal

Install Homebrew if you haven’t yet:

bash
Copy
Edit
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Install android-platform-tools (includes ADB & Fastboot):

bash
Copy
Edit
brew install android-platform-tools
Test ADB:

bash
Copy
Edit
adb devices
If your phone is connected and USB debugging is enabled, it should appear.

✅ Method 2: Manual Installation from Google
Go to the official site:
https://developer.android.com/studio/releases/platform-tools

Download the macOS version of Platform Tools

Unzip the folder (e.g., to ~/platform-tools)

Add ADB to your PATH:

Open (or create) ~/.zshrc (or ~/.bash_profile if using Bash)

Add this line:

bash
Copy
Edit
export PATH=$PATH:$HOME/platform-tools
Save, then reload terminal:

bash
Copy
Edit
source ~/.zshrc
Test it:

bash
Copy
Edit
adb version
Let me know if you want to go ahead and test your device connection or if you run into any errors.
