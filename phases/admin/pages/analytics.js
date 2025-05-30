import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Analytics() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/api/admin/analytics').then(res => setData(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Admin Analytics</h1>
      <p>Total Users: {data.totalUsers}</p>
      <p>VIP Badges: {data.vipCount}</p>
      <p>Passed Tests: {data.passCount}</p>
    </div>
  );
}
