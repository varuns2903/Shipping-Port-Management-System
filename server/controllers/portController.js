// controllers/PortController.js
const db = require("../config/db");

const PortController = {
  getAllPorts: (req, res) => {
    // Join Ports with Country to get country_name
    const query = `
      SELECT Ports.port_id, Ports.port_name, Ports.capacity, Ports.available_space, Country.country_name
      FROM Ports
      LEFT JOIN Country ON Ports.country_id = Country.country_id
      WHERE Ports.available_space > 0
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching ports:", err);
        return res.status(500).json({ message: "Error fetching ports" });
      }
      res.json(results);
    });
  },
};

module.exports = PortController;