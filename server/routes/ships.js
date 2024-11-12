const express = require("express");
const {
  getUpcomingShipments,
  getContainerStatus,
  getUserShipments,
} = require("../controllers/shipmentController");
const router = express.Router();

router.get("/upcoming/:userId", getUpcomingShipments);
router.get("/container-status/:userId", getContainerStatus);
router.get("/:userId", getUserShipments);

module.exports = router;
