// PreviewPanelDisplay.js
import React from 'react';

const PreviewPanelDisplay = ({ code }) => (
  <div className="preview-output">
    <h3>Live Output:</h3>
    <pre>{code}</pre>
  </div>
);

export default PreviewPanelDisplay;
