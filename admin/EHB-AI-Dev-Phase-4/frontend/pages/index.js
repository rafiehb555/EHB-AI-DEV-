import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [badge, setBadge] = useState('');

  const askAI = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/ai/ask', { prompt }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setReply(res.data.reply);
    setBadge(res.data.badge);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">EHB AI Assistant (Phase 4)</h1>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="border p-2 mt-4 w-full" rows="4" />
      <button onClick={askAI} className="mt-2 bg-blue-600 text-white px-4 py-2">Ask GPT</button>
      <div className="mt-4"><strong>Response:</strong> {reply}</div>
      <div className="mt-2 text-green-600"><strong>Your SQL Badge:</strong> {badge}</div>
    </div>
  );
}
