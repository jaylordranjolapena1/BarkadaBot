module.exports = async function ({ api, event }) {
  const config = global.config;
  const client = global.client;

  if (event.type !== "message" || !event.body) return;

  const prefix = config.PREFIX;
  if (!event.body.startsWith(prefix)) return;

  const args = event.body.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  // Reload config live
  delete require.cache[require.resolve(client.configPath)];
  global.config = require(client.configPath);

  const senderID = event.senderID;
  const ADMINBOT = global.config.ADMINBOT || [];
  let permssion = ADMINBOT.includes(senderID) ? 2 : 0;

  // Cooldown
  const now = Date.now();
  const cd = command.config.cooldowns || 0;
  if (!global.cooldowns) global.cooldowns = new Map();

  if (cd > 0) {
    const timestamps = global.cooldowns.get(commandName) || new Map();
    const expire = timestamps.get(senderID) || 0;

    if (now < expire) {
      const left = Math.ceil((expire - now) / 1000);
      return api.sendMessage(`⏳ Cooldown: ${left}s`, event.threadID);
    }

    timestamps.set(senderID, now + cd * 1000);
    global.cooldowns.set(commandName, timestamps);
  }

  try {
    await command.run({ api, event, args, permssion });
  } catch (e) {
    console.error(`❌ Command error [${commandName}]`, e);
  }
};

