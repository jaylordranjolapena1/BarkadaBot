const { getData } = require("../../database.js");

module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "2.0.1",
  credits: "Kim Joseph DG Bien + ChatGPT + Jaylord La Peña",
  description: "Join Notification with welcome image and optional video",
  dependencies: {
    "fs-extra": "",
    "request": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const request = require("request");
  const fs = global.nodemodule["fs-extra"];
  const axios = require("axios");
  const path = require("path");

  const { threadID, logMessageData } = event;
  if (!logMessageData || !logMessageData.addedParticipants) return;

  const addedParticipants = logMessageData.addedParticipants;

  // 🧠 Bot added
  if (addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(
      `𝗕𝗢𝗧 ${global.config.BOTNAME} 【 ${global.config.PREFIX} 】`,
      threadID,
      api.getCurrentUserID()
    );
    return api.sendMessage(
      `✅ BOT CONNECTED!\n\nThanks for adding me!\nUse ${global.config.PREFIX}help to see commands.\nIf there's an issue, report it using ${global.config.PREFIX}callad.`,
      threadID
    );
  }

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const threadName = threadInfo.threadName || "this group";
    const totalMembers = threadInfo.participantIDs?.length || 0;

    const videoConfig = await getData(`welcomeVideo/${threadID}`);
    const videoEnabled = videoConfig?.enabled || false;

    for (const newUser of addedParticipants) {
      const userID = newUser.userFbId;
      if (userID === api.getCurrentUserID()) continue;

      let userName = "Friend";
      try {
        const info = await api.getUserInfo(userID);
        if (info?.[userID]?.name) userName = info[userID].name;
      } catch {}

      const message = `Hello ${userName}!\nWelcome to ${threadName}!\nYou're the ${totalMembers}th member in this group. Enjoy your stay! 🎉`;

      const imgApi = `https://betadash-api-swordslush-production.up.railway.app/welcome?name=${encodeURIComponent(userName)}&userid=${userID}&threadname=${encodeURIComponent(threadName)}&members=${totalMembers}`;
      const videoApi = `https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu`;

      const cacheDir = path.join(__dirname, "..", "commands", "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const imgPath = path.join(cacheDir, `welcome_${userID}.png`);
      const videoPath = path.join(cacheDir, `welcome_${userID}.mp4`);

      // 🖼 Download image
      try {
        await new Promise((resolve, reject) => {
          request(imgApi)
            .pipe(fs.createWriteStream(imgPath))
            .on("close", resolve)
            .on("error", reject);
        });
      } catch {
        console.log("⚠️ Welcome image failed, sending text only.");
      }

      // 📨 Send welcome message safely
      const msgData = { body: message, mentions: [{ tag: userName, id: userID }] };
      if (fs.existsSync(imgPath)) msgData.attachment = fs.createReadStream(imgPath);

      await new Promise(resolve => {
        api.sendMessage(msgData, threadID, () => {
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          resolve();
        });
      });

      // 🎥 Send video if enabled
      if (!videoEnabled) continue;
      await new Promise(r => setTimeout(r, 3000));

      try {
        const res = await axios.get(videoApi, { timeout: 15000 });
        const videoUrl = res?.data?.shotiurl;
        if (!videoUrl) continue;

        const stream = await axios({ url: videoUrl, responseType: "stream", timeout: 30000 });

        await new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(videoPath);
          stream.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        const videoMsg = { body: `🎥 Welcome video for you, ${userName}!` };
        if (fs.existsSync(videoPath)) videoMsg.attachment = fs.createReadStream(videoPath);

        api.sendMessage(videoMsg, threadID, () => {
          if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        });

      } catch (e) {
        console.log("⚠️ Video failed:", e.message);
      }
    }

  } catch (err) {
    console.error("❌ joinNoti error:", err);
  }
};
