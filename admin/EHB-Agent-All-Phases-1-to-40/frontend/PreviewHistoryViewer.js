// PreviewHistoryViewer.js
import React, { useEffect, useState } from 'react';

export default function PreviewHistoryViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/preview/logs')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div>
      <h3>Preview Execution History</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            <strong>Phase:</strong> {log.phase} — <strong>Time:</strong> {log.time}<br/>
            <code>{log.code}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
