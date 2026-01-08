const { setData } = require("../../database");

module.exports.config = {
  name: "welcomemessage",
  version: "1.2",
  credits: "Jaylord La Peña",
  description: "Toggle welcome message per group (Admin only)",
  usage: "/welcomemessage on | off"
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  // 🛡 BOT ADMIN CHECK
  const admins = global.config.adminUIDs || [];
  if (!admins.includes(senderID)) {
    return api.sendMessage(
      "⛔ This command is restricted to bot administrators only.",
      threadID
    );
  }

  if (!args[0] || !["on", "off"].includes(args[0])) {
    return api.sendMessage(
      "Usage:\n/welcomemessage on\n/welcomemessage off",
      threadID
    );
  }

  const status = args[0] === "on";

  await setData(`welcomeMessage/${threadID}`, status);

  api.sendMessage(
    `🎉 Welcome message is now **${status ? "ENABLED" : "DISABLED"}** in this group.`,
    threadID
  );
};
