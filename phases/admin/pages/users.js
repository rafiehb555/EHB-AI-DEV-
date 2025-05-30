import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get('/api/admin/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin: Manage Users</h1>
      <ul className="list-disc pl-5">
        {users.map((u, i) => <li key={i}>{u.email} - {u.sqlBadge} - {u.tokens} tokens</li>)}
      </ul>
    </div>
  );
}
