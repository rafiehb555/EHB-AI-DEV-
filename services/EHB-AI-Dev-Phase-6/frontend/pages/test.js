import { useState } from 'react';
import axios from 'axios';

export default function TestPage() {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');

  const submitTest = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/test/submit', { answer }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResult(res.data.message);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Phase 6 - Test System</h1>
      <p className="mt-2">Q: What is 5 + 5?</p>
      <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} className="border p-2 w-full mt-2" />
      <button onClick={submitTest} className="mt-4 bg-blue-600 text-white px-4 py-2">Submit</button>
      <p className="mt-4 text-green-600 font-semibold">{result}</p>
    </div>
  );
}
