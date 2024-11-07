const db = require("../config/db");

const PortController = {
  getAllPorts: (req, res) => {
    const query = "SELECT * FROM Ports";
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
