const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controllers/adminDashboardController");

router.get("/users", adminDashboardController.getUsers);
router.post("/users", adminDashboardController.addUser);
router.put("/users/:user_id", adminDashboardController.editUser);
router.delete("/users/:user_id", adminDashboardController.deleteUser);

router.get("/ports", adminDashboardController.getPorts);
router.post("/ports", adminDashboardController.addPort);
router.put("/ports/:port_id", adminDashboardController.editPort);
router.delete("/ports/:port_id", adminDashboardController.deletePort);

router.get("/bookings", adminDashboardController.getBookings);
router.get("/booking-logs", adminDashboardController.getBookingLogs);
router.put("/bookings/:booking_id", adminDashboardController.editBookings);
router.delete("/bookings/:booking_id", adminDashboardController.deleteBookings);

router.get("/countries", adminDashboardController.getCountries);
router.post("/countries", adminDashboardController.addCountry);
router.put("/countries/:country_id", adminDashboardController.editCountries);
router.delete(
  "/countries/:country_id",
  adminDashboardController.deleteCountries
);

router.get("/employees", adminDashboardController.getEmployees);
router.post("/employees", adminDashboardController.addEmployee);
router.put("/employees/:employee_id", adminDashboardController.editEmployees);
router.delete(
  "/employees/:employee_id",
  adminDashboardController.deleteEmployees
);

router.get("/ships", adminDashboardController.getShips);
router.post("/ships", adminDashboardController.addShip);
router.put("/ships/:ship_id", adminDashboardController.editShips);
router.delete("/ships/:ship_id", adminDashboardController.deleteShips);

router.get(
  "/containers",

  adminDashboardController.getContainers
);
router.put(
  "/containers/:container_id",

  adminDashboardController.editContainer
);
router.delete(
  "/containers/:container_id",

  adminDashboardController.getContainers
);

router.get("/stats", adminDashboardController.getStats);
router.get(
  "/activityLogs",

  adminDashboardController.getActivityLogs
);

module.exports = router;
