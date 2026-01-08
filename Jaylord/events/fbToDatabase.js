const { pushData, getData } = require("../../database");

module.exports.config = {
  name: "fbToDatabase",
  eventType: ["message"]
};

module.exports.run = async function ({ api, event }) {

  if (!event.body) return;
  if (event.senderID === api.getCurrentUserID()) return;

  const threadID = event.threadID;

  const enabled = await getData(`ingamechat/${threadID}`);
  console.log("CHAT TO DB ENABLED:", enabled, typeof enabled);
  if (enabled !== true) return;

  if (event.fromGameRelay) return;

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
