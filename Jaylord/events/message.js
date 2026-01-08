module.exports = ({ api, event, config }) => {
  console.log(`📩 ${event.senderID}: ${event.body}`);
};
