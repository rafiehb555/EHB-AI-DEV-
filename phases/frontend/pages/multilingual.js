import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Multilingual() {
  const [text, setText] = useState('');
  const [translated, setTranslated] = useState('');
  const [detectedLang, setDetectedLang] = useState('');

  const detectAndTranslate = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/translate', { text }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDetectedLang(res.data.language);
    setTranslated(res.data.translation);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Multilingual Auto Translator</h1>
      <textarea className="border p-2 w-full mb-2" rows="4" value={text} onChange={e => setText(e.target.value)} placeholder="Enter any text..." />
      <button onClick={detectAndTranslate} className="bg-blue-600 text-white px-4 py-2">Translate</button>

      {translated && (
        <div className="mt-4">
          <p><b>Detected Language:</b> {detectedLang}</p>
          <p><b>Translation (EN):</b> {translated}</p>
        </div>
      )}
    </div>
  );
}
