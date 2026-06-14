---
layout: "post"
title: "how do I turn off amazon simple email in web services they are billing me"
date: "2025-04-21 21:31:42"
modified: "2025-04-21 21:31:42"
slug: "how-do-i-turn-off-amazon-simple-email-in-web-services-they-are-billing-me"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/04/Screenshot-2025-04-21-at-4.31.07\u202fPM.jpg"
featured_image_relative: "2025/04/Screenshot-2025-04-21-at-4.31.07\u202fPM.jpg"
---

how do I turn off amazon simple email in web services they are billing me for a service im not using 

Nothing I was billed $20 a month for two months but I didn't send any emails. What do I do?



If Amazon Web Services (AWS) is billing you for Amazon Simple Email Service (SES) and you're not using it, here's how to stop the charges and disable the service step-by-step:

🔧 Step-by-Step: Turn Off Amazon SES to Stop Billing
✅ 1. Log into AWS Console
Go to: https://console.aws.amazon.com/

📍 2. Select the Correct Region
SES is region-specific, so make sure you're in the region where SES is enabled (e.g., US East (N. Virginia)).

🛑 3. Delete All Active Resources
In each region where SES may be active, check for and remove:

Verified domains or email addresses

Active configuration sets

Identity policies

Dedicated IPs (if subscribed)

To do this:
Go to Amazon SES → Configuration → Remove:

Email identities

Configuration sets

SMTP credentials

Event destinations (if set)

IP pools (under “Dedicated IPs”)

💸 4. Check and Release Dedicated IPs
If you were accidentally signed up for dedicated IPs, those incur recurring monthly fees.

To release:

Go to SES > Dedicated IPs

Select IP pool(s) > Actions > Release IPs

🧼 5. Delete IAM SES Users (Optional)
If you created IAM users for SES SMTP:

Go to IAM → Users

Delete any SES-related users or credentials

💡 6. Set Up Billing Alerts (Optional but Smart)
Avoid future surprise charges:

Go to Billing > Budgets → Create a budget with alerts

Or go to Billing > Cost Explorer to see SES usage

🧾 7. Verify with Billing
If SES charges persist:

Go to AWS Support Center

Choose Account and Billing Support

Open a billing dispute or refund request

🧨 Bonus: Shut Down All SES in All Regions (Fastest Nuclear Option)
Use the AWS CLI to list SES identities and delete them:

bash
Copy
Edit
aws ses list-identities --region us-east-1
aws ses delete-identity --identity you@example.com --region us-east-1
Repeat for each region where SES might be enabled.
