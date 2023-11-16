const { Router } = require("express");
const router = Router();
const userController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/AuthMiddleware")

router.route("/").get(authMiddleware.isAdmin, userController.getAll);
router.route("/profile").get(authMiddleware.isAuthenticated, userController.getProfile);
router.route("/profile").put(authMiddleware.isAuthenticated, userController.editProfile);
router.route("/profile").delete(authMiddleware.isAuthenticated, userController.deleteProfile);

module.exports = router;
