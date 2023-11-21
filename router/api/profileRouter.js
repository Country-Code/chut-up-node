const { Router } = require("express");
const router = Router();
const profileController = require("../controllers/profileController");

router.route("/profile").get(profileController.getProfile);
router.route("/profile").put(profileController.editProfile);
router.route("/profile").delete(profileController.deleteProfile);

module.exports = router;
