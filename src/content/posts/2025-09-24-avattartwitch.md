---
layout: "post"
title: "avattartwitch"
date: "2025-09-24 23:00:03"
modified: "2025-09-24 23:00:03"
slug: "avattartwitch"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
---

var options = {
    width: "100%",       // puedes poner "100%" o un número como 800
    height: 600,         // mínimo 300
    channel: "avattargames",
    parent: ["illphated.com"] // aquí el dominio donde va a estar el embed
  };

  var player = new Twitch.Player("twitch-embed", options);
  player.setVolume(0.5); // volumen inicial (0.0 a 1.0)
