import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PromptBank() {
  const [prompts, setPrompts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/prompts', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setPrompts(res.data));
  }, []);

  const savePrompt = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/prompts', { title, content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTitle(''); setContent('');
    const res = await axios.get('/api/prompts', { headers: { Authorization: `Bearer ${token}` } });
    setPrompts(res.data);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">AI Prompt Bank</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full mb-2" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Prompt Content" className="border p-2 w-full mb-2" rows="4" />
      <button onClick={savePrompt} className="bg-blue-600 text-white px-4 py-2">Save Prompt</button>

      <h2 className="mt-6 text-xl font-semibold">Saved Prompts</h2>
      <ul className="list-disc pl-6 mt-2">
        {prompts.map((p, i) => (
          <li key={i}><b>{p.title}</b>: {p.content}</li>
        ))}
      </ul>
    </div>
  );
}
