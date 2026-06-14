---
layout: "post"
title: "ILLPHATED Currency Calculator for converting USD to Thai Baht (THB) using real-time exchange rates"
date: "2025-04-23 13:42:04"
modified: "2025-04-23 14:09:59"
slug: "illphated-currency-calculator-for-converting-usd-to-thai-baht-thb-using-real-time-exchange-rates"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/04/ChatGPT-Image-Apr-23-2025-08_40_35-AM.jpg"
featured_image_relative: "2025/04/ChatGPT-Image-Apr-23-2025-08_40_35-AM.jpg"
---

To create the ILLPHATED Currency Calculator for converting USD to Thai Baht (THB) using real-time exchange rates, you can utilize the ExchangeRatesAPI.io, which offers free access to live currency data updated every 60 seconds.
ExchangeRatesAPI
​

🔧 Step-by-Step Guide
1. Obtain a Free API Key
Visit ExchangeRatesAPI.io and sign up for a free account.

After registration, you'll receive an API key necessary for authentication.​

2. Set Up the Currency Converter
Here's a Python script that fetches the latest USD to THB exchange rate and performs the conversion:​

python
Copy
Edit
import requests

def convert_usd_to_thb(amount_usd):
api_key = 'YOUR_API_KEY' # Replace with your actual API key
url = f'https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=THB'

headers = {
'apikey': api_key
}

try:
response = requests.get(url, headers=headers)
response.raise_for_status()
data = response.json()
rate = data['rates']['THB']
amount_thb = amount_usd * rate
print(f"{amount_usd:.2f} USD = {amount_thb:.2f} THB (Exchange Rate: {rate:.4f})")
except requests.exceptions.RequestException as e:
print(f"Error fetching exchange rate: {e}")
except KeyError:
print("Error parsing exchange rate data.")

# Example usage
convert_usd_to_thb(100)
3. Run the Script
Ensure you have the requests library installed. If not, install it using:

bash
Copy
Edit
pip install requests
Replace 'YOUR_API_KEY' with your actual API key in the script.

Run the script to see the conversion result.​

📱 Optional Enhancements
Graphical User Interface (GUI): Use libraries like tkinter or PyQt to create a user-friendly interface.

Web Application: Develop a web-based version using frameworks like Flask or Django.

Additional Currencies: Extend the functionality to support multiple currency conversions.​

By following these steps, you'll have a functional currency converter that provides real-time USD to THB exchange rates.​

Sources
You said:
can you convert that to a wordpress plugin and provide me the .zip so i can install it to illphated.com
ChatGPT said:
Here's your WordPress plugin! You can download it using the link below and upload it to your site illphated.com via the WordPress admin panel:

👉 Download ILLPHATED Currency Converter Plugin

📌 Before using it, replace "YOUR_API_KEY" in the plugin code with your actual API key from ExchangeRatesAPI.io.

Once activated, use the shortcode [illphated_converter] in any post or page to display the USD to THB converter. Let me know if you want to customize the style or add more currencies! ​

API KEY
d91a782531fe59c3bd40638bae374f9a

```
WORKING CODE: TURNS OUT APILAYER IS NOT FREE AFTERALL

<?php
/**
 * Plugin Name: ILLPHATED Currency Converter
 * Description: Converts between USD and THB using real-time exchange rates via Frankfurter.app (free, no API key).
 * Version: 1.3
 * Author: ILLPHATED
 */

function illphated_currency_converter_shortcode() {
    $html = '
    <style>
        #currency-converter {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 30px auto;
            padding: 20px;
            border-radius: 12px;
            background: #f9f9f9;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        #currency-converter input, #currency-converter select {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            font-size: 16px;
        }
        #currency-converter button {
            padding: 10px;
            width: 100%;
            background-color: #6c5ce7;
            color: white;
            font-size: 16px;
            border: none;
            cursor: pointer;
            border-radius: 6px;
        }
        #currency-converter p {
            font-size: 16px;
            margin-top: 10px;
            text-align: center;
        }
    </style>
    <div id="currency-converter">
        <label for="amount">Amount:</label>
        <input type="number" id="amount" placeholder="Enter amount" />
        <label for="direction">Direction:</label>
        <select id="direction">
            <option value="USD_TO_THB">USD to THB</option>
            <option value="THB_TO_USD">THB to USD</option>
        </select>
        <button id="convertBtn">Convert</button>
        <p id="result"></p>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            document.getElementById("convertBtn").addEventListener("click", async function () {
                const amount = parseFloat(document.getElementById("amount").value);
                const direction = document.getElementById("direction").value;
                const resultEl = document.getElementById("result");

                if (isNaN(amount)) {
                    resultEl.innerText = "Please enter a valid number.";
                    return;
                }

                try {
                    let url = "";
                    if (direction === "USD_TO_THB") {
                        url = "https://api.frankfurter.app/latest?from=USD&to=THB";
                    } else {
                        url = "https://api.frankfurter.app/latest?from=THB&to=USD";
                    }

                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error("Network response was not ok: " + response.statusText);
                    }

                    const data = await response.json();
                    const rate = direction === "USD_TO_THB" ? data.rates.THB : data.rates.USD;

                    let result = (direction === "USD_TO_THB")
                        ? (amount * rate).toFixed(2) + " THB"
                        : (amount * rate).toFixed(2) + " USD";

                    resultEl.innerText = amount + " " + (direction === "USD_TO_THB" ? "USD" : "THB") + 
                                         " = " + result + " (Rate: " + rate + ")";
                } catch (error) {
                    console.error("Conversion error:", error);
                    resultEl.innerText = "Error fetching exchange rate.";
                }
            });
        });
    </script>';
    return $html;
}
add_shortcode('illphated_converter', 'illphated_currency_converter_shortcode');
?>

```
