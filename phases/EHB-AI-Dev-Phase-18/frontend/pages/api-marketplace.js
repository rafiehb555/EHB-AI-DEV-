import { useEffect, useState } from 'react';
import axios from 'axios';

export default function APIMarketplace() {
  const [apis, setApis] = useState([]);
  const [name, setName] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/apis', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setApis(res.data));
  }, []);

  const saveAPI = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/apis', { name, endpoint, key }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setName(''); setEndpoint(''); setKey('');
    const res = await axios.get('/api/apis', { headers: { Authorization: `Bearer ${token}` } });
    setApis(res.data);
  };

  const testAPI = async (api) => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/apis/test', { id: api._id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResult(res.data.response);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">API Marketplace</h1>
      <input placeholder="API Name" className="border p-2 w-full mb-2" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Endpoint URL" className="border p-2 w-full mb-2" value={endpoint} onChange={e => setEndpoint(e.target.value)} />
      <input placeholder="API Key" className="border p-2 w-full mb-2" value={key} onChange={e => setKey(e.target.value)} />
      <button onClick={saveAPI} className="bg-blue-600 text-white px-4 py-2">Save API</button>

      <h2 className="text-xl font-semibold mt-6">Saved APIs</h2>
      <ul className="list-disc pl-6 mt-2">
        {apis.map((api, i) => (
          <li key={i}>
            <b>{api.name}</b>
            <button className="ml-2 bg-green-600 text-white px-2 py-1 text-sm" onClick={() => testAPI(api)}>Test</button>
          </li>
        ))}
      </ul>
      {result && <div className="mt-4 bg-gray-100 p-4"><b>Result:</b> {result}</div>}
    </div>
  );
}
