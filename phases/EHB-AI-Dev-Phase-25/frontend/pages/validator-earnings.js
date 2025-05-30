import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ValidatorEarnings() {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/validator/earnings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEarnings(res.data.earnings);
    };
    fetchEarnings();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📈 Validator Earnings + Loyalty Bonus</h1>
      <ul className="space-y-3">
        {earnings.map((item, i) => (
          <li key={i} className="border p-4 rounded shadow">
            <p><strong>💰 Order Income:</strong> {item.orderIncome}</p>
            <p><strong>🔒 Coin Lock Bonus:</strong> {item.loyaltyBonus}%</p>
            <p><strong>📅 Date:</strong> {new Date(item.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
