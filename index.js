const login = require("fca-smart-shankar");
const fs = require("fs");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("🤖 Barkada Bot is alive.");
});

app.listen(PORT, () => {
  console.log("Web server running on port " + PORT);
});

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState }, (err, api) => {
  if (err) return console.error("LOGIN FAILED:", err);

  api.setOptions({
    listenEvents: true,
    selfListen: false,
    updatePresence: false,
    forceLogin: true
  });

  console.log("🤖 Barkada Bot Fully Online!");

  api.listenMqtt((err, event) => {
    if (err) return console.error("Listener error:", err);

    if (!event || !event.body || event.type !== "message") return;

    const message = event.body.trim().toLowerCase();

    console.log("📩 Message:", message);

    if (message === "hi") {
      api.sendMessage("Hello! Barkada Bot here 👋", event.threadID);
    }

    if (message === "ping") {
      api.sendMessage("Pong! 🏓", event.threadID);
    }

    if (message === "help") {
      api.sendMessage("Commands: hi, ping, help", event.threadID);
    }
  });
});
