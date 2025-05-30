
# 📦 EHB AI Agent Core – Replit Integration Setup

This document guides Replit Agent to properly configure and link all EHB service agents into a unified Core Dashboard.

---

## ✅ Central Integration Instruction

### 📁 Target Agents & Their Locations:

| Agent Name               | Location                                                       |
|--------------------------|----------------------------------------------------------------|
| ehb-free-agent.js        | services/SOT-Technologies/EHB-AI-Dev/ai-agent/                |
| sdkInstaller.js          | services/SOT-Technologies/EHB-AI-Dev/ai-agent/                |
| whisperCommand.js        | services/SOT-Technologies/EHB-AI-Dev/ai-agent/                |
| voice-test.sh            | services/SOT-Technologies/EHB-AI-Dev/ai-agent/                |
| upload-zip.js            | api/                                                           |
| save-email-settings.js   | api/                                                           |
| save-webhook.js          | api/                                                           |
| webhookTrigger.js        | services/SOT-Technologies/EHB-AI-Dev/ai-agent/                |
| ZIPUploader.jsx          | admin/AgentControlPanel/components/                           |
| WebhookConfigPanel.jsx   | admin/AgentControlPanel/components/                           |
| AuthLogin.jsx            | admin/AgentControlPanel/components/                           |
| Logs-Health-Viewer/      | admin/AgentControlPanel/components/                           |
| snapshot-rollback-manager| services/SOT-Technologies/EHB-AI-Dev/                         |

---

## 🧠 Unified Core Dashboard Features

- ✅ All agents should report status to `/ai-core`
- 📊 View logs, delivery status, voice output, ZIP uploads from one place
- 🧠 Agent will auto-choose relevant script for any department or job
- 💡 Auto-repair + webhook/email trigger if errors found

---

## 🛠️ Auto-Agent Flow (Startup Script Suggestion)

```bash
node services/SOT-Technologies/EHB-AI-Dev/ai-agent/ehb-free-agent.js
node services/SOT-Technologies/EHB-AI-Dev/ai-agent/sdkInstaller.js
node services/SOT-Technologies/EHB-AI-Dev/ai-agent/whisperCommand.js
bash services/SOT-Technologies/EHB-AI-Dev/ai-agent/voice-test.sh
```

---

## 🔐 Agent Instructions

- Auto-detect `.zip` files from `/uploaded-zips`
- Auto-route logs to `/logs/`
- Auto-detect changes in `/config/`
- All agents must sync with `/ai-core` main status

---

## 🧩 Developer Note

- This setup prevents Replit billing by using local and free AI APIs.
- All agents are reusable without OpenAI API costs.
- You can freely scale, add new services, or extend functions using this unified model.
