const { setData } = require("../../database");

module.exports.config = {
  name: "fbToDatabase",
  eventType: ["message"]
};

module.exports.run = async function ({ api, event }) {
  if (!event.body) return;
  if (event.senderID === api.getCurrentUserID()) return;

  const msg = event.body.trim();
  if (!msg) return;

  const name = event.senderName || "FB User";

  const data = {
    message: msg,
    sender: name,
    time: Date.now(),
    type: "web"
  };

  const key = "chat/" + Date.now();

  await setData(key, data);

  console.log("🌐 FB → DB:", msg);
};
