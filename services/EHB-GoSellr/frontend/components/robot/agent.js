// robot-agent.js
const { askOpenAI } = require("./apis/openai-helper");

async function runRobotTask(taskDescription) {
  console.log("🤖 Thinking on task:", taskDescription);

  const aiResponse = await askOpenAI(
    `You are a professional developer robot. Perform this task:\n\n${taskDescription}\n\nRespond in a clear and executable way.`,
  );

  console.log("💡 AI Response:\n", aiResponse);
}

// ✅ Example Task
runRobotTask(
  "Extract a ZIP file, move its contents to /home/runner/project/, and delete the ZIP file.",
);
