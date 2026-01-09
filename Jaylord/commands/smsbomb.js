const axios = require("axios");

module.exports.config = {
  name: "smsbomb",
  version: "1.1.0",
  credits: "ChatGPT + Barkada",
  description: "Send message via external API (Admin only)",
  usage: "/smsbomb <number> [amount]",
  cooldown: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;

  // 🛡 BOT ADMIN CHECK
  const admins = global.config.adminUIDs || [];
  if (!admins.includes(senderID)) {
    return api.sendMessage(
      "⛔ This command is restricted to bot administrators only.",
      threadID
    );
  }

  if (!args[0]) {
    return api.sendMessage("Usage: /fetch <number> [amount]", threadID);
  }

  const number = args[0];
  const amount = args[1] || 1;

  try {
    // 🔑 PLACE YOUR API KEY HERE
    const API_KEY = "rapi_976f172d54f6487f8b8ed4a0c45cff34";

    const url = `https://rapido.zetsu.xyz/api/sendmessgae?number=${encodeURIComponent(number)}&amount=${amount}&apikey=${API_KEY}`;

    const res = await axios.get(url);
    const data = res.data;

    const message =
`📡 API Response

🧾 Status: ${data.msg}
🎯 Target: ${data.target}
📦 Total: ${data.total}
✅ Success: ${data.success}
❌ Failed: ${data.failed}
📊 Rate: ${data.rate}
📝 Note: ${data.note}`;

    api.sendMessage(message, threadID);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ API request failed.", threadID);
  }
};


