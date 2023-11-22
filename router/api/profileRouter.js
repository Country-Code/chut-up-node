const { Router } = require("express");
const router = Router();
const profileController = require("../../controllers/profileController");

router.route("/").get(profileController.getProfile);
router.route("/").put(profileController.editProfile);
router.route("/").delete(profileController.deleteProfile);

module.exports = router;
