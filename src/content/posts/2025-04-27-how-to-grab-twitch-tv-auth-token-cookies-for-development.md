---
layout: "post"
title: "HOW TO GRAB TWITCH.TV AUTH TOKEN COOKIES FOR DEVELOPMENT"
date: "2025-04-27 18:08:02"
modified: "2025-04-27 18:08:02"
slug: "how-to-grab-twitch-tv-auth-token-cookies-for-development"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/04/Screenshot-2025-04-27-at-1.07.07\u202fPM.png"
featured_image_relative: "2025/04/Screenshot-2025-04-27-at-1.07.07\u202fPM.png"
---

twitch-dl Documentation
Authentication
Some videos are subscriber-only and require you to be logged in. To accomplish this you need to find your auth token. It can be found using your browser, in a cookie named auth_token.

Open twitch.tv in your browser and make sure you're logged in.
Open developer tools (F12 shortcut in Firefox and Chrome).
Open the Storage tab on Firefox, or Application tab in Chrome.
Click on Cookies → https://www.twitch.tv/ in the sidebar.
Find the auth-token cookie in the list and copy it's value.
How to find the auth token in dev tools

The auth token will be a 30 character long string of random letters and numbers, something like iduetx4i107rn4b9wrgctf590aiktv. Then you can pass it to info and download commands:


twitch-dl info 221837124 --auth-token iduetx4i107rn4b9wrgctf590aiktv
twitch-dl download 221837124 --auth-token iduetx4i107rn4b9wrgctf590aiktv
