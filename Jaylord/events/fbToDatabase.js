const { pushData, getData } = require("../../database");

console.log("🔥 fbToDatabase LOADED");

module.exports.config = {
  name: "fbToDatabase",
  eventType: ["message"]
};

module.exports.run = async function ({ api, event }) {
  if (!event.body) return;
  if (event.senderID === api.getCurrentUserID()) return;

  const threadID = event.threadID;

  // 🔎 Check if ingame chat is enabled in this GC
  const enabled = await getData(`ingamechat/${threadID}`);
  console.log("📦 IngameChat:", threadID, "=", enabled);

  // 🛡 Safe truth check
  if (!enabled || enabled === "false" || enabled === 0) return;

  const msg = event.body.trim();
  if (!msg) return;

  const name = event.senderName || "FB User";

  const data = {
    message: msg,
    sender: name,
    time: Date.now(),
    type: "web",
    source: "facebook",
    threadID
  };

  await pushData("chat", data);

  console.log("🌐 FB → DB:", msg);
};
