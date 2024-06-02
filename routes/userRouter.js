const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.put("/update", authMiddleware, userController.updateUserInfo);
router.get("/logout", authMiddleware, userController.logout);
router.get("/verify/:verificationToken", userController.verifyEmail);
router.post("/verify", userController.resendVerificationEmail);
router.get("/current", authMiddleware, userController.current);

module.exports = router;
