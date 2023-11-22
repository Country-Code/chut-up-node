const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/reset-password").post(authController.resetPasswordAction);
router.route("/password-forgoten").post(authController.resetPasswordRequest);

module.exports = router;
