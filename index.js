const express = require("express");
const app = express();
const login = require("fca-smart-shankar");
const fs = require("fs-extra");
const path = require("path");

// ================= GLOBAL NODEMODULE =================
global.nodemodule = {};
const listPackage = JSON.parse(fs.readFileSync("./package.json")).dependencies || {};
for (const name in listPackage) {
  try {
    global.nodemodule[name] = require(name);
  } catch {}
}

// ================= LOAD CONFIG =================
const configPath = path.join(__dirname, "config.json");
global.config = require(configPath);
const appState = require("./appstate.json");

// ================= GLOBAL CLIENT =================
global.client = {
  commands: new Map(),
  events: new Map(),
  configPath
};

// ================= WEB SERVER =================
app.get("/", (req, res) => res.send("Barkada Bot is running"));
app.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Web server ready");
});

// ================= UTILS =================
global.utils = {
  throwError(cmd, threadID, messageID) {
    return global.api.sendMessage(
      `⚠️ Usage error: ${global.config.PREFIX}${cmd}`,
      threadID,
      messageID
    );
  }
};

// ================= USERS SYSTEM =================
global.Users = require("./utils/Users");

// ================= LOAD COMMANDS =================
const cmdPath = path.join(__dirname, "Jaylord/commands");
for (const file of fs.readdirSync(cmdPath)) {
  try {
    const cmd = require(path.join(cmdPath, file));
    if (!cmd.config?.name || !cmd.run) continue;

    global.client.commands.set(cmd.config.name, cmd);
    console.log(`✅ Command loaded: ${cmd.config.name}`);
  } catch (e) {
    console.log(`❌ Command error: ${file}`, e.message);
  }
}

// ================= LOAD EVENTS =================
const evPath = path.join(__dirname, "Jaylord/events");
for (const file of fs.readdirSync(evPath)) {
  try {
    const ev = require(path.join(evPath, file));
    if (!ev.config?.eventType || !ev.run) continue;

    for (const type of ev.config.eventType) {
      if (!global.client.events.has(type)) global.client.events.set(type, []);
      global.client.events.get(type).push(ev);
    }

    console.log(`🎯 Event loaded: ${ev.config.name}`);
  } catch (e) {
    console.log(`❌ Event error: ${file}`, e.message);
  }
}

// ================= HANDLERS =================
const commandHandler = require("./utils/commandHandler");
const eventHandler = require("./utils/eventHandler");

// ================= LOGIN =================
login({ appState }, (err, api) => {
  if (err) return console.error(err);
  global.api = api;

  // 🔥 THIS LINE IS THE MISSING KEY
  api.setOptions({
    listenEvents: true,
    updatePresence: true,
    selfListen: false
  });

  console.log(`🤖 ${global.config.BOTNAME} is online`);

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);

    console.log("📥 EVENT:", event.type); // Debug

    try {
      await eventHandler({ api, event });
      await commandHandler({ api, event, Users: global.Users });
    } catch (e) {
      console.error("Handler error:", e);
    }
  });
});
