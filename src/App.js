import React from 'react';
import './styles/Chat.scss';
import Chat from './ChatPage'; // Імпортуємо ваш компонент чату

function App() {
  return (
    <div className="App">
      <Chat /> {/* Відображення компонента чату */}
    </div>
  );
}

export default App;

