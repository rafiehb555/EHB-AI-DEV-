import { useState } from 'react';
import axios from 'axios';

export default function TestStatus() {
  const [score, setScore] = useState('');
  const [result, setResult] = useState('');

  const submitTest = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/test/submit', { score }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResult(res.data.result);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📊 Test Result Status</h1>
      <input type="number" placeholder="Enter your score (0-100)" className="border p-2 w-full"
        value={score} onChange={(e) => setScore(e.target.value)} />
      <button onClick={submitTest} className="mt-4 px-4 py-2 bg-purple-600 text-white">Submit Test</button>
      {result && (
        <p className="mt-4 text-green-700">🎯 Result: <strong>{result}</strong></p>
      )}
    </div>
  );
}
