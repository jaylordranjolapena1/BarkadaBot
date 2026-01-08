const { pushData, getData } = require("../../database");

module.exports.config = {
  name: "fbToDatabase",
  eventType: ["message"]
};

module.exports.run = async function ({ api, event }) {

  if (!event.body) return;
  if (event.senderID === api.getCurrentUserID()) return;

  const threadID = event.threadID;

  // 🔒 Check kung enabled sa GC
  const enabled = await getData(`ingamechat/${threadID}`);

  console.log("📦 IngameChat status:", threadID, "=", enabled);

  // Accepts: true, "true", 1
  if (!(enabled === true || enabled === "true" || enabled === 1)) return;

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
