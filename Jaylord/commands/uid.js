module.exports = {
  config: {
    name: "uid",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "ChatGPT",
    description: "Show Facebook user ID",
    commandCategory: "Utility",
    usages: "[mention/reply/userID]",
    cooldowns: 2
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    let targetID = senderID;

    if (Object.keys(mentions || {}).length > 0) {
      targetID = Object.keys(mentions)[0];
    }
    else if (messageReply?.senderID) {
      targetID = messageReply.senderID;
    }
    else if (args[0] && !isNaN(args[0])) {
      targetID = args[0];
    }

    return api.sendMessage(`🆔 User ID:\n${targetID}`, threadID, messageID);
  }
};
