module.exports = async function ({ api, event }) {
  const config = global.config;
  const client = global.client;

  if (!event || event.type !== "message" || !event.body) return;

  const prefix = config.PREFIX || "/";
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

  // ===== LIVE CONFIG RELOAD =====
  delete require.cache[require.resolve(client.configPath)];
  global.config = require(client.configPath);

  const senderID = String(event.senderID);
  const ADMINBOT = (global.config.ADMINBOT || []).map(String);

  // ===== PERMISSION SYSTEM =====
  let permssion = ADMINBOT.includes(senderID) ? 2 : 0;

  if (command.config.hasPermssion > permssion) {
    return api.sendMessage(
      `⛔ You don't have permission to use "${commandName}"`,
      event.threadID,
      event.messageID
    );
  }

  // ===== SMART AUTO USAGE SYSTEM (FIXED) =====
  if (command.config.usages) {
    const needArgs = command.config.usages.includes("[");
    if (needArgs && args.length === 0) {
      return api.sendMessage(
        `📌 Usage:\n${prefix}${commandName} ${command.config.usages}`,
        event.threadID,
        event.messageID
      );
    }
  }

  // ===== COOLDOWN SYSTEM =====
  const now = Date.now();
  const cd = command.config.cooldowns || 0;

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
    console.error(`❌ Command error [${commandName}]`, e);
    api.sendMessage("⚠️ May error sa command.", event.threadID);
  }
};
