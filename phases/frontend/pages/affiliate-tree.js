import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AffiliateTree() {
  const [tree, setTree] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/affiliate/tree', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setTree(res.data.tree);
      setTotalEarnings(res.data.totalEarnings);
    });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Affiliate Tree</h1>
      <p><b>Total ROI Earnings:</b> {totalEarnings} Coins</p>
      <ul className="list-disc pl-6 mt-4">
        {tree.map((level, i) => (
          <li key={i}><b>Level {i + 1}</b>: {level.length} Referrals - {level.reduce((sum, u) => sum + u.roi, 0)} ROI</li>
        ))}
      </ul>
    </div>
  );
}
