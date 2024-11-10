const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controllers/adminDashboardController");
const { auth, isAdmin } = require("../middleware/auth");

router.get("/users", auth, isAdmin, adminDashboardController.getUsers);
router.put("/users/:user_id", auth, isAdmin, adminDashboardController.editUser);
router.delete("/users/:user_id", auth, isAdmin, adminDashboardController.deleteUser);

router.get("/ports", auth, isAdmin, adminDashboardController.getPorts);
router.put("/ports/:port_id", auth, isAdmin, adminDashboardController.editPort);
router.delete("/ports/:port_id", auth, isAdmin, adminDashboardController.deletePort);

router.get("/bookings", auth, isAdmin, adminDashboardController.getBookings);
router.put("/bookings/:booking_id", auth, isAdmin, adminDashboardController.editBookings);
router.delete("/bookings/:booking_id", auth, isAdmin, adminDashboardController.deleteBookings);

router.get("/countries", auth, isAdmin, adminDashboardController.getCountries);
router.put("/countries/:country_id", auth, isAdmin, adminDashboardController.editCountries);
router.delete("/countries/:country_id", auth, isAdmin, adminDashboardController.deleteCountries);

router.get("/employees", auth, isAdmin, adminDashboardController.getEmployees);
router.put("/employees/:employee_id", auth, isAdmin, adminDashboardController.editEmployees);
router.delete("/employees/:employee_id", auth, isAdmin, adminDashboardController.deleteEmployees);

router.get("/ships", auth, isAdmin, adminDashboardController.getShips);
router.put("/ships/:ship_id", auth, isAdmin, adminDashboardController.editShips);
router.delete("/ships/:ship_id", auth, isAdmin, adminDashboardController.deleteShips);

router.get(
  "/containers",
  auth,
  isAdmin,
  adminDashboardController.getContainers
);

router.get("/stats", auth, isAdmin, adminDashboardController.getStats);
router.get(
  "/activityLogs",
  auth,
  isAdmin,
  adminDashboardController.getActivityLogs
);

module.exports = router;
