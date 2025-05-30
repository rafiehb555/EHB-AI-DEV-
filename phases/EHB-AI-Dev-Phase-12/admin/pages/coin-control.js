import { useState } from 'react';
import axios from 'axios';

export default function CoinControl() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(0);

  const adjustCoins = async () => {
    await axios.post('/api/admin/coins', { email, amount });
    alert('Coins updated!');
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Admin: Coin Control</h1>
      <input type="email" placeholder="User Email" className="border p-2 w-full mt-2" onChange={e => setEmail(e.target.value)} />
      <input type="number" placeholder="Coins" className="border p-2 w-full mt-2" onChange={e => setAmount(e.target.value)} />
      <button onClick={adjustCoins} className="bg-blue-600 text-white px-4 py-2 mt-2">Update Coins</button>
    </div>
  );
}
