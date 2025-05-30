import { useState } from 'react';
import axios from 'axios';

export default function ReferralTree() {
  const [refCode, setRefCode] = useState('');
  const [response, setResponse] = useState('');

  const registerReferral = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/referral/register', { refCode }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResponse(res.data.message);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🌲 Referral Tree System</h1>
      <input type="text" placeholder="Enter Referral Code" className="border p-2 w-full"
        value={refCode} onChange={(e) => setRefCode(e.target.value)} />
      <button onClick={registerReferral} className="mt-4 px-4 py-2 bg-indigo-600 text-white">Register</button>
      {response && (
        <p className="mt-4 text-green-700">{response}</p>
      )}
    </div>
  );
}
