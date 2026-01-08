module.exports = {
  config: {
    name: "uid",
    version: "2.1.0",
    hasPermssion: 0,
    credits: "BarkadaBot",
    description: "Get your Facebook UID",
    commandCategory: "Utility",
    usages: "/uid",
    cooldowns: 2
  },

  run: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    return api.sendMessage(
      `🆔 Your Facebook User ID:\n${senderID}`,
      threadID,
      messageID
    );
  }
};
