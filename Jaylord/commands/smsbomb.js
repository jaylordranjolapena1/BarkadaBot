const axios = require("axios");

module.exports.config = {
  name: "smsbomb",
  version: "1.2.0",
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
    return api.sendMessage("⛔ This command is restricted to bot administrators only.", threadID);
  }

  if (!args[0]) {
    return api.sendMessage("Usage: /smsbomb <number> [amount]", threadID);
  }

  // 🧹 Clean & normalize number
  let number = args[0].replace(/[^0-9]/g, "");
  let amount = parseInt(args[1]) || 1;

  if (number.startsWith("09")) number = "63" + number.slice(1);

  try {
    const API_KEY = "rapi_976f172d54f6487f8b8ed4a0c45cff34";
    const url = `https://rapido.zetsu.xyz/api/smsbomb?number=${number}&amount=${amount}&apikey=${API_KEY}`;

    const { data } = await axios.get(url);

    const message =
`📡 SMS API Response

🧾 Status: ${data.msg}
🎯 Target: ${data.target}
📦 Total: ${data.total}
✅ Success: ${data.success}
❌ Failed: ${data.failed}
📊 Rate: ${data.rate}
📝 Note: ${data.note}`;

    api.sendMessage(message, threadID);

  } catch (err) {
    console.error("SMS API Error:", err.response?.data || err.message);
    api.sendMessage("❌ API request failed. Please check the number format.", threadID);
  }
};
