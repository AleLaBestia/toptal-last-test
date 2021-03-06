const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares");

router.post("/login", authController.login);
router.post("/signup", authController.signUp);
router.route("/")
  .put(authMiddleware, authController.updateProfile)
  .delete(authMiddleware, authController.removeProfile);

module.exports = router;
