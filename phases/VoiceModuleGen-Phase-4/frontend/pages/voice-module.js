import { useState } from 'react';
import axios from 'axios';

export default function VoiceModuleBuilder() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');

  const uploadAudio = async () => {
    const formData = new FormData();
    formData.append('audio', file);
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/voice/process', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    setResponse(res.data.message);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎤 Voice to Module Generator</h1>
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadAudio} className="mt-4 px-4 py-2 bg-blue-600 text-white">Upload</button>
      {response && <p className="mt-4 text-green-600">{response}</p>}
    </div>
  );
}
