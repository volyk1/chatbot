import React, { useState } from 'react';
import './styles/Chat.scss';
import { BlockMath } from 'react-katex'; // Додаємо імпорт для рендерингу формул

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY_1 = 'a124bff64a4743e8a65045b11cce1dfc';
  const API_ENDPOINT = 'https://ksust4.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview';

  const callApi = async (userInput) => {
    try {
      setLoading(true);
      const context = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));
      context.push({ role: 'user', content: userInput });

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY_1,
        },
        body: JSON.stringify({
          messages: context,
          max_tokens: 1600,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Помилка API:', error);
      return 'Виникла проблема із сервером. Спробуйте пізніше.';
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') {
      alert('Будь ласка, введіть повідомлення!');
      return;
    }

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    document.querySelector('input').focus();

    const botResponse = await callApi(input);
    const botMessage = { sender: 'bot', text: botResponse };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'bot' ? (
              // Для повідомлень бота рендеримо формули через KaTeX
              msg.text.split('\n').map((paragraph, index) => {
                return (
                  <p key={index}>
                    {paragraph.includes('$') ? (
                      <BlockMath>{paragraph}</BlockMath>
                    ) : (
                      paragraph
                    )}
                  </p>
                );
              })
            ) : (
              msg.text
                .split('\n')
                .map((paragraph, index) => <p key={index}>{paragraph.trim()}</p>)
            )}
          </div>
        ))}
        {loading && <div className="loading-message">Зачекайте, триває обробка...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Введіть повідомлення..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage}>Відправити</button>
      </div>
    </div>
  );
};

export default Chat;




