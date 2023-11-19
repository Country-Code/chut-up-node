const { Router } = require("express");
const router = Router();
const userController = require("../controllers/UserController");
const {verifyOneRole, verifyAllRoles, isAuthenticated} = require("../middlewares/AuthMiddleware")

router.route("/").get(verifyOneRole("super-admin", "user"), userController.getAll);
router.route("/profile").get(isAuthenticated, userController.getProfile);
router.route("/profile").put(isAuthenticated, userController.editProfile);
router.route("/profile").delete(isAuthenticated, userController.deleteProfile);

module.exports = router;
