module.exports.config = {
  name: "uid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Get Facebook user ID",
  commandCategory: "Utility",
  usages: "/uid [mention/reply/userID]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;

  let targetID;

  // If mention
  if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }
  // If reply
  else if (messageReply) {
    targetID = messageReply.senderID;
  }
  // If argument is ID
  else if (args[0] && !isNaN(args[0])) {
    targetID = args[0];
  }
  // Default to sender
  else {
    targetID = senderID;
  }

  return api.sendMessage(
    `🆔 User ID:\n${targetID}`,
    threadID,
    messageID
  );
};
