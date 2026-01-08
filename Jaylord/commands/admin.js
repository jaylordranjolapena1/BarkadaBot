const fs = require("fs-extra");

module.exports.config = {
  name: "admin",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Priyansh Rajput, ChatGPT + BarkadaFix",
  description: "Manage bot admins",
  commandCategory: "Admin",
  usages: "[list/add/remove] [userID]",
  cooldowns: 5
};

module.exports.messages = {
  listAdmin: "[Admin] Current bot admins:\n\n%1",
  notHavePermission: "[Admin] You don’t have permission to use \"%1\"",
  addedNewAdmin: "[Admin] Added %1 user(s) as bot admin:\n\n%2",
  removedAdmin: "[Admin] Removed %1 bot admin(s):\n\n%2"
};

module.exports.run = async function ({ api, event, args, Users, permssion }) {
  const { threadID, messageID, mentions } = event;
  const { configPath } = global.client;
  const { writeFileSync } = fs;

  // 🔁 Always reload config from disk
  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  if (!Array.isArray(config.adminUIDs)) config.adminUIDs = [];

  const ADMINBOT = config.adminUIDs.map(String);
  const mentionIDs = Object.keys(mentions || {});
  const content = args.slice(1);

  switch (args[0]) {

    // ================= LIST =================
    case "list": {
      if (!ADMINBOT.length)
        return api.sendMessage("[Admin] No admins configured.", threadID, messageID);

      let msg = [];

      for (const id of ADMINBOT) {
        const name = await Users.getNameUser(id);
        msg.push(`- ${name} (https://facebook.com/${id})`);
      }

      return api.sendMessage(
        this.messages.listAdmin.replace("%1", msg.join("\n")),
        threadID,
        messageID
      );
    }

    // ================= ADD =================
    case "add": {
      if (permssion !== 2)
        return api.sendMessage(
          this.messages.notHavePermission.replace("%1", "add"),
          threadID,
          messageID
        );

      let listAdd = [];

      const targets = mentionIDs.length ? mentionIDs : content;

      if (!targets.length) {
        return api.sendMessage(`Usage: /admin add [mention|userID]`, threadID, messageID);
      }

      for (const id of targets) {
        if (!ADMINBOT.includes(id)) {
          ADMINBOT.push(id);
          const name = await Users.getNameUser(id);
          listAdd.push(`[${id}] » ${name}`);
        }
      }

      config.ADMINBOT = ADMINBOT;
      writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");

      return api.sendMessage(
        this.messages.addedNewAdmin
          .replace("%1", listAdd.length)
          .replace("%2", listAdd.join("\n") || "No new admins added."),
        threadID,
        messageID
      );
    }

    // ================= REMOVE =================
    case "remove": {
      if (permssion !== 2)
        return api.sendMessage(
          this.messages.notHavePermission.replace("%1", "remove"),
          threadID,
          messageID
        );

      let listRemoved = [];
      const targets = mentionIDs.length ? mentionIDs : content;

      if (!targets.length) {
        return api.sendMessage(`Usage: /admin remove [mention|userID]`, threadID, messageID);
      }

      for (const id of targets) {
        const index = ADMINBOT.indexOf(id);
        if (index !== -1) {
          ADMINBOT.splice(index, 1);
          const name = await Users.getNameUser(id);
          listRemoved.push(`[${id}] » ${name}`);
        }
      }

      config.ADMINBOT = ADMINBOT;
      writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");

      return api.sendMessage(
        this.messages.removedAdmin
          .replace("%1", listRemoved.length)
          .replace("%2", listRemoved.join("\n") || "No admins removed."),
        threadID,
        messageID
      );
    }

    default:
      return api.sendMessage(
        `Usage:\n/admin ${this.config.usages}`,
        threadID,
        messageID
      );
  }
};
