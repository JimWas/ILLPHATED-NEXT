---
layout: "post"
title: "Path of Exile 2 (POE2) how to fix white screen on MacBook MacOS using crossover parallels WINE"
date: "2025-02-23 15:15:27"
modified: "2025-02-23 15:15:27"
slug: "path-of-exile-2-poe2-how-to-fix-white-screen-on-macbook-macos-using-crossover-parallels-wine"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/02/DALL\u00b7E-2025-02-23-09.14.32-A-cyberpunk-themed-futuristic-workstation-displaying-a-MacBook-running-Path-of-Exile-2.-The-screen-shows-a-white-glitched-out-display-due-to-DirectX-.webp"
featured_image_relative: "2025/02/DALL\u00b7E-2025-02-23-09.14.32-A-cyberpunk-themed-futuristic-workstation-displaying-a-MacBook-running-Path-of-Exile-2.-The-screen-shows-a-white-glitched-out-display-due-to-DirectX-.webp"
---

Path of Exile 2 (PoE2) isn't fully optimized for macOS yet, and since you're running it on an M1 MacBook, there are a few compatibility issues, especially with DirectX 12 since macOS doesn’t natively support it. Here’s how you can try to fix the white screen issue:

1. Switch to Vulkan or DX11
Since DirectX 12 is not macOS-compatible, you'll need to switch to a different rendering mode:

Open Path of Exile 2.
If the game launches, go to Options > Graphics.
Change Renderer from DirectX 12 to Vulkan or DirectX 11.
Restart the game.
If you can’t access the settings because of the white screen, try forcing Vulkan manually:

Mac Terminal Method:
Close the game.
Open Terminal on your Mac.
Run this command:
css
Copy
Edit
open -a "Path of Exile 2" --args --renderer Vulkan
Press Enter and see if it launches properly.
2. Use Crossover or Parallels (If Using Windows Version)
If you're running Path of Exile 2 via CrossOver, Wine, or Parallels:

CrossOver: Use DXVK (DirectX-to-Vulkan translation).
Parallels: Make sure you’re running Windows 11 ARM and try using Vulkan or DX11 instead of DX12.
3. Run via Steam with a Launch Option
If you're using Steam, you can try launching it with Vulkan:

Open Steam.
Right-click Path of Exile 2 > Properties.
In the Launch Options box, type:
css
Copy
Edit
--renderer Vulkan
Launch the game.
4. Update macOS and Game Files
Make sure your macOS is fully updated, as Apple frequently improves Metal (the macOS graphics API).

5. Try Running in Windowed Mode
If you can get into the settings, try switching to Windowed Mode instead of Fullscreen, as it sometimes helps with rendering issues.

6. Use Boot Camp (Intel Macs Only)
If you’re on an Intel-based Mac, you could install Windows via Boot Camp and run PoE2 in Windows.
