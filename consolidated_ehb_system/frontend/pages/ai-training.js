import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AITrainingLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/ai/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.logs);
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🤖 AI Robot Training Logs</h1>
      <ul className="space-y-4">
        {logs.map((log, i) => (
          <li key={i} className="p-4 border rounded shadow bg-white">
            <p><strong>🧠 Training Type:</strong> {log.trainingType}</p>
            <p><strong>📄 Summary:</strong> {log.summary}</p>
            <p><strong>📅 Date:</strong> {new Date(log.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
