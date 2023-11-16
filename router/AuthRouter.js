const { Router } = require("express");
const router = Router();
const authController = require("../controllers/AuthController");

router.route("/").post(authController.register);
router.route("/login").post(authController.login);
router.route("/password-forgoten").post(authController.resetPasswordRequest);

module.exports = router;
