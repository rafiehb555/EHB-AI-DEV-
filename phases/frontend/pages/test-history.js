import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TestHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/test/history', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setHistory(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Your Test History</h1>
      <ul className="list-disc pl-6">
        {history.map((item, i) => (
          <li key={i}>{item.date} - {item.status}</li>
        ))}
      </ul>
    </div>
  );
}
