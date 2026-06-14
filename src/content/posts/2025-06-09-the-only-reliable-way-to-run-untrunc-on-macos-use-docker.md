---
layout: "post"
title: "The Only Reliable Way to Run untrunc on macOS: Use Docker"
date: "2025-06-09 04:31:20"
modified: "2025-06-09 04:31:20"
slug: "the-only-reliable-way-to-run-untrunc-on-macos-use-docker"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/06/ChatGPT-Image-Jun-9-2025-11_31_00-AM.png"
featured_image_relative: "2025/06/ChatGPT-Image-Jun-9-2025-11_31_00-AM.png"
---

The Only Reliable Way to Run untrunc on macOS: Use Docker
If you're trying to repair a corrupt .mp4 file on macOS and keep running into the dreaded:

nginx
Copy
Edit
moov atom not found
...you've probably stumbled upon untrunc, an open-source tool that can rebuild broken MP4s using a working reference file. But if you’ve tried installing or building untrunc on macOS, you know the pain — broken repos, missing CMakeLists.txt, or build errors with ffmpeg and clang.

🛑 TL;DR: untrunc doesn’t reliably compile on macOS anymore.
✅ The Reliable Fix? Use Docker
The easiest, cleanest, and most guaranteed way to run untrunc on macOS in 2025 is inside a Docker container.

🧰 Step-by-Step: Run untrunc Using Docker on macOS
1. 📦 Install Docker for Mac
If you haven’t already, install Docker Desktop.

2. 🐳 Create a Dockerfile
Make a folder like untrunc-docker, and create a file called Dockerfile with the following contents:

Dockerfile
Copy
Edit
FROM ubuntu:20.04

RUN apt-get update && 
    apt-get install -y git cmake g++ ffmpeg

RUN git clone https://github.com/anthwlock/untrunc.git && 
    cd untrunc && mkdir build && cd build && 
    cmake .. && make

WORKDIR /untrunc/build
ENTRYPOINT ["./untrunc"]
3. 🔨 Build the Image
Open Terminal and run:

bash
Copy
Edit
cd path/to/untrunc-docker
docker build -t untrunc .
4. 🏃‍♂️ Run It
Let’s say your files are in /Users/jamescoder/Videos/untrunc_files/, with:

good.mp4: a working video from the same camera or app

broken.mp4: your corrupted file

Run this:

bash
Copy
Edit
docker run -v /Users/jamescoder/Videos/untrunc_files:/files untrunc /files/good.mp4 /files/broken.mp4
If the reference file is compatible, this will produce a repaired MP4 in the same folder.

🎉 Why Docker Is the Best Way
✅ No dealing with brew, clang, or broken CMakeLists.txt

✅ Clean Linux environment with no macOS-specific build issues

✅ Works every time with zero fuss

🔚 Final Thoughts
If you’re on macOS and you’re trying to fix a corrupted .mp4, don’t waste your time fighting local builds. Use Docker and run untrunc the way it was meant to be used — inside a controlled Linux environment.

For more vaporwave-flavored tech guides and digital triage like this, follow me on Twitch.tv/illphated or check out more posts on illphated.com.

🧠 Tags:
#macOS #untrunc #docker #ffmpeg #mp4repair #illphated #linuxhack #moovatom #videofix #twitchtech




Use this too

Docker container
You can use the included Dockerfile to build and execute the package as a container.
The optional argument 'FF_VER' will be passed to make.

# docker build --build-arg FF_VER=3.3.9 -t untrunc .
docker build -t untrunc .
docker image prune --filter label=stage=intermediate -f

docker run -v ~/Videos/:/mnt untrunc /mnt/ok.mp4 /mnt/broken.mp4
