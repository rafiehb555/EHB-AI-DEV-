import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/profile/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data);
  };

  const updateAvatar = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);
    await axios.post('/api/profile/avatar', formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    fetchProfile();
  };

  useEffect(() => { fetchProfile(); }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p>Email: {user.email}</p>
      <p>SQL Rank: {user.sqlBadge}</p>
      {user.avatar && <img src={user.avatar} alt="avatar" className="w-32 h-32 rounded-full mt-4" />}
      <input type="file" className="mt-4" onChange={e => setFile(e.target.files[0])} />
      <button onClick={updateAvatar} className="bg-blue-600 text-white px-4 py-2 mt-2">Upload Avatar</button>
    </div>
  );
}
