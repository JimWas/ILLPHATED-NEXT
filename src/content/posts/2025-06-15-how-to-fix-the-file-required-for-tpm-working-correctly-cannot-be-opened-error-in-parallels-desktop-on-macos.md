---
layout: "post"
title: "How to Fix \u201cThe file required for TPM working correctly cannot be opened\u201d Error in Parallels Desktop on macOS"
date: "2025-06-15 15:12:23"
modified: "2025-06-15 15:12:23"
slug: "how-to-fix-the-file-required-for-tpm-working-correctly-cannot-be-opened-error-in-parallels-desktop-on-macos"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/06/ChatGPT-Image-Jun-15-2025-10_12_09-AM.png"
featured_image_relative: "2025/06/ChatGPT-Image-Jun-15-2025-10_12_09-AM.png"
---

How to Fix “The file required for TPM working correctly cannot be opened” Error in Parallels Desktop on macOS

Are you seeing this frustrating error when trying to run Windows on Parallels Desktop on your Mac?

"The file required for TPM working correctly cannot be opened. Check whether you have permission to open it. Please read this article for more information."

You're not alone — and the good news is, the fix is simple.

✅ Quick Fix: Delete NVRAM.dat and NVRAM.tnvs Inside the Virtual Machine Package
This issue is typically caused by corrupted TPM-related NVRAM files stored in the virtual machine's package. Here’s how to fix it:

🧠 What Is This Error?
Parallels uses a virtual Trusted Platform Module (TPM) to comply with Windows 11’s security requirements. If the NVRAM files related to TPM become corrupted, Parallels can no longer verify or access the virtual TPM state, resulting in the error.

🧰 How to Fix the TPM File Error in Parallels on macOS
1. Shut Down Your Virtual Machine
Make sure the virtual machine is completely shut down — not suspended or paused.

2. Locate Your Virtual Machine File
By default, Parallels stores virtual machines in:

javascript
Copy
Edit
~/Parallels/
Or you may have saved them elsewhere. Look for a file ending in .pvm, such as:

nginx
Copy
Edit
Windows 11.pvm
3. Right-click and Show Package Contents
Right-click the .pvm file and choose:

“Show Package Contents”

This reveals the internal files of your VM.

4. Delete the Following Files:
Look for these two files and delete them:

NVRAM.dat

NVRAM.tnvs (if present)

These files store TPM and firmware data. Don’t worry — they’ll be automatically regenerated when you restart the VM.

5. Reboot the Virtual Machine
Now, double-click the .pvm file to launch your virtual machine. The error should be gone, and Windows should boot normally.

🧼 Extra Tip: Backup Before Deleting
If you’re unsure, right-click and duplicate the .pvm file before making changes. It’s a large file, but this protects you from unintended corruption or data loss.

💡 Final Thoughts
This simple fix can save hours of frustration. Corrupt NVRAM files are a common cause of TPM-related errors in Parallels — especially after macOS updates, crashes, or forced shutdowns. By removing the bad files, Parallels is forced to create clean replacements and restore TPM functionality.

🔗 Related Searches You May Have:
Parallels TPM error fix macOS

Parallels Windows 11 won't start TPM

Delete NVRAM.dat Parallels

TPM not working Parallels Desktop

📺 Follow Me at twitch.tv/illphated for more Mac, Windows, and tech hacks
And check out more tutorials like this right here at illphated.com 🔧
