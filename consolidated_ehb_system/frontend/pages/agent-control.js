import { useState } from 'react';
import axios from 'axios';

export default function AgentControl() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');

  const handleCommand = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/command/run', { command }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOutput(res.data.route || res.data.message);
    if (res.data.route) window.location.href = res.data.route;
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🤖 AI Dashboard Controller</h1>
      <input type="text" className="w-full p-3 border" placeholder="e.g., open GoSellr, show badges"
        value={command} onChange={(e) => setCommand(e.target.value)} />
      <button onClick={handleCommand} className="mt-4 bg-indigo-600 text-white px-4 py-2">Run Command</button>
      {output && <p className="mt-4 text-green-700 font-semibold">{output}</p>}
    </div>
  );
}
