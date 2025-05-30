import { useState } from 'react';
import axios from 'axios';

export default function SQLBadge() {
  const [score, setScore] = useState('');
  const [badge, setBadge] = useState('');

  const submitScore = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/sql/submit-score', { score }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBadge(res.data.badge);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🎖 SQL Badge System</h1>
      <input type="number" placeholder="Enter your score (0-100)" className="border p-2 w-full"
        value={score} onChange={(e) => setScore(e.target.value)} />
      <button onClick={submitScore} className="mt-4 px-4 py-2 bg-green-600 text-white">Submit</button>
      {badge && (
        <p className="mt-4 text-blue-700">🏅 Aapka badge: <strong>{badge}</strong></p>
      )}
    </div>
  );
}
