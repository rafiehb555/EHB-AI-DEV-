// PreviewLaunchButton.js
import React from 'react';

const PreviewLaunchButton = ({ onLaunch }) => (
  <button onClick={onLaunch} className="launch-btn">
    🚀 One-Click Preview
  </button>
);

export default PreviewLaunchButton;
