const controller = require("../../controllers/chatsController");
const { Router } = require("express");
const router = Router();

router.route("/").post(controller.create);

router.route("/").get(controller.getAll);
router.route("/:id").get(controller.getById);
router.route("/user/:id").get(controller.getUserChat);

router.route("/:id/remove-user").put(controller.removeUser);
router.route("/:id/add-user").put(controller.addUser);
router.route("/:id/rename").put(controller.rename);

router.route("/:id/leave").delete(controller.leave);

module.exports = router;
