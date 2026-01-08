module.exports = {
  config: {
    name: "uid",
    version: "1.0.3",
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

    // 1️⃣ If mention
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    }

    // 2️⃣ If reply
    else if (event.messageReply && event.messageReply.senderID) {
      targetID = event.messageReply.senderID;
    }

    // 3️⃣ If user typed ID
    else if (args[0] && !isNaN(args[0])) {
      targetID = args[0];
    }

    // 4️⃣ Default = sender
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
