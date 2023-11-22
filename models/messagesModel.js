const mongoose = require("mongoose");
const messagesEntity = require('./entities/messagesEntity');

module.exports = mongoose.model("messages", messagesEntity);
