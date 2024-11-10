const express = require("express");
const router = express.Router();
const { bookPort } = require("../controllers/bookingController");
const { getRecentBookings } = require("../controllers/bookingController");
router.get("/recent/:userId", getRecentBookings);
router.post("/book", bookPort);
module.exports = router;
