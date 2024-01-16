const controller = require("../../controllers/searchController");
const { Router } = require("express");
const router = Router();

router.route("/users").post(controller.users);

module.exports = router;
