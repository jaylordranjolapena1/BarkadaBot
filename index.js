const login = require("fca-unofficial");
const fs = require("fs");

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState }, (err, api) => {
  if (err) return console.error(err);

  console.log("🤖 Barkada Bot is Online!");

  api.listenMqtt((err, event) => {
    if (err) return console.error(err);

    if (event.type === "message") {
      const msg = event.body.toLowerCase();

      if (msg === "hi") {
        api.sendMessage("Hello! Barkada Bot here 👋", event.threadID);
      }

      if (msg === "ping") {
        api.sendMessage("Pong! 🏓", event.threadID);
      }
    }
  });
});
