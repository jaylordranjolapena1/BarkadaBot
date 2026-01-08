const { getData, setData } = require("../../database");

module.exports.config = {
  name: "ingamechat",
  version: "1.0",
  credits: "Barkada",
  description: "Toggle in-game chat relay"
};

module.exports.run = async ({ api, event }) => {
  const { threadID, body } = event;

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
