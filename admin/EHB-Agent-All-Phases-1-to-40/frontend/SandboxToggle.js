// SandboxToggle.js
import React from 'react';

const SandboxToggle = ({ enabled, onToggle }) => (
  <label>
    <input type="checkbox" checked={enabled} onChange={onToggle} />
    Enable Secure Sandbox Mode
  </label>
);

export default SandboxToggle;
