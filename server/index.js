// server/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // نحتاج هذه المكتبة لتحديد المسارات
const fetch = require('node-fetch'); // نحتاج fetch في السيرفر

const app = express();
const PORT = 3000;

// 1. تفعيل CORS للسماح بالطلبات
app.use(cors());
app.use(express.json()); // لقراءة JSON

// --- 2. الجزء الخاص بخدمة ملفات الواجهة (Frontend) ---
// هذا هو السطر الذي كان ناقصاً في الكود الذي أرسلته
// (نستخدم '..' للصعود خطوة للأعلى والوصول لمجلد public)
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// --- 3. الجزء الخاص بالوسيط (Proxy) ---
app.post('/generate-image', async (req, res) => {
    try {
        const { model, prompt, parameters } = req.body;

        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                inputs: prompt,
                parameters: parameters,
            }),
        });

        if (!response.ok) {
            throw new Error(`Hugging Face Error: ${response.statusText}`);
        }

        const imageBuffer = await response.arrayBuffer();
        res.set('Content-Type', 'image/jpeg');
        res.send(Buffer.from(imageBuffer));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ السيرفر يعمل الآن على http://localhost:${PORT}`);
    console.log(`الواجهة الأمامية تُقدم من: ${publicPath}`);
});