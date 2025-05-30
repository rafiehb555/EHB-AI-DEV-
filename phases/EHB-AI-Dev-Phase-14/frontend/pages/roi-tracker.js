import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ROITracker() {
  const [roiData, setRoiData] = useState({ totalInvested: 0, totalReturned: 0, weeklyEarnings: [] });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/roi/summary', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setRoiData(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">ROI Tracker</h1>
      <p><b>Total Invested:</b> {roiData.totalInvested} Coins</p>
      <p><b>Total Returned:</b> {roiData.totalReturned} Coins</p>
      <h2 className="text-xl font-semibold mt-6">Weekly Earnings</h2>
      <ul className="list-disc pl-6">
        {roiData.weeklyEarnings.map((week, i) => (
          <li key={i}>{week.week}: {week.amount} Coins</li>
        ))}
      </ul>
    </div>
  );
}
