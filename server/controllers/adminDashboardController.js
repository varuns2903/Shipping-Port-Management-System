const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const adminDashboardController = {
  getUsers: async (req, res) => {
    db.query("SELECT * FROM Users", (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res
          .status(500)
          .json({ message: "Error fetching users", error: err.message });
      }
      res.json({ data: results });
    });
  },

  editUser: async (req, res) => {
    const { user_id } = req.params;
    const { role } = req.body;

    if (!role || (role !== "admin" && role !== "user")) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const query = "UPDATE Users SET role = ? WHERE user_id = ?";
    db.query(query, [role, user_id], (err, results) => {
      if (err) {
        console.error("Error updating user role:", err);
        return res
          .status(500)
          .json({ message: "Error updating user role", error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "Role updated successfully" });
    });
  },

  deleteUser: async (req, res) => {
    const { user_id } = req.params;

    const query = "DELETE FROM Users WHERE user_id = ?";
    db.query(query, [user_id], (err, results) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res
          .status(500)
          .json({ message: "Error deleting user", error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "Deleted user successfully" });
    });
  },

  getPorts: async (req, res) => {
    db.query("SELECT * FROM Ports", (err, results) => {
      if (err) {
        console.error("Error fetching ports:", err);
        return res
          .status(500)
          .json({ message: "Error fetching ports", error: err.message });
      }
      res.json({ data: results });
    });
  },

  editPort: async (req, res) => {
    const { port_id } = req.params;
    const { port_name, capacity, available_space, location } = req.body;

    db.query(
      "UPDATE Ports SET port_name = ?, capacity = ?, available_space = ?, location = ? WHERE port_id = ?",
      [port_name, capacity, available_space, location, port_id],
      (err, results) => {
        if (err) {
          console.error("Error updating port:", err);
          return res
            .status(500)
            .json({ message: "Error updating port", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Port not found" });
        }
        res.json({ message: "Port updated successfully" });
      }
    );
  },

  deletePort: async (req, res) => {
    const { port_id } = req.params;

    db.query(
      "DELETE FROM Ports WHERE port_id = ?",
      [port_id],
      (err, results) => {
        if (err) {
          console.error("Error deleting port:", err);
          return res
            .status(500)
            .json({ message: "Error deleting port", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Port not found" });
        }
        res.json({ message: "Port deleted successfully" });
      }
    );
  },

  getBookings: async (req, res) => {
    db.query("SELECT * FROM Bookings", (err, results) => {
      if (err) {
        console.error("Error fetching bookings:", err);
        return res
          .status(500)
          .json({ message: "Error fetching bookings", error: err.message });
      }
      res.json({ data: results });
    });
  },

  editBookings: async (req, res) => {
    const { booking_id } = req.params;
    const { booking_status } = req.body;

    db.query(
      "UPDATE Bookings SET booking_status = ? WHERE booking_id = ?",
      [booking_status, booking_id],
      (err, results) => {
        if (err) {
          console.error("Error updating bookings:", err);
          return res
            .status(500)
            .json({ message: "Error updating bookings", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Booking not found" });
        }
        res.json({ message: "Booking updated successfully" });
      }
    );
  },

  deleteBookings: async (req, res) => {
    const { booking_id } = req.params;

    db.query(
      "DELETE FROM Bookings WHERE booking_id = ?",
      [booking_id],
      (err, results) => {
        if (err) {
          console.error("Error fetching bookings:", err);
          return res
            .status(500)
            .json({ message: "Error fetching bookings", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Booking not found" });
        }
        res.json({ message: "Booking deleted successfully" });
      }
    );
  },

  getCountries: async (req, res) => {
    db.query("SELECT * FROM Country", (err, results) => {
      if (err) {
        console.error("Error fetching countries:", err);
        return res
          .status(500)
          .json({ message: "Error fetching countries", error: err.message });
      }
      res.json({ data: results });
    });
  },

  editCountries: async (req, res) => {
    const { country_id } = req.params;
    const { country_name } = req.body;

    db.query(
      "UPDATE Country SET country_name = ? WHERE country_id = ?",
      [country_name, country_id],
      (err, results) => {
        if (err) {
          console.error("Error editing countries:", err);
          return res
            .status(500)
            .json({ message: "Error editing countries", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Country not found" });
        }
        res.json({ message: "Country edited successfully" });
      }
    );
  },

  deleteCountries: async (req, res) => {
    const { country_id } = req.params;

    db.query(
      "DELETE FROM Country WHERE country_id = ?",
      [country_id],
      (err, results) => {
        if (err) {
          console.error("Error deleting countries:", err);
          return res
            .status(500)
            .json({ message: "Error deleting countries", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Country not found" });
        }
        res.json({ message: "Country deleted successfully" });
      }
    );
  },

  getEmployees: async (req, res) => {
    db.query("SELECT * FROM Employee", (err, results) => {
      if (err) {
        console.error("Error fetching employees:", err);
        return res
          .status(500)
          .json({ message: "Error fetching employees", error: err.message });
      }
      res.json({ data: results });
    });
  },

  editEmployees: async (req, res) => {
    const { employee_id } = req.params;
    const { first_name, last_name, position, salary, hire_date, port_id } =
      req.body;

    db.query(
      "UPDATE Employee SET first_name = ?, last_name = ?, position = ?, salary = ?, hire_date = ?, port_id = ? WHERE employee_id = ?",
      [
        first_name,
        last_name,
        position,
        salary,
        hire_date,
        port_id,
        employee_id,
      ],
      (err, results) => {
        if (err) {
          console.error("Error editing employees:", err);
          return res
            .status(500)
            .json({ message: "Error editing employees", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee edited successfully" });
      }
    );
  },

  deleteEmployees: async (req, res) => {
    const { employee_id } = req.params;

    db.query(
      "DELETE FROM Employee WHERE employee_id = ?",
      [employee_id],
      (err, results) => {
        if (err) {
          console.error("Error deleting employees:", err);
          return res
            .status(500)
            .json({ message: "Error deleting employees", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
      }
    );
  },

  getShips: async (req, res) => {
    db.query(
      "SELECT Ships.*, Country.country_name FROM Ships LEFT JOIN Country ON Ships.country_id = Country.country_id;",
      (err, results) => {
        if (err) {
          console.error("Error fetching ships:", err);
          return res
            .status(500)
            .json({ message: "Error fetching ships", error: err.message });
        }
        res.json({ data: results });
      }
    );
  },

  editShips: async (req, res) => {
    const { ship_id } = req.params;
    const {
      ship_name,
      capacity,
      registration_number,
      owner,
      country_id,
      port_id,
    } = req.body;

    db.query(
      "UPDATE Ships SET ship_name = ?, capacity = ?, registration_number = ?, owner = ?, country_id = ?, port_id = ? WHERE ship_id = ?",
      [
        ship_name,
        capacity,
        registration_number,
        owner,
        country_id,
        port_id,
        ship_id,
      ],
      (err, results) => {
        if (err) {
          console.error("Error editing ships:", err);
          return res
            .status(500)
            .json({ message: "Error editing ships", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Ship not found" });
        }
        res.json({ message: "Ship edited successfully" });
      }
    );
  },

  deleteShips: async (req, res) => {
    const { ship_id } = req.params;

    db.query(
      "DELETE FROM Ships WHERE ship_id = ?",
      [ship_id],
      (err, results) => {
        if (err) {
          console.error("Error deleting ships:", err);
          return res
            .status(500)
            .json({ message: "Error deleting ships", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Ship not found" });
        }
        res.json({ message: "Ship deleted successfully" });
      }
    );
  },

  getContainers: async (req, res) => {
    db.query(
      `
      SELECT Container.*, Ships.ship_name, Bookings.booking_status
      FROM Container
      LEFT JOIN Ships ON Container.ship_id = Ships.ship_id
      LEFT JOIN Bookings ON Container.booking_id = Bookings.booking_id;
    `,
      (err, results) => {
        if (err) {
          console.error("Error fetching containers:", err);
          return res
            .status(500)
            .json({ message: "Error fetching containers", error: err.message });
        }
        res.json({ data: results });
      }
    );
  },

  editContainers: async (req, res) => {
    const { container_id } = req.params;
    const { container_type, weight, contents, ship_id, booking_id } = req.body;

    db.query(
      "UPDATE Container SET container_type = ?, weight = ?, contents = ?, ship_id = ?, booking_id = ? WHERE container_id = ?",
      [container_type, weight, contents, ship_id, booking_id, container_id],
      (err, results) => {
        if (err) {
          console.error("Error editing containers:", err);
          return res
            .status(500)
            .json({ message: "Error editing containers", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Container not found" });
        }
        res.json({ message: "Container edited successfully" });
      }
    );
  },

  deleteContainers: async (req, res) => {
    const { container_id } = req.params;

    db.query(
      "DELETE FROM Container WHERE container_id = ?",
      [container_id],
      (err, results) => {
        if (err) {
          console.error("Error deleting containers:", err);
          return res
            .status(500)
            .json({ message: "Error deleting containers", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Container not found" });
        }
        res.json({ message: "Container deleted successfully" });
      }
    );
  },

  getStats: async (req, res) => {
    const statsQuery = `
      SELECT 
        Ports.port_id,
        Ports.port_name,
        Ports.capacity,
        Ports.available_space,
        ((Ports.capacity - Ports.available_space) / Ports.capacity) * 100 AS capacityUtilization,
        (SELECT COUNT(*) FROM Bookings WHERE Bookings.port_id = Ports.port_id AND (booking_status = 'confirmed' OR booking_status = 'pending')) AS activeBookings,
        (SELECT SUM(Container.weight) FROM Container 
         INNER JOIN Bookings ON Container.booking_id = Bookings.booking_id 
         WHERE Bookings.port_id = Ports.port_id) AS totalCargoLoad
      FROM Ports
    `;
    db.query(statsQuery, (err, results) => {
      if (err) {
        console.error("Error fetching stats:", err);
        return res
          .status(500)
          .json({ message: "Error fetching stats", error: err.message });
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
        return res.status(500).json({
          message: "Error fetching activity logs",
          error: err.message,
        });
      }
      res.json({ data: results });
    });
  },
};

module.exports = adminDashboardController;
