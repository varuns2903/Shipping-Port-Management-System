// routes/portRoutes.js
const express = require("express");
const PortController = require("../controllers/portController");
const router = express.Router();

router.get("/browse", PortController.getAllPorts);

module.exports = router;
