import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Wallet() {
  const [user, setUser] = useState({});
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(1);
  const [history, setHistory] = useState([]);

  const fetchWallet = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/wallet/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data);
  };

  const transferCoins = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/wallet/transfer', { recipient, amount }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchWallet();
    getHistory();
  };

  const getHistory = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/wallet/history', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setHistory(res.data);
  };

  useEffect(() => {
    fetchWallet();
    getHistory();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>
      <p><strong>Coins:</strong> {user.walletCoins}</p>
      <div className="mt-4">
        <input type="text" placeholder="Recipient Email" className="border p-2 w-full" onChange={e => setRecipient(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} className="border p-2 w-full mt-2" onChange={e => setAmount(e.target.value)} />
        <button onClick={transferCoins} className="bg-green-600 text-white px-4 py-2 mt-2">Transfer</button>
      </div>
      <h2 className="mt-6 text-xl font-semibold">Reward History</h2>
      <ul className="list-disc pl-5 mt-2">
        {history.map((h, i) => <li key={i}>{h.type} - {h.amount} to {h.toEmail} at {new Date(h.date).toLocaleString()}</li>)}
      </ul>
    </div>
  );
}
