import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    alert('Login Successful!');
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Login</h1>
      <input type="email" placeholder="Email" className="border p-2 mt-2 w-full" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 mt-2 w-full" onChange={e => setPassword(e.target.value)} />
      <button onClick={loginUser} className="mt-4 bg-green-500 text-white px-4 py-2">Login</button>
    </div>
  );
}
