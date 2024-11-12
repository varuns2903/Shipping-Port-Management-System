const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controllers/adminDashboardController");
const { auth, isAdmin } = require("../middleware/auth");

router.get("/users", auth, isAdmin, adminDashboardController.getUsers);
router.post("/users", auth, isAdmin, adminDashboardController.addUser);
router.put("/users/:user_id", auth, isAdmin, adminDashboardController.editUser);
router.delete("/users/:user_id", auth, isAdmin, adminDashboardController.deleteUser);

router.get("/ports", auth, isAdmin, adminDashboardController.getPorts);
router.post("/ports", auth, isAdmin, adminDashboardController.addPort);
router.put("/ports/:port_id", auth, isAdmin, adminDashboardController.editPort);
router.delete("/ports/:port_id", auth, isAdmin, adminDashboardController.deletePort);

router.get("/bookings", auth, isAdmin, adminDashboardController.getBookings);
router.put("/bookings/:booking_id", auth, isAdmin, adminDashboardController.editBookings);
router.delete("/bookings/:booking_id", auth, isAdmin, adminDashboardController.deleteBookings);

router.get("/countries", auth, isAdmin, adminDashboardController.getCountries);
router.post("/countries", auth, isAdmin, adminDashboardController.addCountry);
router.put("/countries/:country_id", auth, isAdmin, adminDashboardController.editCountries);
router.delete("/countries/:country_id", auth, isAdmin, adminDashboardController.deleteCountries);

router.get("/employees", auth, isAdmin, adminDashboardController.getEmployees);
router.post("/employees", auth, isAdmin, adminDashboardController.addEmployee);
router.put("/employees/:employee_id", auth, isAdmin, adminDashboardController.editEmployees);
router.delete("/employees/:employee_id", auth, isAdmin, adminDashboardController.deleteEmployees);

router.get("/ships", auth, isAdmin, adminDashboardController.getShips);
router.post("/ships", auth, isAdmin, adminDashboardController.addShip);
router.put("/ships/:ship_id", auth, isAdmin, adminDashboardController.editShips);
router.delete("/ships/:ship_id", auth, isAdmin, adminDashboardController.deleteShips);

router.get(
  "/containers",
  auth,
  isAdmin,
  adminDashboardController.getContainers
);
router.put(
  "/containers/:container_id",
  auth,
  isAdmin,
  adminDashboardController.editContainer
);
router.delete(
  "/containers/:container_id",
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
