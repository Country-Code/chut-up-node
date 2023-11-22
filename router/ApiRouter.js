const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middlewares/authMiddleware")

router.use(authMiddleware.verifyJWT);
router.use("/profile", require("./api/profileRouter"));
router.use("/chats", require("./api/chatsRouter"));
router.use("/messages", require("./api/messagesRouter"));

module.exports = router;
