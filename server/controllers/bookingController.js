const connection = require("../config/db");

exports.checkAvailableSpace = (req, res) => {
  const { port_id } = req.params;

  const checkSpaceQuery = `SELECT available_space FROM Ports WHERE port_id = ?`;
  connection.query(checkSpaceQuery, [port_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error checking port space" });
    }

    const availableSpace = results[0]?.available_space || 0;
    res.json({ available_space: availableSpace });
  });
};

exports.bookPort = (req, res) => {
  const { user_id, port_id, ship_id, booking_date, required_space } = req.body;

  const checkSpaceQuery = `SELECT available_space FROM Ports WHERE port_id = ?`;
  connection.query(checkSpaceQuery, [port_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error checking port space" });
    }

    const availableSpace = results[0]?.available_space || 0;
    if (availableSpace < required_space) {
      return res.status(400).json({ error: "Not enough available space" });
    }

    const bookingQuery = `
      INSERT INTO Bookings (user_id, port_id, ship_id, booking_status, booking_date, required_space) 
      VALUES (?, ?, ?, 'pending', ?, ?)
    `;
    connection.query(
      bookingQuery,
      [user_id, port_id, ship_id, booking_date, required_space],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Error creating booking" });
        }

        const updatePortQuery = `
          UPDATE Ports SET available_space = available_space - ? WHERE port_id = ?
        `;
        connection.query(updatePortQuery, [required_space, port_id], (err) => {
          if (err) {
            return res.status(500).json({ error: "Error updating port space" });
          }

          res.status(201).json({
            message: "Booking created successfully",
            bookingId: result.insertId,
          });
        });
      }
    );
  });
};

exports.getRecentBookings = (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT * FROM Bookings 
    WHERE user_id = ? 
    ORDER BY booking_date DESC
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching recent bookings:", err);
      return res.status(500).json({ error: "Error fetching recent bookings" });
    }
    res.json(results.length ? results : []);
  });
};

exports.getShips = (req, res) => {
  const query = `SELECT ship_id,ship_name FROM Ships`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch ships." });
    res.json(results);
  });
};

exports.deleteBooking = (req, res) => {
  const bookingId = req.params.bookingId;
  const queryBookingDetails = `
    SELECT required_space, port_id 
    FROM Bookings 
    WHERE booking_id = ?
  `;

  connection.query(queryBookingDetails, [bookingId], (err, bookingResults) => {
    if (err || bookingResults.length === 0) {
      return res
        .status(500)
        .json({ error: "Booking not found or query error" });
    }

    const { required_space, port_id } = bookingResults[0];

    const deleteBookingQuery = `DELETE FROM Bookings WHERE booking_id = ?`;

    connection.query(deleteBookingQuery, [bookingId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete booking" });
      }

      const updatePortSpaceQuery = `
        UPDATE Ports 
        SET available_space = available_space + ? 
        WHERE port_id = ?
      `;

      connection.query(
        updatePortSpaceQuery,
        [required_space, port_id],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Failed to update port space" });
          }

          res.status(200).json({
            message: "Booking canceled and port space updated successfully.",
          });
        }
      );
    });
  });
};

exports.getAllBookings = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      Bookings.booking_id,
      Bookings.booking_status,
      Bookings.booking_date,
      Bookings.required_space,
      Ports.port_name,
      Ports.location,
      Ports.capacity,
      Ships.ship_name,
      Ships.ship_id
    FROM 
      Bookings
    JOIN 
      Ports ON Bookings.port_id = Ports.port_id
    LEFT JOIN 
      Ships ON Bookings.ship_id = Ships.ship_id
    WHERE 
      Bookings.user_id = ?
    ORDER BY 
      Bookings.booking_date DESC;
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results.length ? results : []);
  });
};
