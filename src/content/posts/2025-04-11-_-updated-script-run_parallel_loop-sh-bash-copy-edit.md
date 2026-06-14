---
layout: "post"
title: "\u2705 Updated Script: run_parallel_loop.sh bash Copy Edit"
date: "2025-04-11 18:18:59"
modified: "2025-04-11 18:18:59"
slug: "%e2%9c%85-updated-script-run_parallel_loop-sh-bash-copy-edit"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/04/1736178336119.jpg"
featured_image_relative: "2025/04/1736178336119.jpg"
---

✅ Updated Script: run_parallel_loop.sh
bash
Copy
Edit

chmod +x run_parallel_loop.sh
./run_parallel_loop.sh


💡 Notes
eval "$COMMAND" allows for more complex or quoted commands.

Each of the 3 runs will start at the same time.

wait ensures the script pauses for all 3 to finish before repeating.

Press Ctrl+C at any time to cancel.




#!/bin/bash

# Replace this with your actual command
COMMAND="sleep 5"  # Example command (replace with yours)

# Run 99 loops
for i in {1..99}
do
    echo "=== Round $i ==="

    # Run 3 instances in the background
    eval "$COMMAND" &
    eval "$COMMAND" &
    eval "$COMMAND" &

    # Wait for all 3 to finish before looping again
    wait
done
