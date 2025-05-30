exports.chatWithAgent = async (req, res) => {
  const { message } = req.body;
  let reply = "Main aapki baat samajh gaya, lekin abhi basic response de raha hoon.";

  if (message.toLowerCase().includes("module") || message.toLowerCase().includes("open")) {
    reply = "✅ Aap module kholne ke liye `EHB Dashboard` ka card click karen ya mujhe module ka naam batayein.";
  } else if (message.toLowerCase().includes("status")) {
    reply = "📊 System active hai. Sab module functional hain.";
  }

  res.json({ reply });
};
