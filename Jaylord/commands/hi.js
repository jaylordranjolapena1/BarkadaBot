module.exports.config = {
  name: "hi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Barkada",
  description: "Simple greeting",
  commandCategory: "General",
  usages: "",
  cooldowns: 5
};

module.exports.run = function({ api, event }) {
  api.sendMessage("Hello! BarkadaBot here 👋", event.threadID);
};
