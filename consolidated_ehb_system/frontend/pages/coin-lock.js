import { useState } from 'react';
import axios from 'axios';

export default function CoinLock() {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('');
  const [message, setMessage] = useState('');

  const handleLock = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/lock/coin', { amount, lockPeriod }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMessage(res.data.message);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">🔐 Coin Lock + Loyalty Bonus</h1>
      <input className="border p-2 w-full mb-2" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select className="border p-2 w-full mb-2" value={lockPeriod} onChange={(e) => setLockPeriod(e.target.value)}>
        <option value="">Select Lock Period</option>
        <option value="12">1 Year</option>
        <option value="24">2 Years</option>
        <option value="36">3 Years</option>
      </select>
      <button className="bg-indigo-600 text-white px-4 py-2" onClick={handleLock}>Lock Coins</button>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
