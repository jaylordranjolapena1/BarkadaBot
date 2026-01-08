module.exports = {
  config: {
    name: "uid",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "BarkadaBot",
    description: "Get Facebook UID",
    commandCategory: "Utility",
    usages: "[mention/reply/userID]",
    cooldowns: 2
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID, body, senderID } = event;

    let targetID = senderID;

    // 1️⃣ Reply (most accurate)
    if (event.messageReply?.senderID) {
      targetID = event.messageReply.senderID;
    }

    // 2️⃣ Real mention parsing from message body
    else {
      const match = body.match(/@.+?\((\d+)\)/);
      if (match && match[1]) {
        targetID = match[1];
      }

      // 3️⃣ Manual ID
      else if (args[0] && /^\d+$/.test(args[0])) {
        targetID = args[0];
      }
    }

    return api.sendMessage(
      `🆔 User ID:\n${targetID}`,
      threadID,
      messageID
    );
  }
};
