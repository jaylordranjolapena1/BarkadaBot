module.exports = {
  config: {
    name: "uid",
    version: "1.0.6",
    hasPermssion: 0,
    credits: "BarkadaBot",
    description: "Get user Facebook ID",
    commandCategory: "Utility",
    usages: "[mention/reply/userID]",
    cooldowns: 2
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    let targetID;

    // 1️⃣ If reply — most reliable
    if (event.messageReply && event.messageReply.senderID) {
      targetID = event.messageReply.senderID;
    }

    // 2️⃣ If mention — same logic as your working activist command
    else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    }

    // 3️⃣ If user typed numeric ID
    else if (args[0] && !isNaN(args[0])) {
      targetID = args[0];
    }

    // 4️⃣ Default: sender
    else {
      targetID = event.senderID;
    }

    return api.sendMessage(
      `🆔 User ID:\n${targetID}`,
      threadID,
      messageID
    );
  }
};
