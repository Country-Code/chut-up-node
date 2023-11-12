const controller = require("../controllers/ChatController");
const smfw = require("../utils/smfw");

module.exports = smfw.getCRUDRouter(controller, "chats")
