const CommandLog = require('../../models/CommandLog');

const routeMap = {
  "gosellr": "/gosellr",
  "referral": "/referral-tree",
  "badge": "/sql-badge",
  "test": "/test-status",
  "dashboard": "/ehb-dashboard",
  "agent": "/ai-agent"
};

exports.runCommand = async (req, res) => {
  const { command } = req.body;
  const userId = req.user.id;

  let matchedRoute = null;
  const lower = command.toLowerCase();

  for (const key in routeMap) {
    if (lower.includes(key)) {
      matchedRoute = routeMap[key];
      break;
    }
  }

  await CommandLog.create({
    user: userId,
    command,
    route: matchedRoute || "No Match"
  });

  if (matchedRoute) {
    return res.json({ route: matchedRoute });
  } else {
    return res.json({ message: "😕 Mujhe samajh nahi aaya. Kya aap dobara bolenge?" });
  }
};
