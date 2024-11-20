import React, { useState } from 'react';
import './styles/Chat.scss'; // Підключаємо SCSS

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Функція псевдо-запиту до API
  const fakeApiCall = async (userInput) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ response: `Відповідь на ваше питання: "${userInput}"` });
      }, 1000);
    });
  };

  // Обробка відправки повідомлення
  const handleSendMessage = async () => {
    if (input.trim() === '') {
      alert('Будь ласка, введіть повідомлення!');
      return;
    }

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    document.querySelector('input').focus();

    const botResponse = await fakeApiCall(input);
    const botMessage = { sender: 'bot', text: botResponse.response };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  // Обробка натискання клавіші
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  // Запобігає додаванню нового рядка
      handleSendMessage();  // Викликає відправку повідомлення
    }
  };

  // Рендеринг
  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Введіть повідомлення..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}  // Додаємо обробку натискання клавіші
        />
        <button onClick={handleSendMessage}>Відправити</button>
      </div>
    </div>
  );
};

export default Chat;


