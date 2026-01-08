module.exports = async function ({ api, event }) {
  const realType = event.type;

  console.log("📥 EVENT:", realType);

  for (const ev of global.client.events.values()) {
    if (!ev.config.eventType.includes(realType)) continue;

    try {
      await ev.run({ api, event });
    } catch (err) {
      console.error(`❌ Event error [${ev.config.name}]:`, err);
    }
  }
};
