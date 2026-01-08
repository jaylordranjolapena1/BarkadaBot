const { onData, getData } = require("../utils/database");

module.exports = async function () {

  onData("chat", async (data) => {
    if (!data || !data.message) return;

    const subs = await getData("ingamechat") || {};

    for (const threadID in subs) {
      if (!subs[threadID]) continue;

      global.api.sendMessage(`🎮 ${data.message}`, threadID);
    }
  });

};
