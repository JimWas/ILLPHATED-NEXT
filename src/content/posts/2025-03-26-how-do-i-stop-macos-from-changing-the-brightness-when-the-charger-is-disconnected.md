---
layout: "post"
title: "how do I stop macos from changing the brightness when the charger is disconnected"
date: "2025-03-26 18:26:40"
modified: "2025-03-26 18:26:40"
slug: "how-do-i-stop-macos-from-changing-the-brightness-when-the-charger-is-disconnected"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/03/Gemini_Generated_Image_e181j2e181j2e181.jpeg"
featured_image_relative: "2025/03/Gemini_Generated_Image_e181j2e181j2e181.jpeg"
---

Open the Terminal:

You can find Terminal in Applications > Utilities > Terminal, or you can search for it using Spotlight (Command + Space, then type "Terminal").
Disable Automatic Brightness Adjustment:

You can disable automatic brightness adjustments by running this command:

bash
sudo defaults write /Library/Preferences/com.apple.iokit.AmbientLightSensor "AutomaticBrightness" -bool false
You'll need to enter your administrator password when prompted since this command requires superuser privileges.

Reboot your Mac:

Changes may not take effect until you restart your Mac.
To Re-enable Automatic Adjustment:

If you want to turn it back on, you can run:

bash
sudo defaults write /Library/Preferences/com.apple.iokit.AmbientLightSensor "AutomaticBrightness" -bool true
Using brightness Utility:

If you're looking for a way to control screen brightness via the command line, you can also use a third-party command-line tool called brightness. You can install it using Homebrew:

bash
brew install brightness
Once installed, you can adjust brightness as follows:

bash
brightness 0.5
This command sets the brightness to 50%; you can replace 0.5 with any value between 0 (minimum brightness) and 1 (maximum brightness).
