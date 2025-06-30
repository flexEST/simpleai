const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// HTML faylını göstər
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// AI cavab endpointi
app.post('/ask', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Yalnız Azərbaycan dilində cavab verin.' },
                    { role: 'user', content: userMessage }
                ]
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Cavab tapılmadı.";
        res.json({ reply });
    } catch (error) {
        console.error("API xətası:", error);
        res.status(500).json({ reply: "AI xidmətinə qoşula bilmədik." });
    }
});

app.listen(PORT, () => {
    console.log(`Server işə düşdü: http://localhost:${PORT}`);
});
