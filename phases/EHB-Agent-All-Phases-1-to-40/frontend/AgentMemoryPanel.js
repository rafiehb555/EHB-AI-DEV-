// AgentMemoryPanel.js
import React, { useEffect, useState } from 'react';

export default function AgentMemoryPanel() {
  const [memory, setMemory] = useState([]);

  useEffect(() => {
    fetch('/api/agent/memory')
      .then(res => res.json())
      .then(data => setMemory(data));
  }, []);

  return (
    <div>
      <h3>Agent Memory & Response History</h3>
      <ul>
        {memory.map((entry, index) => (
          <li key={index}>
            <strong>Prompt:</strong> {entry.prompt}<br/>
            <strong>Response:</strong> {entry.response}
          </li>
        ))}
      </ul>
    </div>
  );
}
