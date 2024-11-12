const express = require("express");
const {
  getAllBookings,
  deleteBooking,
  getRecentBookings,
  bookPort,
  getShips,
  checkAvailableSpace,
} = require("../controllers/bookingController");
const router = express.Router();

router.get("/user/:userId", getAllBookings);
router.delete("/:bookingId", deleteBooking);
router.get("/recent/:userId", getRecentBookings);
router.post("/book", bookPort);
router.get("/ships", getShips);
router.get("/checkAvailableSpace/:port_id", checkAvailableSpace);

module.exports = router;
