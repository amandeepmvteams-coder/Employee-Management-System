const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const authMiddleware = require("./../middlewares/authMiddleware");
router.post("/login", userController.login);
router.post("/register", userController.register);
router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.admin,
  userController.fetchAllUsers,
);

module.exports = router;
