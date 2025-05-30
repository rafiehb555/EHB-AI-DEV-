
// 🔁 Agent Auto-Restore Script
const fs = require('fs');
const { exec } = require('child_process');

const REQUIRED_FILES = [
  'EHB-AI-DEV/agent/brain.js',
  'EHB-AI-DEV/blockchain/index.js',
  'EHB-AI-DEV/websocket/server.js',
  'EHB-AI-DEV/ui/AgentControlPanel.jsx'
];

let missing = REQUIRED_FILES.filter(path => !fs.existsSync(path));

if (missing.length > 0) {
  console.log('⚠️ Missing files detected:');
  console.log(missing.join('\n'));

  console.log('🔁 Restoring from ZIP backup...');
  exec('unzip -o backup/ehb-agent-backups/EHB-AI-DEV-AgentSystem-Phase-1.zip -d .', (err) => {
    if (err) {
      console.error('❌ Restore failed:', err);
    } else {
      console.log('✅ Agent system restored successfully.');
      
      // Verify restoration
      missing = REQUIRED_FILES.filter(path => !fs.existsSync(path));
      if (missing.length > 0) {
        console.error('⚠️ Some files still missing after restore:');
        console.error(missing.join('\n'));
      }
    }
  });
} else {
  console.log('✅ All agent files present. No restore needed.');
}
