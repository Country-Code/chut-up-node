const controller = require("../../controllers/messagesController");
const smfw = require("../../utils/smfw");

module.exports = smfw.getCRUDRouter(controller, "messages")
