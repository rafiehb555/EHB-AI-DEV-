import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PoolIncome() {
  const [income, setIncome] = useState({ poolBonus: 0, referralBonus: 0, totalReferrals: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/income/pool', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setIncome(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Auto Pool & Referral Bonus</h1>
      <p><b>Auto Pool Bonus:</b> {income.poolBonus} Coins</p>
      <p><b>Referral Bonus:</b> {income.referralBonus} Coins</p>
      <p><b>Total Referrals:</b> {income.totalReferrals}</p>
    </div>
  );
}
