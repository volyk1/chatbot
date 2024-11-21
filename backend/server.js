import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.AZURE_API_KEY;
const API_ENDPOINT = process.env.AZURE_API_ENDPOINT;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        messages,
        max_tokens: 1600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Azure API error' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Backend error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend proxy running on port ${PORT}`);
});

