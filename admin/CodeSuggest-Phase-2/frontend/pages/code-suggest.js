import { useState } from 'react';
import axios from 'axios';

export default function CodeSuggest() {
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const getSuggestion = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/code/suggest', { input }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSuggestion(res.data.suggestion);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">AI Code Suggestion Assistant</h1>
      <textarea className="w-full border p-2" rows="6" placeholder="Enter code or instruction..."
        value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={getSuggestion} className="mt-4 px-4 py-2 bg-blue-600 text-white">Suggest</button>
      {suggestion && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">💡 Suggestion:</h3>
          <pre className="whitespace-pre-wrap">{suggestion}</pre>
        </div>
      )}
    </div>
  );
}
