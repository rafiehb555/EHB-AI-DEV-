import { useState } from 'react';
import axios from 'axios';

export default function Referrals() {
  const [email, setEmail] = useState('');
  const [refEmail, setRefEmail] = useState('');

  const refer = async () => {
    const res = await axios.post('/api/admin/add-referral', { email, refEmail });
    alert(res.data.message);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-xl font-bold">Admin: Add Referral</h1>
      <input type="email" placeholder="Main User Email" className="border p-2 mt-2 w-full" onChange={e => setEmail(e.target.value)} />
      <input type="email" placeholder="Referral Email" className="border p-2 mt-2 w-full" onChange={e => setRefEmail(e.target.value)} />
      <button onClick={refer} className="mt-4 bg-blue-500 text-white px-4 py-2">Add Referral</button>
    </div>
  );
}
