---
layout: "post"
title: "How to Stop VLC From Showing Filenames When Switching Videos"
date: "2025-07-13 13:40:50"
modified: "2025-07-13 13:40:50"
slug: "how-to-stop-vlc-from-showing-filenames-when-switching-videos"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/07/ChatGPT-Image-Jul-13-2025-09_40_37-AM.png"
featured_image_relative: "2025/07/ChatGPT-Image-Jul-13-2025-09_40_37-AM.png"
---

How to Stop VLC From Showing Filenames When Switching Videos
If you're like me, you probably use VLC Media Player for everything—from playing music to binge-watching playlists of random clips you downloaded off the internet. But one thing that gets annoying fast is VLC flashing the filename right on the screen every time it switches to the next video in a playlist. It ruins the vibe.

Luckily, there's a simple fix. Here’s how to stop VLC from showing the filename when switching videos.

Step 1: Open VLC Preferences
Launch VLC Media Player.

Go to Tools → Preferences (or press Ctrl + P).

Step 2: Disable Media Title Popups
In the Simple Preferences window, stay on the Interface tab.

Uncheck the box that says "Show media title on video start."

This stops VLC from popping up the filename at the start of each video.

Step 3: (Optional) Disable All On-Screen Display (OSD)
If you don’t want any text on your videos—no volume display, no track info, no subtitles—you can take it a step further:

Click on the Subtitles / OSD section in the left menu.

Uncheck "Enable On Screen Display (OSD)."

Bonus: Use VLC Command Line
If you like launching VLC from the terminal or you're scripting something, you can disable the video title popup with this command:

bash
Copy
Edit
vlc --no-video-title-show
Or to disable all OSD elements:

bash
Copy
Edit
vlc --no-osd
Why Do This?
Sometimes you’re projecting visuals, streaming, or just trying to chill without random filenames popping up like:

css
Copy
Edit
[ * playing: weird_clip_final_FINAL_v3_reallythisone.mp4 * ]
Nobody needs to see that.

Final Thoughts
VLC is one of the most powerful media players out there, but the defaults don’t always match how you actually use it. Tweaking these small settings can make your media experience way cleaner.

If you found this tip helpful, check out more tech fixes, weird internet guides, and random life hacks at illphated.com.
