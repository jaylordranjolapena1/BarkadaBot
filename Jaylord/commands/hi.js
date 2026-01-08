module.exports = {
  name: "hi",
  execute({ api, event, config }) {
    api.sendMessage(`Hello! ${config.botName} here 👋`, event.threadID);
  }
};
