const express = require("express");
const app = express();
const login = require("fca-smart-shankar");
const fs = require("fs-extra");
const path = require("path");

// ===== Load Config =====
const configPath = path.join(__dirname, "config.json");
global.config = require(configPath);
const appState = require("./appstate.json");

// ===== Global Client =====
global.client = {
  commands: new Map(),
  events: new Map(),
  configPath
};

// ===== Web Server (Render Fix) =====
app.get("/", (req, res) => res.send("Barkada Bot is running"));
app.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Web server ready");
});

// ===== Utils =====
global.utils = {
  throwError(cmd, threadID, messageID) {
    return global.api.sendMessage(
      `⚠️ Usage error: ${global.config.PREFIX}${cmd}`,
      threadID,
      messageID
    );
  }
};

// ===== Load Commands (Protected) =====
const cmdPath = path.join(__dirname, "Jaylord/commands");
fs.readdirSync(cmdPath).forEach(file => {
  try {
    const cmd = require(path.join(cmdPath, file));
    if (!cmd.config || !cmd.config.name || !cmd.run) return;
    global.client.commands.set(cmd.config.name, cmd);
    console.log(`✅ Command loaded: ${cmd.config.name}`);
  } catch (err) {
    console.log(`❌ Command error: ${file}`, err.message);
  }
});

// ===== Load Events (Protected) =====
const evPath = path.join(__dirname, "Jaylord/events");
fs.readdirSync(evPath).forEach(file => {
  try {
    const ev = require(path.join(evPath, file));
    if (!ev.config || !ev.config.name || !ev.run) return;
    global.client.events.set(ev.config.name, ev);
    console.log(`🎯 Event loaded: ${ev.config.name}`);
  } catch (err) {
    console.log(`❌ Event error: ${file}`, err.message);
  }
});

// ===== Handlers =====
const commandHandler = require("./utils/commandHandler");
const eventHandler = require("./utils/eventHandler");

// ===== Login =====
login({ appState }, (err, api) => {
  if (err) return console.error(err);
  global.api = api;

  console.log(`🤖 ${global.config.BOTNAME} is online`);

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);

    await eventHandler({ api, event });
    await commandHandler({ api, event });
  });
});
