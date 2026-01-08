module.exports = async function ({ api, event }) {
  for (const ev of global.client.events.values()) {
    if (!ev.config.eventType.includes(event.logMessageType || event.type)) continue;

    try {
      await ev.run({ api, event });
    } catch (err) {
      console.error(`❌ Event error [${ev.config.name}]:`, err);
    }
  }
};
