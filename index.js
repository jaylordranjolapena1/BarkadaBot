const login = require("fca-smart-shankar");
const fs = require("fs");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("🤖 Barkada Bot is running.");
});

app.listen(PORT, () => {
  console.log("Web server running on port " + PORT);
});

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState }, (err, api) => {
  if (err) {
    console.error("LOGIN FAILED:", err);
    return;
  }

  api.setOptions({
    listenEvents: true,
    selfListen: false,
    updatePresence: false,
    forceLogin: true
  });

  console.log("🤖 Barkada Bot Fully Online!");

  api.listenMqtt((err, event) => {
    if (err) return console.error(err);

    if (event.type === "message") {
      const msg = event.body?.toLowerCase();

      if (msg === "hi") {
        api.sendMessage("Hello! Barkada Bot here 👋", event.threadID);
      }

      if (msg === "ping") {
        api.sendMessage("Pong! 🏓", event.threadID);
      }

      if (msg === "help") {
        api.sendMessage(
          "Commands:\nhi\nping\nhelp",
          event.threadID
        );
      }
    }
  });
});
