import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState({});
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data));
  }, []);

  const askAI = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/ai/ask', { prompt }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setReply(res.data.reply);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Phase 5 - Referral & Coin Lock</h1>
      <p>Welcome, {user.email} | Locked Coins: {user.lockedCoins} | Referrals: {user.referrals?.length || 0}</p>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="border p-2 mt-4 w-full" rows="4" />
      <button onClick={askAI} className="mt-2 bg-blue-600 text-white px-4 py-2">Ask GPT</button>
      <div className="mt-4"><strong>Response:</strong> {reply}</div>
    </div>
  );
}
