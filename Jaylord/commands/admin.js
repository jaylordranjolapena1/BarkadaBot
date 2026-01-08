const fs = require("fs-extra");

module.exports.config = {
  name: "admin",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Priyansh Rajput, ChatGPT + BarkadaFix",
  description: "Manage bot admins",
  commandCategory: "Admin",
  usages: "[list | add <uid/@mention> | remove <uid/@mention>]",
  cooldowns: 5
};

module.exports.messages = {
  listAdmin: "[Admin] Current bot admins:\n\n%1",
  notHavePermission: "[Admin] You don't have permission to use \"%1\"",
  addedNewAdmin: "[Admin] Added %1 admin(s):\n\n%2",
  removedAdmin: "[Admin] Removed %1 admin(s):\n\n%2"
};

module.exports.run = async function ({ api, event, args, Users, permssion }) {
  const { threadID, messageID, mentions } = event;
  const { configPath } = global.client;

  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  if (!Array.isArray(config.adminUIDs)) config.adminUIDs = [];

  const ADMINBOT = config.adminUIDs.map(String);
  const targets = Object.keys(mentions || {}).length
    ? Object.keys(mentions)
    : args.slice(1);

  switch (args[0]) {

    case "list": {
      if (!ADMINBOT.length)
        return api.sendMessage("[Admin] No admins configured.", threadID, messageID);

      const msg = await Promise.all(
        ADMINBOT.map(async id => {
          const name = await Users.getNameUser(id);
          return `- ${name} (https://facebook.com/${id})`;
        })
      );

      return api.sendMessage(
        this.messages.listAdmin.replace("%1", msg.join("\n")),
        threadID,
        messageID
      );
    }

    case "add": {
      if (permssion !== 2)
        return api.sendMessage(this.messages.notHavePermission.replace("%1", "add"), threadID, messageID);

      if (!targets.length)
        return api.sendMessage("Usage: /admin add <uid | @mention>", threadID, messageID);

      let added = [];

      for (const id of targets) {
        if (!ADMINBOT.includes(id)) {
          ADMINBOT.push(id);
          const name = await Users.getNameUser(id);
          added.push(`[${id}] » ${name}`);
        }
      }

      config.adminUIDs = ADMINBOT;
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));

      return api.sendMessage(
        this.messages.addedNewAdmin
          .replace("%1", added.length)
          .replace("%2", added.join("\n") || "None"),
        threadID,
        messageID
      );
    }

    case "remove": {
      if (permssion !== 2)
        return api.sendMessage(this.messages.notHavePermission.replace("%1", "remove"), threadID, messageID);

      if (!targets.length)
        return api.sendMessage("Usage: /admin remove <uid | @mention>", threadID, messageID);

      let removed = [];

      for (const id of targets) {
        const index = ADMINBOT.indexOf(id);
        if (index !== -1) {
          ADMINBOT.splice(index, 1);
          const name = await Users.getNameUser(id);
          removed.push(`[${id}] » ${name}`);
        }
      }

      config.adminUIDs = ADMINBOT;
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));

      return api.sendMessage(
        this.messages.removedAdmin
          .replace("%1", removed.length)
          .replace("%2", removed.join("\n") || "None"),
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
