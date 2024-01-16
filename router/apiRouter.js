const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middlewares/authMiddleware")

router.use("/", authMiddleware.verifyJWT);
router.use("/profile", require("./api/profileRouter"));
router.use("/messages", require("./api/messagesRouter"));
router.use("/chats", require("./api/chatsRouter"));
router.use("/search", require("./api/searchRouter"));

module.exports = router;
