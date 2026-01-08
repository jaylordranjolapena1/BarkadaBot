const express = require("express");
const app = express();
const login = require("fca-smart-shankar");
const fs = require("fs");
const path = require("path");

const config = JSON.parse(fs.readFileSync("config.json"));
const appState = JSON.parse(fs.readFileSync("appstate.json"));

const commands = new Map();
const events = [];

app.get("/", (req, res) => res.send("Barkada Bot is running"));
app.listen(process.env.PORT || 3000);

function loadCommands() {
  const cmdPath = "./Jaylord/commands";
  fs.readdirSync(cmdPath).forEach(file => {
    const cmd = require(path.join(__dirname, cmdPath, file));
    commands.set(cmd.name, cmd);
  });
}

function loadEvents() {
  const eventPath = "./Jaylord/events";
  fs.readdirSync(eventPath).forEach(file => {
    events.push(require(path.join(__dirname, eventPath, file)));
  });
}

loadCommands();
loadEvents();

login({ appState }, (err, api) => {
  if (err) return console.error(err);

  console.log(`${config.botName} is online!`);

  api.listenMqtt((err, event) => {
    if (err) return console.error(err);

    if (event.type !== "message" || !event.body) return;

    for (const ev of events) ev({ api, event, config });

    if (!event.body.startsWith(config.prefix)) return;

    const args = event.body.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();
    const cmd = commands.get(cmdName);
    if (cmd) cmd.execute({ api, event, args, config });
  });
});
