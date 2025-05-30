// APITestPanel.js
import React, { useState } from 'react';

export default function APITestPanel() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('{}');
  const [response, setResponse] = useState('');

  const sendRequest = async () => {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(method !== 'GET' && { body })
      };
      const res = await fetch(url, options);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(err.message);
    }
  };

  return (
    <div>
      <h3>Live API Tester</h3>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter endpoint URL" />
      <select value={method} onChange={e => setMethod(e.target.value)}>
        <option>GET</option>
        <option>POST</option>
      </select>
      {method !== 'GET' && (
        <textarea value={body} onChange={e => setBody(e.target.value)} />
      )}
      <button onClick={sendRequest}>Send</button>
      <pre>{response}</pre>
    </div>
  );
}
