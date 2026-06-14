---
layout: "post"
title: "MACOS run 3x commands terminal in parallel and single threaded"
date: "2025-04-09 21:09:40"
modified: "2025-04-09 21:09:40"
slug: "macos-run-3x-commands-terminal-in-parallel-and-single-threaded"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/04/Gemini_Generated_Image_t79rlet79rlet79r.jpeg"
featured_image_relative: "2025/04/Gemini_Generated_Image_t79rlet79rlet79r.jpeg"
---

run_parallel_loop.sh


3X IN A ROW 1 by 1    
#!/bin/bash

# Replace this with your actual command
COMMAND="echo Running your command"

# Repeat 99 times
for i in {1..99}
do
    echo "Round $i..."
    
    # Run 3 commands in parallel
    $COMMAND & 
    $COMMAND & 
    $COMMAND &

    # Wait for all 3 to finish before the next round
    wait
done



3x SAME TIME

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
