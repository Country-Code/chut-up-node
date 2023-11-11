const mongoose = require("mongoose");
const chatEntity = require('./entities/ChatEntity');

const ChatModel = mongoose.model("Chat", chatEntity);

module.exports = ChatModel
