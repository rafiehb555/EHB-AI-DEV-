import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AITools() {
  const [tools, setTools] = useState([]);
  const [title, setTitle] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/tools', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTools(res.data));
  }, []);

  const createTool = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/tools', { title, promptTemplate }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTitle(''); setPromptTemplate('');
    const res = await axios.get('/api/tools', { headers: { Authorization: `Bearer ${token}` } });
    setTools(res.data);
  };

  const runTool = async (tool) => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/tools/run', { toolId: tool._id, input: inputValue }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOutput(res.data.result);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">AI Tool Builder</h1>

      <input className="border p-2 w-full mb-2" placeholder="Tool Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="border p-2 w-full mb-2" placeholder="Prompt Template (use {{input}})" value={promptTemplate} onChange={e => setPromptTemplate(e.target.value)} />
      <button onClick={createTool} className="bg-blue-600 text-white px-4 py-2">Create Tool</button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">My Tools</h2>
        <input className="border p-2 w-full mt-2 mb-2" placeholder="Enter input value" value={inputValue} onChange={e => setInputValue(e.target.value)} />
        <ul className="list-disc pl-6">
          {tools.map((t, i) => (
            <li key={i}>
              <b>{t.title}</b>
              <button onClick={() => runTool(t)} className="ml-2 bg-green-600 text-white px-2 py-1 text-sm">Run</button>
            </li>
          ))}
        </ul>
        {output && <p className="mt-4"><b>Output:</b> {output}</p>}
      </div>
    </div>
  );
}
