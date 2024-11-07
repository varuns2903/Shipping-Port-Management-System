const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.get('/', auth, BookingController.getAllBookings);

module.exports = router;
