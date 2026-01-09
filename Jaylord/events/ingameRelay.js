const { onChildAdded, getData } = require("../../database");

module.exports.config = {
  name: "ingamechat",
  eventType: ["__BOOT__"]
};

module.exports.run = async function () {
  console.log("🎧 IngameChat + Status listener mounted");

  let lastChatKey = "";
  let lastPlayers = null;

  // Delay start to allow DB connection
  setTimeout(() => {

    // ========== CHAT RELAY ==========
    onChildAdded("chat", async (key, data) => {
      try {
        if (!data || !data.message) return;
        if (key === lastChatKey) return;
        lastChatKey = key;

        if (data.source === "facebook") return;

        const subs = await getData("ingamechat") || {};
        for (const threadID in subs) {
          if (!subs[threadID]) continue;
          await global.api.sendMessage(
            `🎮 ${data.sender || "Player"}: ${data.message}`,
            threadID
          );
        }
      } catch (e) {
        console.log("CHAT RELAY ERROR:", e.message);
      }
    });

    // ========== STATUS MONITOR ==========
    onChildAdded("status", async (key, value) => {
      try {
        if (key !== "players") return;

        const players = Number(value);
        if (isNaN(players)) return;
        if (players === lastPlayers) return;
        lastPlayers = players;

        const status = await getData("status");
        if (!status) return;

        const msg =
`🧾 SERVER STATUS
━━━━━━━━━━━━━━━
👥 Players: ${status.players}/${status.max}
⚙️ TPS: ${status.tps} / 20
🔥 CPU: ${status.cpu}% / 400
🧠 RAM: ${status.usedRam}/${status.maxRam} MB
🌋 Nether: ${status.nether ? "ON" : "OFF"}
🟢 Online: ${status.online ? "YES" : "NO"}
🕒 Updated: ${new Date(status.time).toLocaleTimeString()}`;

        const subs = await getData("ingamechat") || {};
        for (const threadID in subs) {
          if (!subs[threadID]) continue;
          await global.api.sendMessage(msg, threadID);
        }
      } catch (e) {
        console.log("STATUS ERROR:", e.message);
      }
    });

  }, 4000); // <— VERY IMPORTANT
};
