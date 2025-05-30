import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Income() {
  const [summary, setSummary] = useState({ totalReceived: 0, totalSent: 0, monthlyIncome: [] });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/income/summary', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSummary(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Income Dashboard</h1>
      <p>Total Coins Received: <b>{summary.totalReceived}</b></p>
      <p>Total Coins Sent: <b>{summary.totalSent}</b></p>
      <h2 className="text-xl font-semibold mt-6">Monthly Income</h2>
      <ul className="list-disc pl-6">
        {summary.monthlyIncome.map((item, i) => (
          <li key={i}>{item.month}: {item.total} coins</li>
        ))}
      </ul>
    </div>
  );
}
