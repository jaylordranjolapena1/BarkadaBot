module.exports = async function ({ api, event }) {
  try {
    const client = global.client;

    if (!event || event.type !== "message" || !event.body) return;

    // ===== LOAD CONFIG SAFELY =====
    let config;
    try {
      delete require.cache[require.resolve(client.configPath)];
      config = require(client.configPath);
    } catch (e) {
      console.error("❌ CONFIG LOAD ERROR:", e);
      return;
    }

    const prefix = config.prefix || "/";
    if (!event.body.startsWith(prefix)) return;

    const args = event.body.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    // ===== UNKNOWN COMMAND =====
    if (!command) {
      return api.sendMessage(
        `❓ Unknown command: ${prefix}${commandName}`,
        event.threadID,
        event.messageID
      );
    }

    // ===== PERMISSION SYSTEM =====
    const senderID = String(event.senderID);

    if (!Array.isArray(config.adminUIDs)) config.adminUIDs = [];
    const ADMINBOT = config.adminUIDs.map(String);

    let permssion = ADMINBOT.includes(senderID) ? 2 : 0;

    const needPermission = Number(command.config.hasPermssion || 0);
    if (needPermission > permssion) {
      return api.sendMessage(
        `⛔ You don't have permission to use "${commandName}"`,
        event.threadID,
        event.messageID
      );
    }

    // ===== AUTO USAGE CHECK =====
    if (
      command.config.usages &&
      args.length === 0 &&
      command.config.usages.includes("[")
    ) {
      return api.sendMessage(
        `📌 Usage:\n${prefix}${commandName} ${command.config.usages}`,
        event.threadID,
        event.messageID
      );
    }

    // ===== COOLDOWN SYSTEM =====
    const now = Date.now();
    const cd = Number(command.config.cooldowns || 0);

    if (!global.cooldowns) global.cooldowns = new Map();
    if (!global.cooldowns.has(commandName)) {
      global.cooldowns.set(commandName, new Map());
    }

    if (cd > 0) {
      const timestamps = global.cooldowns.get(commandName);
      const expire = timestamps.get(senderID) || 0;

      if (now < expire) {
        const left = Math.ceil((expire - now) / 1000);
        return api.sendMessage(
          `⏳ Cooldown: ${left}s`,
          event.threadID,
          event.messageID
        );
      }

      timestamps.set(senderID, now + cd * 1000);
    }

    // ===== EXECUTE COMMAND =====
    try {
      await command.run({ api, event, args, permssion, Users: global.Users });
    } catch (e) {
      console.error(`❌ Command runtime error [${commandName}]`, e);

      const usage = command.config?.usages;

      if (usage) {
        return api.sendMessage(
          `❌ Error while executing command.\n\n📌 Usage:\n${prefix}${commandName} ${usage}`,
          event.threadID,
          event.messageID
        );
      }

      return api.sendMessage(
        "⚠️ May error sa command.",
        event.threadID,
        event.messageID
      );
    }

  } catch (fatal) {
    // LAST LINE OF DEFENSE — bot will never crash here
    console.error("💥 COMMAND HANDLER FATAL ERROR:", fatal);
  }
};
