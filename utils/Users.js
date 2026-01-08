module.exports = {
  async getNameUser(id) {
    try {
      const user = await global.api.getUserInfo(id);
      return user[id]?.name || "Unknown User";
    } catch {
      return "Unknown User";
    }
  }
};
