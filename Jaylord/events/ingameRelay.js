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

    if (key === lastKey) return;
    lastKey = key;

    console.log("📩 New chat:", data.message);

    const subs = await getData("ingamechat") || {};

    for (const threadID in subs) {
      if (!subs[threadID]) continue;

      global.api.sendMessage(`🎮 ${data.sender || "Player"}: ${data.message}`, threadID);
    }
  });
};
