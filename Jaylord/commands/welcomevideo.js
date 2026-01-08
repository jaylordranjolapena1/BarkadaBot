const { setData, getData } = require("../../database.js");

module.exports.config = {
  name: "welcomevideo",
  version: "1.1.0",
  credits: "ChatGPT + Barkada",
  description: "Enable or disable welcome video (Admin only)",
  usage: "/welcomevideo on | off",
  cooldown: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;

  // 🛡 BOT ADMIN CHECK
  const admins = global.config.adminUIDs || [];
  if (!admins.includes(senderID)) {
    return api.sendMessage(
      "⛔ This command is restricted to bot administrators only.",
      threadID
    );
  }

  if (!args[0]) {
    return api.sendMessage("Usage: /welcomevideo on | off", threadID);
  }

  const option = args[0].toLowerCase();

  if (option === "on") {
    await setData(`welcomeVideo/${threadID}`, { enabled: true });
    return api.sendMessage("✅ Welcome video is now ENABLED for this group.", threadID);
  }

  if (option === "off") {
    await setData(`welcomeVideo/${threadID}`, { enabled: false });
    return api.sendMessage("❌ Welcome video is now DISABLED for this group.", threadID);
  }

  return api.sendMessage("Invalid option. Use: /welcomevideo on | off", threadID);
};
