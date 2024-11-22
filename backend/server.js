import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());

// Обробка API запитів
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch(process.env.AZURE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages,
        max_tokens: 1600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error(`Azure API error: ${response.statusText}`);
      return res.status(response.status).json({ error: 'Azure API error' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Backend error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Статичні файли для продакшн середовища
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'build');
  
  if (!fs.existsSync(buildPath)) {
    console.error('Build folder is missing.');
    process.exit(1);
  }

  app.use(express.static(buildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Лог запуску сервера
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

