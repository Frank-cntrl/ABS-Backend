const db = require("./db");
const User = require("./user");
const Event = require("./events");
const Member = require("./members");

const syncDatabase = async () => {
  try {
    await Member.sync({ alter: true });
    console.log('Members table synced successfully');
  } catch (error) {
    console.error('Error syncing members table:', error);
  }
};

syncDatabase();

module.exports = {
  db,
  User,
  Event,
  Member,
};