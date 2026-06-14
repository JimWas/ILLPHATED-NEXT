---
layout: "post"
title: "How to hide a specific image using CSS code"
date: "2025-04-24 23:01:41"
modified: "2025-04-24 23:01:41"
slug: "how-to-hide-a-specific-image-using-css-code"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/04/Screenshot-2025-04-24-at-6.00.53\u202fPM.png"
featured_image_relative: "2025/04/Screenshot-2025-04-24-at-6.00.53\u202fPM.png"
---

hide this image


![Image](https://i0.wp.com/illphated.com/wp-content/uploads/2024/12/cropped-illphated_logo-1.png?fit=512%2C512&ssl=1)



✅ Option 1: Hide by src (recommended if it's unique)
css
Copy
Edit
img[src*="cropped-illphated_logo-1.png"] {
  display: none;
}
✅ Option 2: Hide by class
If that image is the only one with this exact combination of classes:

css
Copy
Edit
img.wp-post-image.lazy-loaded {
  display: none;
}
✅ Option 3: Hide by specific size
css
Copy
Edit
img[width="512"][height="512"] {
  display: none;
}
✅ Option 4: Hide by alt (if you set one)
css
Copy
Edit
img[alt="Your Alt Text Here"] {
  display: none;
}
Where to put this?
Inside your theme’s style.css

Or in WordPress Admin → Appearance → Customize → Additional CSS
