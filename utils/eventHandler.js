module.exports = async function ({ api, event }) {
  const events = global.client.events.get(event.type);
  if (!events) return;

  for (const ev of events) {
    try {
      await ev.run({ api, event });
    } catch (e) {
      console.error(`❌ Event error [${ev.config.name}]:`, e);
    }
  }
};
