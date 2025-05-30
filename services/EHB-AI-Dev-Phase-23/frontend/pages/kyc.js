import { useState } from 'react';
import axios from 'axios';

export default function KYC() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('document', file);
    const token = localStorage.getItem('token');

    const res = await axios.post('/api/kyc/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    setStatus(res.data.message);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">KYC Verification</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2">Upload Document</button>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
