// shipController.js

const connection = require("../config/db");

exports.getUserShipments = (req, res) => {
  const userId = req.params.userId;
  const query = `
      SELECT Container.*
      FROM Container
      JOIN Bookings ON Container.booking_id = Bookings.booking_id
      WHERE Bookings.user_id = ?
  `;
  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.length ? results : []);
  });
};

exports.getUpcomingShipments = (req, res) => {
  const userId = req.params.userId;
  const query = `
      SELECT  Ships.*, Bookings.booking_date_start, Bookings.booking_date_end
      FROM Ships
      JOIN Bookings ON Ships.ship_id = Bookings.ship_id
      WHERE Bookings.user_id = ? AND Bookings.booking_status = 'pending' 
            AND Bookings.booking_date_start > NOW()
      ORDER BY Bookings.booking_date_start ASC
  `;
  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.length ? results : []);
  });
};

exports.getContainerStatus = (req, res) => {
  const userId = req.params.userId;
  const query = `
      SELECT Container.*, Bookings.booking_status
      FROM Container
      JOIN Bookings ON Container.booking_id = Bookings.booking_id
      WHERE Bookings.user_id = ?
  `;
  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.length ? results : []);
  });
};
