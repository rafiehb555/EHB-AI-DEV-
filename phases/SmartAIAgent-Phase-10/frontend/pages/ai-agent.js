import { useState } from 'react';
import axios from 'axios';

export default function AIAgent() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/agent/chat', { message }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setReply(res.data.reply);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🤖 Smart AI Agent</h1>
      <textarea className="w-full border p-3 mb-4" rows="4" placeholder="Ask the AI agent anything..."
        value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      {reply && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold">💬 AI Reply:</h2>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}
