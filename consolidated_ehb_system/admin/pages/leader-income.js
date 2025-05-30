import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LeaderIncome() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/leader-income').then(res => setLeaders(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Leader Income Report</h1>
      <table className="w-full border">
        <thead><tr><th>Email</th><th>Referrals</th><th>Referral Bonus</th></tr></thead>
        <tbody>
          {leaders.map((l, i) => (
            <tr key={i} className="text-center">
              <td>{l.email}</td>
              <td>{l.referrals}</td>
              <td>{l.referralBonus} Coins</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
