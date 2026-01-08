module.exports = async function ({ api, event }) {
  for (const ev of global.client.events.values()) {
    if (ev.config.eventType?.includes(event.type)) {
      try {
        await ev.run({ api, event });
      } catch (e) {
        console.error("Event error:", e);
      }
    }
  }
};
