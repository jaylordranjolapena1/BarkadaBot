const { onChildAdded, onValue, getData } = require("../../database");

module.exports.config = {
  name: "ingamechat",
  eventType: ["__BOOT__"]
};

module.exports.run = async function () {
  console.log("🎧 IngameChat + Status listener mounted");

  let lastChatKey = null;
  let lastPlayers = null;

  // ================= CHAT RELAY =================
  onChildAdded("chat", async (key, data) => {
    if (!data || !data.message) return;

    if (key === lastChatKey) return;
    lastChatKey = key;

    // 🚫 Ignore Facebook to prevent echo
    if (data.source === "facebook") return;

    const subs = await getData("ingamechat") || {};

    for (const threadID in subs) {
      if (!subs[threadID]) continue;

      await global.api.sendMessage(
        `🎮 ${data.sender || "Player"}: ${data.message}`,
        threadID
      );
    }
  });

  // ================= STATUS MONITOR =================
  onValue("status/players", async (players) => {
    players = Number(players);
    if (isNaN(players)) return;

    if (players === lastPlayers) return;
    lastPlayers = players;

    const status = await getData("status");
    if (!status) return;

    const msg =
`🧾 SERVER STATUS
━━━━━━━━━━━━━━━
👥 Players: ${status.players}/${status.max}
⚙️ TPS: ${status.tps}
🔥 CPU: ${status.cpu}%
🧠 RAM: ${status.usedRam}/${status.maxRam} MB
🌋 Nether: ${status.nether ? "ON" : "OFF"}
🟢 Online: ${status.online ? "YES" : "NO"}
🕒 Updated: ${new Date(status.time).toLocaleTimeString()}`;

    const subs = await getData("ingamechat") || {};

    for (const threadID in subs) {
      if (!subs[threadID]) continue;
      await global.api.sendMessage(msg, threadID);
    }
  });
};
