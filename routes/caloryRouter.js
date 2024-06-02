const express = require("express");
const router = express.Router();
const dailyIntakeController = require("../controllers/dailyIntakeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/public", dailyIntakeController.getDailyIntakePublic);
router.post(
  "/private",
  authMiddleware,
  dailyIntakeController.getDailyIntakePrivate
);

module.exports = router;
