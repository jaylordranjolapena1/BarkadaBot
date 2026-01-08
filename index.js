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

// ===== Web Server =====
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

// ===== Users System =====
global.Users = require("./utils/Users");

// ===== Load Commands =====
const cmdPath = path.join(__dirname, "Jaylord/commands");
for (const file of fs.readdirSync(cmdPath)) {
  try {
    const cmd = require(path.join(cmdPath, file));
    if (!cmd.config || !cmd.config.name || !cmd.run) continue;

    global.client.commands.set(cmd.config.name, cmd);
    console.log(`✅ Command loaded: ${cmd.config.name}`);
  } catch (e) {
    console.log(`❌ Command error: ${file}`, e.message);
  }
}

// ===== Load Events (FIXED) =====
const evPath = path.join(__dirname, "Jaylord/events");

for (const file of fs.readdirSync(evPath)) {
  try {
    const ev = require(path.join(evPath, file));
    if (!ev.config?.eventType || !ev.run) continue;

    for (const type of ev.config.eventType) {
      if (!global.client.events.has(type)) {
        global.client.events.set(type, []);
      }
      global.client.events.get(type).push(ev);
    }

    console.log(`🎯 Event loaded: ${ev.config.name}`);
  } catch (e) {
    console.log(`❌ Event error: ${file}`, e.message);
  }
}

// ===== Handlers =====
const commandHandler = require("./utils/commandHandler");
const eventHandler = require("./utils/eventHandler");

// ===== Login =====
login({ appState }, (err, api) => {
  if (err) return console.error(err);
  global.api = api;

  console.log(`🤖 ${global.config.botName} is online`);

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);

    try {
      await eventHandler({ api, event });
      await commandHandler({ api, event, Users: global.Users });
    } catch (e) {
      console.error("Handler error:", e);
    }
  });
});
