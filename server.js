import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // HTML buradan yüklənir

app.post('/ask', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Yalnız Azərbaycan dilində cavab verin." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await apiRes.json();
        res.json({ reply: data.choices?.[0]?.message?.content });

    } catch (error) {
        res.status(500).json({ error: "API xətası" });
    }
});

app.listen(3000, () => console.log("Server işə düşdü: http://localhost:3000"));
