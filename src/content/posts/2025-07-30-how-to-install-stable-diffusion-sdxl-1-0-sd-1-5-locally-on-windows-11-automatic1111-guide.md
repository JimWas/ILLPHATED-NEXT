---
layout: "post"
title: "How to Install Stable Diffusion SDXL 1.0 &amp; SD 1.5 Locally on Windows 11 (AUTOMATIC1111 Guide)"
date: "2025-07-30 20:33:23"
modified: "2025-07-30 20:33:23"
slug: "how-to-install-stable-diffusion-sdxl-1-0-sd-1-5-locally-on-windows-11-automatic1111-guide"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/07/Gemini_Generated_Image_nyr5senyr5senyr5.jpg"
featured_image_relative: "2025/07/Gemini_Generated_Image_nyr5senyr5senyr5.jpg"
---

# How to Install Stable Diffusion SDXL 1.0 & SD 1.5 Locally on Windows 11 (AUTOMATIC1111 Guide)

If you’ve ever wanted to create stunning AI‑generated art on your own PC — no internet connection required — this guide will walk you through installing both **Stable Diffusion XL 1.0 (SDXL)** and **Stable Diffusion 1.5** on **Windows 11** using **AUTOMATIC1111**.

You’ll be able to run realistic models, train on your own images, and switch between SDXL and SD 1.5 anytime.

---

## **1. Check Your GPU VRAM**

* **SDXL 1.0** works best with **8GB+ VRAM**.
* **SD 1.5** runs well on **6GB VRAM or less**.
* Lower VRAM can still work using AUTOMATIC1111’s `--medvram` or `--lowvram` modes.

---

## **2. Install Required Software**

### **Python 3.10.6**

* Download: [https://www.python.org/downloads/release/python-3106/](https://www.python.org/downloads/release/python-3106/)
* **Important:** Check **“Add Python to PATH”** during installation.

### **Git for Windows**

* Download: [https://git-scm.com/download/win](https://git-scm.com/download/win)
* Install with default settings.

---

## **3. Install AUTOMATIC1111 Web UI**

1. Choose a folder where you want to install it (example: `C:AI`).
2. Right‑click inside the folder → **Git Bash Here**.
3. Run:

   ```bash
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
   ```
4. This creates a folder called `stable-diffusion-webui`.

---

## **4. Download the Models**

### **Stable Diffusion XL 1.0**

1. **Base model**: [SDXL Base 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)

   * File: `sd_xl_base_1.0.safetensors`
2. **Refiner model**: [SDXL Refiner 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0)

   * File: `sd_xl_refiner_1.0.safetensors`

### **Stable Diffusion 1.5**

* Download from: [SD 1.5 on Hugging Face](https://huggingface.co/runwayml/stable-diffusion-v1-5)

  * File: `v1-5-pruned-emaonly.safetensors`

---

## **5. Place Models in the Correct Folder**

Move all `.safetensors` files into:

```
stable-diffusion-webuimodelsStable-diffusion
```

---

## **6. Launch AUTOMATIC1111**

1. Open the `stable-diffusion-webui` folder.
2. Double‑click:

   ```
   webui-user.bat
   ```
3. First launch will install dependencies — this can take a few minutes.
4. Once loaded, open your browser and go to:

   ```
   http://127.0.0.1:7860
   ```

---

## **7. Running SDXL vs SD 1.5**

In AUTOMATIC1111, select your model in the **top left dropdown**:

* **For SDXL**: Choose `sd_xl_base_1.0.safetensors`.
* **For SD 1.5**: Choose `v1-5-pruned-emaonly.safetensors`.

**Recommended Settings:**

* **SDXL**: 1024×1024 resolution, 25–30 steps, CFG 5–7.
* **SD 1.5**: 512×512 resolution, 20–25 steps, CFG 7–8.

---

## **8. (Optional) Use the SDXL Refiner**

1. Generate your image with the **SDXL base model**.
2. Switch to **SDXL Refiner**.
3. Go to **img2img**, upload your base image.
4. Set denoise strength to **0.2–0.3** for subtle detail enhancement.

---

## **9. VRAM Optimization Tips**

* Launch with:

  ```bat
  set COMMANDLINE_ARGS=--xformers --medvram
  ```
* Use **Hires. fix** instead of generating huge images in one go.
* Keep resolutions reasonable for your GPU.

---

## **10. Bonus: Better Realistic Models**

Once you have SDXL running, try:

* **RealVisXL v4.0** ([Hugging Face](https://huggingface.co/SG161222/RealVisXL_V4.0)) – Amazing realism.
* **JuggernautXL v8** ([Hugging Face](https://huggingface.co/RunDiffusion/Juggernaut-XL-v8)) – Great balance of realism & creativity.
* **Realistic Vision v5.1** ([Hugging Face](https://huggingface.co/SG161222/Realistic_Vision_V5.1)) – Best SD 1.5‑based realism.

---

With this setup, you can now generate **photorealistic portraits**, train your own face models, or create any kind of AI‑powered art directly on your Windows 11 PC.

You can keep both **SDXL** and **SD 1.5** installed and switch between them anytime inside AUTOMATIC1111.

---

**Author:** Illphated
**Website:** [illphated.com](https://illphated.com)
