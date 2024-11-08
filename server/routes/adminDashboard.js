const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const auth = require('../middleware/auth');

router.get("/users", auth, adminDashboardController.getUsers)
router.get("/ports", auth, adminDashboardController.getPorts)
router.get("/bookings", auth, adminDashboardController.getBookings)
router.get("/countries", auth, adminDashboardController.getCountries)
router.get("/employees", auth, adminDashboardController.getEmployees)
router.get("/ships", auth, adminDashboardController.getShips)
router.get("/containers", auth, adminDashboardController.getContainers)
router.get("/stats", auth, adminDashboardController.getStats)
router.get("/activityLogs", auth, adminDashboardController.getActivityLogs)

module.exports = router;
