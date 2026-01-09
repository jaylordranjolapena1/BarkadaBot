const { pushData, getData } = require("../../database");

console.log("🔥 fbToDatabase LOADED");

module.exports.config = {
  name: "fbToDatabase",
  eventType: ["message", "message_reply"]   // 🔥 FIXED
};

module.exports.run = async function ({ api, event }) {

  // 🧪 DEBUG - makita natin ang totoong event type
  console.log("🧪 RAW EVENT:", event.type, event.logMessageType);

  // Only handle real messages
  if (!event.body || typeof event.body !== "string") return;

  // Prevent echo
  if (event.senderID === api.getCurrentUserID()) return;

  const threadID = event.threadID;

  const enabled = await getData(`ingamechat/${threadID}`);
  console.log("📦 IngameChat:", threadID, "=", enabled);

  if (enabled !== true) return;   // 🔒 STRICT CHECK

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
