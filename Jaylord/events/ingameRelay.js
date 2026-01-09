const { onChildAdded, getData } = require("../../database");

module.exports.config = {
  name: "ingamechat",
  eventType: ["__BOOT__"]
};

module.exports.run = async function () {
  console.log("🎧 IngameChat listener mounted");

  let lastKey = null;

  onChildAdded("chat", async (key, data) => {
    if (!data || !data.message) return;

    // 🧱 Block echo from Facebook
    if (data.source === "facebook") return;

    if (key === lastKey) return;
    lastKey = key;

    console.log("📩 New game chat:", data.message);

    const subs = await getData("ingamechat") || {};

    for (const threadID in subs) {
      if (!subs[threadID]) continue;

      try {
        await global.api.sendMessage(
          `🎮 ${data.sender || "Player"}: ${data.message}`,
          threadID
        );
      } catch (e) {
        console.log("⚠️ Message blocked by Facebook");
      }
    }
  });
};
