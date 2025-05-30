import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Staking() {
  const [stakeInfo, setStakeInfo] = useState({ locked: 0, unlocked: 0, monthlyReward: 0 });
  const [amount, setAmount] = useState(0);

  const fetchStake = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/stake/info', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStakeInfo(res.data);
  };

  const lockCoins = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/stake/lock', { amount }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchStake();
  };

  const unlockCoins = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/stake/unlock', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchStake();
  };

  useEffect(() => { fetchStake(); }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Staking Panel</h1>
      <p><b>Locked Coins:</b> {stakeInfo.locked}</p>
      <p><b>Unlocked Coins:</b> {stakeInfo.unlocked}</p>
      <p><b>Monthly Reward:</b> {stakeInfo.monthlyReward} Coins</p>
      <input type="number" placeholder="Amount to Lock" className="border p-2 mt-2 w-full" value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={lockCoins} className="bg-blue-600 text-white px-4 py-2 mt-2">Lock Coins</button>
      <button onClick={unlockCoins} className="bg-green-600 text-white px-4 py-2 mt-2 ml-2">Unlock Coins</button>
    </div>
  );
}
