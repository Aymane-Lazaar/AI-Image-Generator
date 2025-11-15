# 🤖 AI Image Generator (Hugging Face)

This is a simple web application for generating images from text prompts using the Hugging Face Inference API.

This project uses a Node.js (Express) back-end as a secure proxy to handle API requests. This is a critical security practice to protect the secret API key from being exposed on the front-end.

## 💻 Tech Stack

* **Front-End:** HTML, CSS, JavaScript (Fetch API)
* **Back-End:** Node.js, Express.js
* **Libraries:** `cors`, `node-fetch`
* **API:** Hugging Face Inference API

## ✨ Features

* **Secure:** API key is stored securely on the back-end.
* **Custom Options:** Select different models, image counts, and aspect ratios.
* **Loading State:** Clear loading spinners are shown while images are being generated.
* **Responsive:** Simple, clean interface that works on different screen sizes.

---

## 🚀 How to Run this Project

You must run **both** the back-end server and the front-end client.

### 1. Clone the Repository

```bash
git clone [https://github.com/Aymane-Lazaar/AI-Image-Generator.git](https://github.com/Aymane-Lazaar/AI-Image-Generator.git)
cd AI-Image-Generator

```

2. Set Up the Back-End (Server)
First, start the server which will handle the API requests.

Navigate to the server directory:

Bash

cd server
Install the required Node.js packages:

Bash

npm install
Create an Environment File

Create a new file in the /server directory named .env

Add your Hugging Face API Key to this file. (Get your key from Hugging Face Settings)

.env

HUGGING_FACE_KEY="hf_YOUR_SECRET_API_KEY"
(This file is already in .gitignore to prevent it from being pushed to GitHub).

Start the back-end server:

Bash

node index.js
The server will start and listen on http://localhost:3000.
