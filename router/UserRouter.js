const { Router } = require("express");
const router = Router();
const userController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/AuthMiddleware")

router.route("/").post(userController.register);
router.route("/").get(authMiddleware.isAdmin, userController.getAll);
router.route("/profile").get(authMiddleware.isAuthenticated, userController.getProfile);
router.route("/profile").put(authMiddleware.isAuthenticated, userController.editProfile);
router.route("/login").post(userController.login);

module.exports = router;
