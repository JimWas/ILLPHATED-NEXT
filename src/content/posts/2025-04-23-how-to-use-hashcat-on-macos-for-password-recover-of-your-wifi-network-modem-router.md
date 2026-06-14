---
layout: "post"
title: "How to use HASHCAT on MACOS for password recover of your WIFI network / modem / router"
date: "2025-04-23 21:59:16"
modified: "2025-04-23 21:59:16"
slug: "how-to-use-hashcat-on-macos-for-password-recover-of-your-wifi-network-modem-router"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/04/image-14.jpg"
featured_image_relative: "2025/04/image-14.jpg"
---

WPA/WPA2 handshake file on macOS using Hashcat with the rockyou.txt wordlist.

1. Install Hashcat
First, ensure you have Hashcat installed. You can install it via Homebrew:

sh
brew install hashcat
2. Prepare Your Handshake File
Hashcat works best with .hccapx files for WPA2 handshakes (not .cap or .pcap).
If your file is already .hccapx, skip to step 3.

Otherwise, convert your .cap or .pcap file with hashcat's online converter or use the command line tool cap2hccapx (installed via Homebrew):

sh
brew install hashcat-utils
cap2hccapx yourfile.cap yourfile.hccapx
3. Get the rockyou.txt Wordlist
If you don't already have it, you can download:

sh
curl -O https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt
Or, if you're using Kali Linux or have SecLists:

sh
# Example, if you already have SecLists cloned
cp /path/to/rockyou.txt .
4. Run Hashcat
Use this command (replace with your actual file paths):

sh
hashcat -m 22000 -a 0 yourfile.hccapx rockyou.txt
Explanation:

-m 22000: WPA/WPA2 (hccapx) hash type. Newer Hashcat prefers .22000 (EAPOL-PBKDF2) format, but hccapx fits too.
-a 0: Straight attack (dictionary).
yourfile.hccapx: Your converted handshake file.
rockyou.txt: Your wordlist.
Note: If you get an error about formats, ensure your file is in the right format. Newer Hashcat prefers .22000 files. You can convert .cap to .22000 with hcxpcapngtool.

5. View Results
Once a password is found, it will be displayed in the output and written to hashcat.potfile by default (located in your home directory).

Quick Example
sh
# Convert handshake (if needed)
cap2hccapx myhandshake.cap myhandshake.hccapx

# Run hashcat
hashcat -m 22000 -a 0 myhandshake.hccapx rockyou.txt
Tips
GPU Acceleration: Hashcat works faster on supported GPUs. MacOS with AMD or eGPU might work, but Apple Silicon (M1/M2) has limited support.
Status/Resume: Press s during a run for status, or use --restore to resume.
Help: hashcat --help for more options.
