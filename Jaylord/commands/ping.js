module.exports = {
  name: "ping",
  execute({ api, event }) {
    api.sendMessage("Pong! 🏓", event.threadID);
  }
};
