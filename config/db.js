const mongoose = require("mongoose");
const { logger } = require("../utils/tools")
const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    logger.log().log(`MongoDB Connected: ${conn.connection.host}`, "MongoDB Connection");
  } catch (error) {
    logger.error().log(error.message, "MongoDB Connection Error");
    process.exit(1);
  }
};

module.exports = {connect};
