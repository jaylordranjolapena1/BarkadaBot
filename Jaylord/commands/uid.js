module.exports = {
  config: {
    name: "uid",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "BarkadaBot",
    description: "Get user Facebook ID",
    commandCategory: "Utility",
    usages: "[mention/reply/userID]",
    cooldowns: 2
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    let targetID = senderID;

    // 1️⃣ Reply — pinaka reliable
    if (event.messageReply && event.messageReply.senderID) {
      targetID = event.messageReply.senderID;
    }

    // 2️⃣ Mention — with fallback detection
    else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    }

    // 3️⃣ Manual ID
    else if (args[0] && !isNaN(args[0])) {
      targetID = args[0];
    }

    return api.sendMessage(
      `🆔 User ID:\n${targetID}`,
      threadID,
      messageID
    );
  }
};
