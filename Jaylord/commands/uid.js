module.exports.config = {
  name: "uid",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Show Facebook user ID",
  commandCategory: "Utility",
  usages: "[mention/reply/userID]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;

  let targetID = senderID;

  // If user mentioned someone
  if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }
  // If replying to someone
  else if (messageReply && messageReply.senderID) {
    targetID = messageReply.senderID;
  }
  // If user typed an ID
  else if (args[0] && !isNaN(args[0])) {
    targetID = args[0];
  }

  return api.sendMessage(
    `🆔 User ID:\n${targetID}`,
    threadID,
    messageID
  );
};
