import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');

  const askAI = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/ai/ask', { prompt }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setReply(res.data.reply);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">EHB AI Agent (Phase 2)</h1>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="border p-2 mt-4 w-full" rows="4" />
      <button onClick={askAI} className="mt-2 bg-blue-500 text-white px-4 py-2">Ask AI</button>
      <div className="mt-4 text-left"><strong>Response:</strong> {reply}</div>
    </div>
  );
}
