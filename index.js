const express = require("express");
const app = express();
const login = require("fca-smart-shankar");
const fs = require("fs-extra");
const path = require("path");

// ===== Load Config =====
const configPath = path.join(__dirname, "config.json");
let config = require(configPath);
const appState = require("./appstate.json");

global.config = config;
global.client = {
  commands: new Map(),
  events: new Map(),
  configPath
};

// ===== Render Port Fix =====
app.get("/", (req, res) => res.send("Barkada Bot is running"));
app.listen(process.env.PORT || 3000);

// ===== Load Commands =====
const cmdPath = path.join(__dirname, "Jaylord/commands");
fs.readdirSync(cmdPath).forEach(file => {
  const cmd = require(path.join(cmdPath, file));
  global.client.commands.set(cmd.config.name, cmd);
});

// ===== Load Events =====
const evPath = path.join(__dirname, "Jaylord/events");
fs.readdirSync(evPath).forEach(file => {
  const ev = require(path.join(evPath, file));
  global.client.events.set(ev.config.name, ev);
});

// ===== Utils =====
global.utils = {
  throwError(cmd, threadID, messageID) {
    return global.api.sendMessage(
      `⚠️ Usage error: ${config.prefix}${cmd}`,
      threadID,
      messageID
    );
  }
};

// ===== Login =====
login({ appState }, (err, api) => {
  if (err) return console.error(err);
  global.api = api;

  console.log(`🤖 ${config.BOTNAME} is online`);

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);

    // ===== EVENT HANDLER =====
    for (const ev of global.client.events.values()) {
      if (ev.config.eventType?.includes(event.type)) {
        ev.run({ api, event });
      }
    }

    if (event.type !== "message" || !event.body) return;

    if (!event.body.startsWith(config.PREFIX)) return;

    const args = event.body.slice(config.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const cmd = global.client.commands.get(commandName);
    if (!cmd) return;

    const senderID = event.senderID;
    const ADMINBOT = config.ADMINBOT || [];
    let permssion = ADMINBOT.includes(senderID) ? 2 : 0;

    await cmd.run({ api, event, args, permssion });
  });
});
