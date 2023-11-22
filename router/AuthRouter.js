const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.route("/").post(authController.register);
router.route("/login").post(authController.login);
router.route("/password-forgoten").post(authController.resetPasswordRequest);
router.route("/reset-password").post(authController.resetPasswordAction);

module.exports = router;
