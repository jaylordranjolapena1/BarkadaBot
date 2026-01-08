module.exports = async function ({ api, event }) {
  const handlers = global.client.events.get(event.type);
  if (!handlers) return;

  for (const ev of handlers) {
    try {
      await ev.run({ api, event });
    } catch (e) {
      console.error("❌ Event error:", e);
    }
  }
};
