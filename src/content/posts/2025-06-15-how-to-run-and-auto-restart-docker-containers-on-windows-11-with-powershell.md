---
layout: "post"
title: "How to Run and Auto-Restart Docker Containers on Windows 11 with PowerShell"
date: "2025-06-15 12:22:09"
modified: "2025-06-15 12:22:09"
slug: "how-to-run-and-auto-restart-docker-containers-on-windows-11-with-powershell"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/06/docker-kasm-tor-illphated.png"
featured_image_relative: "2025/06/docker-kasm-tor-illphated.png"
---

How to Run and Auto-Restart Docker Containers on Windows 11 with PowerShell

How to Run and Auto-Restart Docker Containers on Windows 11 with PowerShell
If you’ve ever needed to automatically manage multiple Docker containers—like restarting a browser instance every 10 minutes—this guide is for you. Whether you're automating Twitch stream views, testing secure browsers, or just building cool projects, here’s how to run and auto-restart Docker containers on Windows 11 using PowerShell.

This setup works especially well with headless containers like KasmVNC or tor-browser, ideal for web automation or secure browsing environments.

🔧 What You’ll Need
Windows 11 with Docker Desktop installed

PowerShell (built-in on Windows)

A Docker image like kasmweb/tor-browser

A goal (like auto-reloading a Twitch clip URL every 10 minutes 😉)

📜 PowerShell Script: Auto-Restart Docker Containers
Save the following code as run_kasm_containers.ps1:

powershell
Copy
Edit
# Define port range
$portStart = 6909
$containerCount = 3

function Start-Containers {
    for ($i = 0; $i -lt $containerCount; $i++) {
        $port = $portStart + $i
        docker run --rm -d --shm-size=512m -p "$port`:6901" `
            -e VNC_PW=password `
            -e LAUNCH_URL="https://www.twitch.tv/illphated/clip/CarelessClearGalagoPeteZaroll-8BbZEmLa-1UeFb4z" `
            kasmweb/tor-browser:1.16.0
    }
}

while ($true) {
    Write-Host "Killing all Docker containers..." -ForegroundColor Red
    $runningContainers = docker ps -q

    if ($runningContainers) {
        docker kill $runningContainers
    } else {
        Write-Host "No running containers to kill." -ForegroundColor Yellow
    }

    Start-Sleep -Seconds 20

    Write-Host "Starting all Docker containers..." -ForegroundColor Green
    Start-Containers

    Start-Sleep -Seconds 500
}
▶️ How to Run It
Open PowerShell as Administrator

Navigate to your script folder:

powershell
Copy
Edit
cd "C:PathToScript"
Enable script execution (if needed):

powershell
Copy
Edit
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
Run the script:

powershell
Copy
Edit
.run_kasm_containers.ps1
Boom—you're now running 3 containers, each bound to a different port, automatically restarted every 10 minutes.

🧠 Why This Is Useful
💻 Keeps your automation environment clean and fresh

🔁 Solves issues with memory bloat in long-running browser containers

🔐 Great for testing Tor, VPN, and anonymous browsing setups

📺 Useful for automating clips or URLs like Twitch streams (as seen with illphated)

📎 Bonus: Customize Your LAUNCH_URL
Change the LAUNCH_URL environment variable to load any page you want inside the container:

powershell
Copy
Edit
-e LAUNCH_URL="https://example.com"
You can also customize the port range, number of instances, or even container images (chrome, firefox, etc.).

💬 Final Thoughts
Whether you're experimenting with automation, testing browser environments, or building something unique—this Docker + PowerShell combo is a powerful toolset for developers and streamers alike.

And if you’re not already, come watch the chaos live on twitch.tv/illphated.

#docker #windows11 #powershell #kasm #streaming #automation #illphated #twitchautomation
