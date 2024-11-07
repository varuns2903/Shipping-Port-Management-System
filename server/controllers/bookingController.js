const db = require("../config/db");

const BookingController = {
  getAllBookings: (req, res) => {
    const query = "SELECT * FROM Bookings";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching bookings:", err);
        return res.status(500).json({ message: "Error fetching bookings" });
      }
      res.json(results);
    });
  },
};

module.exports = BookingController;
