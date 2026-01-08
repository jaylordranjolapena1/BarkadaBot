module.exports = {
  config: {
    name: "uid",
    version: "1.1.5",
    hasPermssion: 0,
    credits: "BarkadaBot",
    description: "Get Facebook UID",
    commandCategory: "Utility",
    usages: "[mention/reply/userID]",
    cooldowns: 2
  },

  run: async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;

    let targetID = senderID;

    // 1️⃣ Reply (perfect)
    if (event.messageReply?.senderID) {
      targetID = event.messageReply.senderID;
    }

    // 2️⃣ True mention detection
    else if (event.mentions && Object.keys(event.mentions).length > 0) {
      const mentionKeys = Object.keys(event.mentions)
        .filter(id => id !== senderID); // remove self bug

      if (mentionKeys.length > 0) {
        targetID = mentionKeys[0];
      }
    }

    // 3️⃣ Fallback: extract from text
    else {
      const match = body.match(/\((\d{5,})\)/);
      if (match) targetID = match[1];
    }

    return api.sendMessage(
      `🆔 User ID:\n${targetID}`,
      threadID,
      messageID
    );
  }
};
