import { useState } from 'react';
import axios from 'axios';

export default function AIChat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const askAI = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/chat/ask', { question }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAnswer(res.data.answer);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">💬 AI Coding Chat</h1>
      <textarea className="w-full border p-3" rows="4" placeholder="e.g., How do I create a login page?"
        value={question} onChange={(e) => setQuestion(e.target.value)} />
      <button onClick={askAI} className="mt-4 px-4 py-2 bg-indigo-600 text-white">Ask</button>
      {answer && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <strong>🧠 AI Says:</strong>
          <pre className="whitespace-pre-wrap">{answer}</pre>
        </div>
      )}
    </div>
  );
}
