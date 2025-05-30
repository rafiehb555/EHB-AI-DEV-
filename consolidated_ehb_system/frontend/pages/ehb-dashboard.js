import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EHBDashboard() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/modules/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(res.data.modules);
    };
    fetchModules();
  }, []);

  return (
    <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {modules.map((mod, index) => (
        <div key={index} className="p-4 shadow-lg border rounded bg-white hover:scale-105 transition">
          <h2 className="font-bold text-lg">{mod.name}</h2>
          <p className="text-sm text-gray-600">{mod.description}</p>
          <p className="text-xs italic text-blue-600">{mod.status}</p>
          <a className="text-indigo-600 underline mt-2 inline-block" href={mod.url}>Open</a>
        </div>
      ))}
    </div>
  );
}
