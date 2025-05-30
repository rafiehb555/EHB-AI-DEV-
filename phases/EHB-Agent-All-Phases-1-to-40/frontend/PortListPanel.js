// PortListPanel.js
import React, { useState, useEffect } from 'react';

const PortListPanel = () => {
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    fetch('/api/ports')
      .then(res => res.json())
      .then(data => setPorts(data));
  }, []);

  return (
    <div>
      <h2>Active Ports</h2>
      <ul>
        {ports.map(port => (
          <li key={port}>Port {port} is active</li>
        ))}
      </ul>
    </div>
  );
};

export default PortListPanel;
