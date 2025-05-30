import { useState } from 'react';
import axios from 'axios';

export default function ModuleBuilder() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/module/build', { prompt }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStatus(res.data.message);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Module Builder</h1>
      <textarea className="border w-full p-3" rows="5" placeholder="e.g., Create delivery module for GoSellr"
        value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleGenerate} className="mt-4 px-4 py-2 bg-green-600 text-white">Generate Module</button>
      {status && <p className="mt-4 text-blue-700">{status}</p>}
    </div>
  );
}
