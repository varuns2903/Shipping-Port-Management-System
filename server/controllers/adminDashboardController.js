const bcrypt = require("bcryptjs");
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

  addUser: async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields (username, email, password, role) are required",
      });
    }

    try {
      db.query(
        "SELECT * FROM Users WHERE username = ? OR email = ?",
        [username, email],
        async (err, results) => {
          if (err) {
            console.error("Error checking existing users:", err);
            return res.status(500).json({
              message: "Error checking existing users",
              error: err.message,
            });
          }

          if (results.length > 0) {
            return res.status(409).json({
              message: "User with the same username or email already exists",
            });
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          db.query(
            "INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, role],
            (err, result) => {
              if (err) {
                console.error("Error adding user:", err);
                return res
                  .status(500)
                  .json({ message: "Error adding user", error: err.message });
              }

              res.status(201).json({
                message: "User added successfully",
                user_id: result.insertId,
              });
            }
          );
        }
      );
    } catch (error) {
      console.error("Error processing user addition:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
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
    db.query(
      "SELECT Ports.*, Country.country_name FROM Ports LEFT JOIN Country ON Ports.country_id = Country.country_id;",
      (err, results) => {
        if (err) {
          console.error("Error fetching ports:", err);
          return res
            .status(500)
            .json({ message: "Error fetching ports", error: err.message });
        }
        res.json({ data: results });
      }
    );
  },

  addPort: async (req, res) => {
    const { port_name, capacity, available_space, location, country_id } =
      req.body;

    if (
      !port_name ||
      !capacity ||
      !available_space ||
      !location ||
      !country_id
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const query = `
      INSERT INTO Ports (port_name, capacity, available_space, location, country_id)
      VALUES (?, ?, ?, ?, ?);
    `;

    db.query(
      query,
      [port_name, capacity, available_space, location, country_id],
      (err, result) => {
        if (err) {
          console.error("Error adding port:", err);
          return res
            .status(500)
            .json({ message: "Error adding port", error: err.message });
        }

        res.status(201).json({
          message: "Port added successfully",
          port_id: result.insertId,
        });
      }
    );
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
    const query = `
        SELECT 
            Bookings.*,
            Users.username,
            Ports.port_name,
            Ships.ship_name
        FROM 
            Bookings
        LEFT JOIN 
            Users ON Bookings.user_id = Users.user_id
        LEFT JOIN 
            Ports ON Bookings.port_id = Ports.port_id
        LEFT JOIN 
            Ships ON Bookings.ship_id = Ships.ship_id
    `;

    db.query(query, (err, results) => {
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

    if (booking_status === "canceled") {
      db.query(
        "SELECT port_id, required_space FROM Bookings WHERE booking_id = ?",
        [booking_id],
        (err, results) => {
          if (err) {
            console.error("Error fetching booking details:", err);
            return res.status(500).json({
              message: "Error fetching booking details",
              error: err.message,
            });
          }

          if (results.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
          }

          const { port_id, required_space } = results[0];

          db.query(
            "UPDATE Bookings SET booking_status = ? WHERE booking_id = ?",
            [booking_status, booking_id],
            (err, updateResults) => {
              if (err) {
                console.error("Error updating booking status:", err);
                return res.status(500).json({
                  message: "Error updating booking status",
                  error: err.message,
                });
              }

              if (updateResults.affectedRows === 0) {
                return res.status(404).json({ message: "Booking not found" });
              }

              db.query(
                "UPDATE Ports SET available_space = available_space + ? WHERE port_id = ?",
                [required_space, port_id],
                (err, updateSpaceResults) => {
                  if (err) {
                    console.error("Error updating available space:", err);
                    return res.status(500).json({
                      message: "Error updating available space",
                      error: err.message,
                    });
                  }

                  res.json({
                    message: "Booking updated and space refunded successfully",
                  });
                }
              );
            }
          );
        }
      );
    } else {
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
    }
  },

  deleteBookings: async (req, res) => {
    const { booking_id } = req.params;

    db.query(
      "SELECT port_id, required_space FROM Bookings WHERE booking_id = ?",
      [booking_id],
      (err, results) => {
        if (err) {
          console.error("Error fetching booking details:", err);
          return res.status(500).json({
            message: "Error fetching booking details",
            error: err.message,
          });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "Booking not found" });
        }

        const { port_id, required_space } = results[0];

        db.query(
          "DELETE FROM Bookings WHERE booking_id = ?",
          [booking_id],
          (err, deleteResults) => {
            if (err) {
              console.error("Error deleting booking:", err);
              return res.status(500).json({
                message: "Error deleting booking",
                error: err.message,
              });
            }

            if (deleteResults.affectedRows === 0) {
              return res.status(404).json({ message: "Booking not found" });
            }

            db.query(
              "UPDATE Ports SET available_space = available_space + ? WHERE port_id = ?",
              [required_space, port_id],
              (err, updateResults) => {
                if (err) {
                  console.error("Error updating available space:", err);
                  return res.status(500).json({
                    message: "Error updating available space",
                    error: err.message,
                  });
                }

                res.json({
                  message: "Booking deleted and space updated successfully",
                });
              }
            );
          }
        );
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

  addCountry: async (req, res) => {
    const { country_name } = req.body;

    if (!country_name) {
      return res.status(400).json({ message: "Country name is required" });
    }

    const checkQuery = "SELECT * FROM Country WHERE country_name = ?";
    db.query(checkQuery, [country_name], (err, results) => {
      if (err) {
        console.error("Error checking country existence:", err);
        return res.status(500).json({
          message: "Error checking country existence",
          error: err.message,
        });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Country already exists" });
      }

      const insertQuery = "INSERT INTO Country (country_name) VALUES (?)";
      db.query(insertQuery, [country_name], (err, results) => {
        if (err) {
          console.error("Error adding country:", err);
          return res
            .status(500)
            .json({ message: "Error adding country", error: err.message });
        }

        res.status(201).json({
          message: "Country added successfully",
          data: { country_id: results.insertId, country_name },
        });
      });
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
    const query = `
      SELECT Employee.*, Ports.port_name
      FROM Employee
      LEFT JOIN Ports ON Employee.port_id = Ports.port_id
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching employees:", err);
        return res
          .status(500)
          .json({ message: "Error fetching employees", error: err.message });
      }
      res.json({ data: results });
    });
  },

  addEmployee: async (req, res) => {
    const {
      first_name,
      last_name,
      position,
      salary,
      hire_date,
      port_id,
      port_name,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !position ||
      !salary ||
      !hire_date ||
      !port_id
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const checkQuery =
      "SELECT * FROM Employee WHERE first_name = ? AND last_name = ?";
    db.query(checkQuery, [first_name, last_name], (err, results) => {
      if (err) {
        console.error("Error checking employee existence:", err);
        return res.status(500).json({
          message: "Error checking employee existence",
          error: err.message,
        });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Employee already exists" });
      }

      const insertQuery = `
        INSERT INTO Employee (first_name, last_name, position, salary, hire_date, port_id) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [first_name, last_name, position, salary, hire_date, port_id],
        (err, results) => {
          if (err) {
            console.error("Error adding employee:", err);
            return res.status(500).json({
              message: "Error adding employee",
              error: err.message,
            });
          }

          res.status(201).json({
            message: "Employee added successfully",
            data: {
              employee_id: results.insertId,
              first_name,
              last_name,
              position,
              salary,
              hire_date,
              port_id,
              port_name,
            },
          });
        }
      );
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
      `SELECT Ships.*, Country.country_name, Ports.port_name
       FROM Ships
       LEFT JOIN Country ON Ships.country_id = Country.country_id
       LEFT JOIN Ports ON Ships.port_id = Ports.port_id;`,
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

  addShip: async (req, res) => {
    const {
      ship_name,
      capacity,
      registration_number,
      owner,
      country_id,
      port_id,
    } = req.body;

    if (
      !ship_name ||
      !capacity ||
      !registration_number ||
      !owner ||
      !country_id ||
      !port_id
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const checkQuery = `SELECT * FROM Ships WHERE registration_number = ?`;

    db.query(checkQuery, [registration_number], (err, results) => {
      if (err) {
        console.error("Error checking ship existence:", err);
        return res.status(500).json({
          message: "Error checking ship existence",
          error: err.message,
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Ship with this registration number already exists.",
        });
      }

      const insertQuery = `
      INSERT INTO Ships (ship_name, capacity, registration_number, owner, country_id, port_id)
      VALUES (?, ?, ?, ?, ?, ?)`;

      const values = [
        ship_name,
        capacity,
        registration_number,
        owner,
        country_id,
        port_id,
      ];

      db.query(insertQuery, values, (err, results) => {
        if (err) {
          console.error("Error adding ship:", err);
          return res
            .status(500)
            .json({ message: "Error adding ship", error: err.message });
        }

        db.query(
          `SELECT Ships.*, Country.country_name, Ports.port_name
         FROM Ships
         LEFT JOIN Country ON Ships.country_id = Country.country_id
         LEFT JOIN Ports ON Ships.port_id = Ports.port_id`,
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
      });
    });
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

  editContainer: async (req, res) => {
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
        calculate_port_utilization(Ports.port_id) AS capacityUtilization,
        (SELECT COUNT(*) 
        FROM Bookings 
        WHERE Bookings.port_id = Ports.port_id 
        AND (booking_status = 'confirmed' OR booking_status = 'pending')) AS activeBookings,
        (SELECT SUM(Container.weight) 
        FROM Container 
        INNER JOIN Bookings ON Container.booking_id = Bookings.booking_id 
        WHERE Bookings.port_id = Ports.port_id) AS totalCargoLoad
      FROM Ports;

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
        Bookings.booking_date_start AS timestamp,
        Ports.port_name,
        Bookings.booking_id AS reference_id
       FROM Bookings
       JOIN Ports ON Bookings.port_id = Ports.port_id
       ORDER BY Bookings.booking_date_start DESC)
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
