// shipRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUpcomingShipments,
  getContainerStatus,
  getUserShipments,
} = require("../controllers/shipmentsController");

router.get("/upcoming/:userId", getUpcomingShipments);
router.get("/container-status/:userId", getContainerStatus);
router.get("/:userId", getUserShipments);

module.exports = router;
