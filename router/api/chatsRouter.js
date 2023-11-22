const controller = require("../../controllers/chatsController");
const smfw = require("../../utils/smfw");

module.exports = smfw.getCRUDRouter(controller, "chats")
