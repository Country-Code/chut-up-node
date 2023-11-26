const controller = require("../../controllers/messagesController");
const { Router } = require("express");
const router = Router();

router.route("/send").post(controller.send);

router.route("/:id/read").put(controller.read);

router.route("/chat/:id").get(controller.getAllByChat);

module.exports = router;
