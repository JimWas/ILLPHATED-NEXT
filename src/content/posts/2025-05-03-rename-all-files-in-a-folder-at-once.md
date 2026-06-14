---
layout: "post"
title: "Rename all files in a folder at once"
date: "2025-05-03 18:38:53"
modified: "2025-05-03 18:38:53"
slug: "rename-all-files-in-a-folder-at-once"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/05/Screenshot-2025-05-04-at-2.37.38\u202fAM.png"
featured_image_relative: "2025/05/Screenshot-2025-05-04-at-2.37.38\u202fAM.png"
---

Here's a Python script that renames all files in a specified folder on macOS to random names with random file extensions. The script ensures that the new names are unique and preserves the original file extensions if desired. It also includes error handling and user confirmation for safety.

import os
import random
import string
import sys

def generate_random_name(length=10):
    """Generate a random string of specified length."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def generate_random_extension():
    """Generate a random 3-character file extension."""
    return '.' + ''.join(random.choice(string.ascii_lowercase) for _ in range(3))

def rename_files_in_folder(folder_path, preserve_extension=True):
    """Rename all files in the specified folder to random names."""
    # Check if folder exists
    if not os.path.isdir(folder_path):
        print(f"Error: The folder '{folder_path}' does not exist.")
        return

    # Get list of files in the folder
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    
    if not files:
        print("No files found in the folder.")
        return

    print(f"Found {len(files)} files in '{folder_path}'.")
    print("The following files will be renamed:")
    for file in files:
        print(f" - {file}")
    
    # Ask for user confirmation
    confirmation = input("nDo you want to proceed with renaming these files? (yes/no): ").lower()
    if confirmation != 'yes':
        print("Operation cancelled.")
        return

    # Rename files
    used_names = set()
    for old_name in files:
        try:
            old_path = os.path.join(folder_path, old_name)
            
            # Skip if it's a hidden file (like .DS_Store on macOS)
            if old_name.startswith('.'):
                print(f"Skipping hidden file: {old_name}")
                continue

            # Generate new name
            while True:
                new_name = generate_random_name()
                if preserve_extension:
                    file_ext = os.path.splitext(old_name)[1] or generate_random_extension()
                else:
                    file_ext = generate_random_extension()
                new_filename = new_name + file_ext
                if new_filename not in used_names:
                    break
            
            new_path = os.path.join(folder_path, new_filename)
            
            # Rename the file
            os.rename(old_path, new_path)
            used_names.add(new_filename)
            print(f"Renamed: {old_name} -> {new_filename}")
        
        except Exception as e:
            print(f"Error renaming {old_name}: {str(e)}")

    print("nRenaming complete.")

if __name__ == "__main__":
    # Specify the folder path (modify this to your folder)
    folder_path = input("Enter the folder path (or drag and drop the folder here): ").strip()
    
    # Remove quotes if folder path was dragged and dropped (macOS adds quotes)
    folder_path = folder_path.strip("'").strip('"')
    
    # Option to preserve original extensions
    preserve_ext = input("Preserve original file extensions? (yes/no, default yes): ").lower() != 'no'
    
    rename_files_in_folder(folder_path, preserve_extension=preserve_ext)

How to Use the Script
Save the Script:
Copy the script above and save it as rename_files.py in a convenient location (e.g., your Desktop).

Run the Script:
Open the Terminal on your Mac.

Navigate to the directory containing the script using cd (e.g., cd ~/Desktop).

Run the script with Python: python3 rename_files.py.

Provide Input:
Folder Path: Enter the path to the folder containing the files you want to rename. You can type the path or drag and drop the folder into the Terminal (macOS will insert the path).

Preserve Extensions: Choose whether to keep the original file extensions (e.g., .jpg, .txt) or generate random ones. By default, it preserves extensions.

Confirmation: The script lists all files in the folder and asks for confirmation before renaming.

Output:
The script will rename each file to a random name (e.g., aB7xPqW9zR.txt or kL9mN2vC8x.abc if random extensions are used).

It skips hidden files like .DS_Store (common on macOS).

It ensures no naming conflicts by tracking used names.

Errors (e.g., permission issues) are reported for each file.

Example
Suppose you have a folder /Users/YourName/Documents/MyFiles with:
photo.jpg

document.pdf

note.txt

Running the script:
bash

python3 rename_files.py

Input:

Enter the folder path: /Users/YourName/Documents/MyFiles
Preserve original file extensions? (yes/no, default yes): yes

Output:

Found 3 files in '/Users/YourName/Documents/MyFiles'.
The following files will be renamed:
 - photo.jpg
 - document.pdf
 - note.txt

Do you want to proceed with renaming these files? (yes/no): yes

Renamed: photo.jpg -> Xp7kM2vN9q.jpg
Renamed: document.pdf -> jH4rT8wZ1c.pdf
Renamed: note.txt -> Qw9nL5xP3m.txt

Renaming complete.

Notes
Safety: The script requires confirmation to prevent accidental renaming. Always double-check the folder path to avoid renaming files in the wrong directory.

Preserving Extensions: Preserving extensions (preserve_extension=True) is recommended for most cases to maintain file compatibility (e.g., .jpg for images). Set to False for fully random extensions.

macOS Specifics: The script handles macOS hidden files (e.g., .DS_Store) and drag-and-drop folder paths with quotes.

Requirements: Python 3 is required (pre-installed on macOS). No additional packages are needed.

Backup: Before running, consider backing up your files, as renaming is irreversible unless you track the original names manually.

Permissions: Ensure you non-root permissions to rename files in the specified folder. If you encounter permission errors, check the folder’s permissions (ls -l) or run the script with appropriate access.

If you need modifications (e.g., specific naming patterns, logging renamed files, or excluding certain file types), let me know!

explain error handling

file organization tips
