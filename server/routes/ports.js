const express = require('express');
const router = express.Router();
const PortController = require('../controllers/portController');
const auth = require('../middleware/auth');

router.get('/', auth, PortController.getAllPorts);

module.exports = router;
