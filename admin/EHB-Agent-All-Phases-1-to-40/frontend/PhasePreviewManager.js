// PhasePreviewManager.js
import React, { useState } from 'react';

const mockPhases = [
  { id: 1, name: 'Phase 1: Core Setup', port: 5120 },
  { id: 2, name: 'Phase 2: Code Runner', port: 5121 },
  { id: 3, name: 'Phase 3: Port Monitor', port: 5122 },
];

export default function PhasePreviewManager() {
  const [selectedPhase, setSelectedPhase] = useState(null);

  return (
    <div>
      <h3>Multi-Phase Preview Manager</h3>
      <ul>
        {mockPhases.map(phase => (
          <li key={phase.id}>
            <button onClick={() => setSelectedPhase(phase)}>
              {phase.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedPhase && (
        <iframe
          title="Preview"
          src={`http://localhost:${selectedPhase.port}`}
          width="100%"
          height="400px"
        />
      )}
    </div>
  );
}
