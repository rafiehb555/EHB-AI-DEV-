import { useState } from 'react';
import axios from 'axios';

export default function AIBuild() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('');

  const generateModule = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/generate/module', { prompt }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStatus(res.data.message);
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">AI Module Builder</h1>
      <textarea className="border w-full p-2" rows="4" placeholder="e.g., Build login system for GoSellr"
        value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={generateModule} className="mt-4 px-4 py-2 bg-blue-600 text-white">Generate</button>
      {status && <p className="mt-4 text-green-600">{status}</p>}
    </div>
  );
}
