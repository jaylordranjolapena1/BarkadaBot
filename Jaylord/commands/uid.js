module.exports = {
  config: {
    name: "uid",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "BarkadaBot",
    description: "Get Facebook UID",
    commandCategory: "Utility",
    usages: "[mention/reply/userID]",
    cooldowns: 2
  },

  run: async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;

    let targetID = senderID;

    // 1️⃣ Reply = strongest signal
    if (messageReply?.senderID) {
      targetID = messageReply.senderID;
    }

    // 2️⃣ Raw mention extraction from message text
    else {
      // Messenger format: @Name (1000xxxxxxxxx)
      const regex = /\((\d{6,})\)/g;
      const matches = [...body.matchAll(regex)];

      if (matches.length > 0) {
        targetID = matches[0][1];
      }
    }

    return api.sendMessage(
      `🆔 User ID:\n${targetID}`,
      threadID,
      messageID
    );
  }
};
