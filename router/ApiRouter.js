const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middlewares/AuthMiddleware")

router.route("/").use(authMiddleware.verifyJWT);
router.route("/profile").use(require("./api/profileRouter"));
router.route("/chats").use(require("./api/chatsRouter"));
router.route("/messages").use(require("./api/messagesRouter"));

module.exports = router;
