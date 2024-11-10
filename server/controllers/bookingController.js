const connection = require("../config/db");
exports.bookPort = (req, res) => {
  const { user_id, port_id, ship_id } = req.body;
  const query = `INSERT INTO Bookings (user_id, port_id, ship_id, booking_status) VALUES (?, ?, ?, 'pending')`;
  connection.query(query, [user_id, port_id, ship_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Booking created successfully",
      bookingId: result.insertId,
    });
  });
};

exports.getRecentBookings = (req, res) => {
  const userId = req.params.userId;
  const query = `
      SELECT * FROM Bookings 
      WHERE user_id = ? AND booking_status = 'confirmed' 
      ORDER BY booking_date DESC 
      LIMIT 5
  `;
  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.length ? results : []);  
  });
};
