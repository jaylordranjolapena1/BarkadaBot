module.exports = async function ({ api, event }) {
  const type = event.logMessageType || event.type;
  const handlers = global.client.events.get(type);
  if (!handlers) return;

  for (const ev of handlers) {
    try {
      await ev.run({ api, event });
    } catch (e) {
      console.error("❌ Event error:", e);
    }
  }
};
