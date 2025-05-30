import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const fetchChat = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/chat/history', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setChat(res.data);
  };

  const sendMessage = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/chat/send', { message }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setChat(prev => [...prev, res.data]);
    setMessage('');
  };

  useEffect(() => { fetchChat(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">EHB AI Chat Assistant</h1>
      <div className="mt-4 space-y-2">
        {chat.map((msg, i) => (
          <div key={i}><b>{msg.role}</b>: {msg.content}</div>
        ))}
      </div>
      <input type="text" className="border mt-4 w-full p-2" value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage} className="mt-2 bg-blue-600 text-white px-4 py-2">Send</button>
    </div>
  );
}
