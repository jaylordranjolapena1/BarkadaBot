const { onChildAdded, getData } = require("../database");

let lastKey = null;

module.exports = async function () {
  console.log("🎧 IngameChat listener active");

  onChildAdded("chat", async (key, data) => {
    if (!data || !data.message) return;

    if (key === lastKey) return;
    lastKey = key;

    console.log("📩 New chat:", data.message);

    const subs = await getData("ingamechat") || {};

    for (const threadID in subs) {
      if (!subs[threadID]) continue;

      const msg = `🎮 ${data.sender || "Player"}: ${data.message}`;
      global.api.sendMessage(msg, threadID);
    }
  });
};
