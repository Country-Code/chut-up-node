const mongoose = require("mongoose");
const chatsEntity = require("./entities/chatsEntity");

module.exports = mongoose.model("chats", chatsEntity);
