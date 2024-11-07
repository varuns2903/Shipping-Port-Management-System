const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get("/", auth, UserController.getUsers)
router.post('/register', UserController.register);
router.post('/login', UserController.login);

module.exports = router;
