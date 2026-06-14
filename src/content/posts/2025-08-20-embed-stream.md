---
layout: "post"
title: "Embed STream"
date: "2025-08-20 22:50:16"
modified: "2025-08-20 22:50:16"
slug: "embed-stream"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
---

var options = {
      width: 854, // Adjust width as needed
      height: 480, // Adjust height as needed
      channel: "oc5_x", // Your Twitch channel name
      autoplay: true, // Enable autoplay
      muted: false, // Ensure sound is not muted
      // Include parent domains if embedding on other websites
      parent: ["yourwebsite.com", "embed.example.com"] // Replace with your domain(s)
    };

    var player = new Twitch.Embed("twitch-embed", options);

    // Set volume (0.0 to 1.0)
    player.addEventListener(Twitch.Embed.VIDEO_READY, function() {
      player.setVolume(0.5); // Set default volume (adjust as needed)
      console.log("The video is ready and playing with sound");
    });
