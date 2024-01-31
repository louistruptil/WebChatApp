import React, { useState, useEffect, useRef } from 'react';
import logo from './img/message.png'

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [newPseudo, setNewPseudo] = useState("");
  const [items, setItems] = useState([]);

  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://YOUR_LOCALHOSTIP:5000');

    const ws = wsRef.current;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    ws.onmessage = event => {
      setItems(JSON.parse(event.data));
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendNewItem = (item) => {
    const message = JSON.stringify(item);
    const ws = wsRef.current;
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const id = new Date().getTime();
    if (newMessage === "" || newPseudo === "")
      return;
    sendNewItem({id: id, name: newMessage, pseudo: newPseudo});
    setNewMessage("");
  }

  const handleChange2 = (event) => {
    setNewPseudo(event.target.value);
  }
  const handleChange = (event) => {
    setNewMessage(event.target.value);
  }

  return (
    <div>
      <div className='background-container'>
        <nav className='navbar'>
          <img src={logo} alt='logo' />
          <div className='nav-links'>
            <ul>
            <input 
                className='pseudo-input'
                value={newPseudo}
                name='input'
                onChange={handleChange2}
                placeholder='Pseudo'
            /> 
            </ul>
          </div>
        </nav>
        <div className='chat-container'>
          {items.map((item) => (
            <div key={item.id}>
              <p>{item.pseudo} : {item.name}</p>
            </div>
          ))}
        </div>
        <div className="chat_button">
          <form onSubmit={handleSubmit}>  
            <label>
              <input
                className='send-input'
                value={newMessage}
                name='input'
                onChange={handleChange}
                placeholder='Chat...'
              />
              <button className='send-btn'>Send</button>
            </label>
          </form>
        </div>
      </div>
    </div>

  );
}

export default App;
