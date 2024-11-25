const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { auth } = require("../middleware/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", auth, UserController.getProfile);
router.put("/profile", auth, UserController.updateProfile);

module.exports = router;
