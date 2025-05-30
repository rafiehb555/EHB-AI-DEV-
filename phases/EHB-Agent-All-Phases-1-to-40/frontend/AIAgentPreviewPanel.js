// AIAgentPreviewPanel.js
import React from 'react';

const AIAgentPreviewPanel = ({ prompt, result }) => (
  <div className="ai-preview">
    <h3>AI Agent Preview Link</h3>
    <p><strong>Prompt:</strong> {prompt}</p>
    <pre>{result}</pre>
  </div>
);

export default AIAgentPreviewPanel;
