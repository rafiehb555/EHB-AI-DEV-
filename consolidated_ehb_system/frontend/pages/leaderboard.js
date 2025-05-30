import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/leaderboard').then(res => setUsers(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Global Leaderboard</h1>
      <table className="w-full table-auto border">
        <thead><tr><th>Email</th><th>Tokens</th><th>Badge</th></tr></thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} className="text-center">
              <td>{u.email}</td>
              <td>{u.tokens}</td>
              <td>{u.sqlBadge}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
