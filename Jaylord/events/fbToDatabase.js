const { setData, getData } = require("../../database");

console.log("🔥 fbToDatabase LOADED");

module.exports.config = {
  name: "fbToDatabase",
  eventType: ["message"]
};

module.exports.run = async function ({ api, event }) {
  if (!event.body) return;
  if (event.senderID === api.getCurrentUserID()) return;

  const threadID = event.threadID;

  // 🔎 GC toggle check
  const enabled = await getData(`ingamechat/${threadID}`);
  console.log("📦 IngameChat:", threadID, "=", enabled);

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

  // 💉 FORCE WRITE — same method that worked before
  const key = "chat/" + Date.now();
  await setData(key, data);

  console.log("🌐 FB → DB:", msg);
};
