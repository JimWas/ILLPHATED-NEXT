---
layout: "post"
title: "How to Run Anonymous Firefox Browsers with Tor in Docker on macOS (Perfect for Automation or Traffic Routing)"
date: "2025-06-18 16:09:08"
modified: "2025-06-18 16:09:08"
slug: "how-to-run-anonymous-firefox-browsers-with-tor-in-docker-on-macos-perfect-for-automation-or-traffic-routing"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/06/KasmWEbTor-Illphated.png"
featured_image_relative: "2025/06/KasmWEbTor-Illphated.png"
---

How to Run Anonymous Firefox Browsers with Tor in Docker on macOS (Perfect for Automation or Traffic Routing)

How to Run Anonymous Firefox Browsers with Tor in Docker on macOS (Perfect for Automation or Traffic Routing)
Looking to spin up multiple Firefox browsers through different Tor exit nodes automatically using Docker on your Mac? Whether you're testing geo-locations, scaling anonymous browsing, or just love watching traffic move like a cyberpunk symphony—this guide is for you.

We’ll show you how to:

Auto-launch Firefox with a Tor SOCKS5 proxy

Rotate sessions every 15 minutes

Limit to 3 running containers at a time

Randomize it all using Bash scripting on macOS

⚙️ Step 1: Install Docker for macOS
If you haven’t yet, install Docker:

Go to https://www.docker.com/products/docker-desktop/

Install for macOS and run it

📦 Step 2: Install GNU shuf on macOS
macOS lacks the shuf command by default. It’s crucial for randomization in the script.

Install Homebrew if you don’t already have it:

bash
Copy
Edit
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Then install coreutils:

bash
Copy
Edit
brew install coreutils
This gives you gshuf, the GNU version of shuf.

🔐 Step 3: Prepare the Script to Auto-Rotate Browsers
Create a file called run_browsers.sh and paste the following:

bash
Copy
Edit
#!/bin/bash

MAX_RUNNING=3
TOTAL_CONTAINERS=10
CYCLE_MINUTES=15
HOMEPAGE="https://illphated.com"

SHUF_CMD=$(command -v shuf || command -v gshuf)
if [ -z "$SHUF_CMD" ]; then
  echo "shuf or gshuf not found. Please install coreutils (brew install coreutils)."
  exit 1
fi

function create_policy {
  local name=$1
  local proxy=$2
  local dir="policies/$name/policies"
  mkdir -p "$dir"
  cat > "$dir/policies.json" <<EOF
{
  "policies": {
    "Homepage": {
      "URL": "$HOMEPAGE",
      "StartPage": "homepage"
    },
    "Proxy": {
      "Mode": "manual",
      "SOCKS": "$proxy",
      "SOCKS_Port": 9050,
      "SOCKSVersion": 5
    }
  }
}
EOF
}

function start_container {
  local id=$1
  local firefox="firefox$id"
  local proxy="torproxy$id"
  echo "Starting container set: $firefox + $proxy"

  create_policy "$firefox" "$proxy"

  docker run -d --rm --name "$proxy" dperson/torproxy -v
  docker run -d --rm 
    --name "$firefox" 
    -p "58${id}0:5800" 
    -e DISPLAY_WIDTH=1280 
    -e DISPLAY_HEIGHT=800 
    -v "$(pwd)/policies/$firefox:/config/policies" 
    --add-host "$proxy:$proxy" 
    --network bridge 
    jlesage/firefox
}

function stop_container {
  local id=$1
  docker stop "firefox$id" "torproxy$id"
}

while true; do
  echo "------ NEW CYCLE $(date) ------"
  running_ids=()

  available_ids=($(seq 1 $TOTAL_CONTAINERS))
  for id in $(docker ps --format '{{.Names}}' | grep -o '[0-9]*$' | sort -u); do
    available_ids=("${available_ids[@]/$id}")
  done

  ids_to_start=($(printf "%sn" "${available_ids[@]}" | $SHUF_CMD | head -n $((RANDOM % MAX_RUNNING + 1))))

  for id in "${ids_to_start[@]}"; do
    start_container "$id"
    running_ids+=("$id")
  done

  echo "Sleeping for $CYCLE_MINUTES minutes..."
  sleep "$((CYCLE_MINUTES * 60))"

  running_containers=($(docker ps --format '{{.Names}}' | grep firefox | grep -o '[0-9]*$' | $SHUF_CMD))
  kill_count=$((RANDOM % ${#running_containers[@]} + 1))
  for i in $(seq 1 $kill_count); do
    stop_container "${running_containers[$((i - 1))]}"
  done

  echo "Cycle complete. Waiting 10 seconds before restart."
  sleep 10
done
🚀 Step 4: Run It!
Make it executable and launch:

bash
Copy
Edit
chmod +x run_browsers.sh
./run_browsers.sh
It will:

Start 1–3 Firefox instances through unique Tor circuits

Automatically open https://illphated.com

Rotate and recycle containers every 15 minutes

Each one is accessible at:

http://localhost:5810 → firefox1

http://localhost:5820 → firefox2

etc.

💡 Pro Tips
Increase TOTAL_CONTAINERS=20 if you want to scale higher.

Firefox GUI might consume RAM, so don’t overdo it on Mac.

You can modify it for headless scraping with Selenium or Puppeteer for performance.

🧠 Why Use This?
✅ Mass anonymous browsing with Tor

✅ Great for testing geo-blocks

✅ Ideal for rotating visits to your sites like illphated.com

✅ Feels like running Blade Runner in Bash
