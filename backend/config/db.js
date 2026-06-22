const mongoose = require("mongoose");

const DB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Internal Error:${error.message}`);
    process.exit(1);
  }
};

module.exports = DB;
