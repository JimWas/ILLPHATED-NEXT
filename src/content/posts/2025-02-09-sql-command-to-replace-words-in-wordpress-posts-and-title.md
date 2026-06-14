---
layout: "post"
title: "SQL command to replace words in wordpress posts and title"
date: "2025-02-09 01:51:36"
modified: "2025-02-09 01:51:36"
slug: "sql-command-to-replace-words-in-wordpress-posts-and-title"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/02/DALL\u00b7E-2025-02-08-19.51.23-A-digital-representation-of-an-SQL-command-displayed-on-a-futuristic-computer-screen.-The-screen-shows-SQL-code-with-the-command-to-update-WordPress-p.webp"
featured_image_relative: "2025/02/DALL\u00b7E-2025-02-08-19.51.23-A-digital-representation-of-an-SQL-command-displayed-on-a-futuristic-computer-screen.-The-screen-shows-SQL-code-with-the-command-to-update-WordPress-p.webp"
---

Here's the SQL command to update WordPress posts and titles containing "Audrey" to "Audrey Montgomery":
sqlCopyUPDATE wp_posts 
SET 
    post_title = REPLACE(post_title, 'Audrey', 'Audrey Montgomery'),
    post_content = REPLACE(post_content, 'Audrey', 'Audrey Montgomery')
WHERE 
    post_title LIKE '%Audrey%' 
    OR post_content LIKE '%Audrey%';
A few important notes:

Make sure to backup your database before running this command

This will replace all instances of "Audrey" with "Audrey Montgomery", even if "Audrey" is part of another word
If your WordPress database uses a different prefix than "wp_", you'll need to adjust "wp_posts" accordingly

Just replace the wordpress post table to correct on top
