const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const adminDashboardController = {
  getUsers: async (req, res) => {
    db.query("SELECT * FROM Users", (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Error fetching users", error: err.message });
      }
      res.json({ data: results });
    });
  },

  getPorts: async (req, res) => {
    db.query("SELECT * FROM Ports", (err, results) => {
      if (err) {
        console.error("Error fetching ports:", err);
        return res.status(500).json({ message: "Error fetching ports", error: err.message });
      }
      res.json({ data: results });
    });
  },

  getBookings: async (req, res) => {
    db.query("SELECT * FROM Bookings", (err, results) => {
      if (err) {
        console.error("Error fetching bookings:", err);
        return res.status(500).json({ message: "Error fetching bookings", error: err.message });
      }
      res.json({ data: results });
    });
  },

  getCountries: async (req, res) => {
    db.query("SELECT * FROM Country", (err, results) => {
      if (err) {
        console.error("Error fetching countries:", err);
        return res.status(500).json({ message: "Error fetching countries", error: err.message });
      }
      res.json({ data: results });
    });
  },

  getEmployees: async (req, res) => {
    db.query("SELECT * FROM Employee", (err, results) => {
      if (err) {
        console.error("Error fetching employees:", err);
        return res.status(500).json({ message: "Error fetching employees", error: err.message });
      }
      res.json({ data: results });
    });
  },

  getShips: async (req, res) => {
    db.query("SELECT * FROM Ships", (err, results) => {
      if (err) {
        console.error("Error fetching ships:", err);
        return res.status(500).json({ message: "Error fetching ships", error: err.message });
      }
      res.json({ data: results });
    });
  },

  getContainers: async (req, res) => {
    db.query("SELECT * FROM Container", (err, results) => {
      if (err) {
        console.error("Error fetching containers:", err);
        return res.status(500).json({ message: "Error fetching containers", error: err.message });
      }
      res.json({ data: results });
    });
  },

  getStats: async (req, res) => {
    const statsQuery = `
      SELECT 
        Ports.port_id,
        Ports.port_name,
        Ports.capacity,
        Ports.available_space,
        ((Ports.capacity - Ports.available_space) / Ports.capacity) * 100 AS capacityUtilization,
        (SELECT COUNT(*) FROM Bookings WHERE Bookings.port_id = Ports.port_id AND booking_status = 'confirmed') AS activeBookings,
        (SELECT SUM(Container.weight) FROM Container 
         INNER JOIN Bookings ON Container.booking_id = Bookings.booking_id 
         WHERE Bookings.port_id = Ports.port_id) AS totalCargoLoad
      FROM Ports
    `;
    db.query(statsQuery, (err, results) => {
      if (err) {
        console.error("Error fetching stats:", err);
        return res.status(500).json({ message: "Error fetching stats", error: err.message });
      }
      res.json({ data: results });
    });
  },

  getActivityLogs: async (req, res) => {
    const activityQuery = `
      (SELECT 
        'New Booking' AS activity, 
        Bookings.booking_date AS timestamp, 
        Ports.port_name,
        Bookings.booking_id AS reference_id
       FROM Bookings
       JOIN Ports ON Bookings.port_id = Ports.port_id
       ORDER BY Bookings.booking_date DESC)
      UNION ALL
      (SELECT 
        'User Registration' AS activity, 
        Users.registration_date AS timestamp, 
        'System' AS port_name,
        Users.user_id AS reference_id
       FROM Users
       ORDER BY Users.registration_date DESC)
      ORDER BY timestamp DESC
    `;
    db.query(activityQuery, (err, results) => {
      if (err) {
        console.error("Error fetching activity logs:", err);
        return res.status(500).json({ message: "Error fetching activity logs", error: err.message });
      }
      res.json({ data: results });
    });
  },
};

module.exports = adminDashboardController;
