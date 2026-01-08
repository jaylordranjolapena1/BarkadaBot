const { getData, setData } = require("../../database");

module.exports.config = {
  name: "ingamechat",
  version: "1.1",
  credits: "Barkada + ChatGPT",
  description: "Toggle in-game chat relay (Admin only)"
};

module.exports.run = async ({ api, event }) => {
  const { threadID, body, senderID } = event;

  // 🛡 BOT ADMIN CHECK
  const admins = global.config.adminUIDs || [];
  if (!admins.includes(senderID)) {
    return api.sendMessage(
      "⛔ This command is restricted to bot administrators only.",
      threadID
    );
  }

  const args = body.trim().split(/\s+/).slice(1);

  if (!args[0]) {
    return api.sendMessage("Usage: /ingamechat on | off", threadID);
  }

  const path = `ingamechat/${threadID}`;

  if (args[0].toLowerCase() === "on") {
    await setData(path, true);
    return api.sendMessage("🟢 In-game chat relay enabled.", threadID);
  }

  if (args[0].toLowerCase() === "off") {
    await setData(path, false);
    return api.sendMessage("🔴 In-game chat relay disabled.", threadID);
  }

  return api.sendMessage("Usage: /ingamechat on | off", threadID);
};
