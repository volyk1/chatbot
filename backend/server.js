import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Завантаження змінних середовища
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Налаштування CORS
const allowedOrigins = [
  'https://chatbot-oi96.onrender.com', // Домен Render
  'http://localhost:3000' // Для локальної розробки
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Налаштування body-parser
app.use(bodyParser.json());

// Обробка API запитів
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    // Логування запиту для перевірки
    console.log('Received messages:', messages);

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

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


