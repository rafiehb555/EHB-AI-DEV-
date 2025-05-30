import { useState } from 'react';
import axios from 'axios';

export default function Recharge() {
  const [email, setEmail] = useState('');
  const [tokens, setTokens] = useState(5);

  const recharge = async () => {
    const res = await axios.post('/api/admin/recharge', { email, tokens });
    alert(res.data.message);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Admin: Recharge User Tokens</h1>
      <input type="email" placeholder="User Email" className="border p-2 w-full mt-2" onChange={e => setEmail(e.target.value)} />
      <input type="number" placeholder="Tokens" value={tokens} className="border p-2 w-full mt-2" onChange={e => setTokens(e.target.value)} />
      <button onClick={recharge} className="mt-4 bg-green-600 text-white px-4 py-2">Recharge</button>
    </div>
  );
}
