SELECT * FROM Users

SELECT * FROM Users WHERE username = ? OR email = ?

INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)

UPDATE Users SET role = ? WHERE user_id = ?

DELETE FROM Users WHERE user_id = ?

SELECT Ports.*, Country.country_name FROM Ports LEFT JOIN Country ON Ports.country_id = Country.country_id

INSERT INTO Ports (port_name, capacity, available_space, location, country_id) VALUES (?, ?, ?, ?, ?)

UPDATE Ports SET port_name = ?, capacity = ?, available_space = ?, location = ? WHERE port_id = ?

DELETE FROM Ports WHERE port_id = ?

SELECT Bookings.*, Users.username, Ports.port_name, Ships.ship_name FROM Bookings
  LEFT JOIN Users ON Bookings.user_id = Users.user_id
  LEFT JOIN Ports ON Bookings.port_id = Ports.port_id
  LEFT JOIN Ships ON Bookings.ship_id = Ships.ship_id

SELECT port_id, required_space FROM Bookings WHERE booking_id = ?

UPDATE Bookings SET booking_status = ? WHERE booking_id = ?

UPDATE Ports SET available_space = available_space + ? WHERE port_id = ?

DELETE FROM Bookings WHERE booking_id = ?

UPDATE Ports SET available_space = available_space + ? WHERE port_id = ?

SELECT * FROM Country;

SELECT * FROM Country WHERE country_name = ?;

INSERT INTO Country (country_name) VALUES (?);

UPDATE Country SET country_name = ? WHERE country_id = ?;

DELETE FROM Country WHERE country_id = ?;

SELECT Employee.*, Ports.port_name
  FROM Employee
  LEFT JOIN Ports ON Employee.port_id = Ports.port_id;

SELECT * FROM Employee WHERE first_name = ? AND last_name = ?;

INSERT INTO Employee (first_name, last_name, position, salary, hire_date, port_id)
  VALUES (?, ?, ?, ?, ?, ?);

UPDATE Employee SET first_name = ?, last_name = ?, position = ?, salary = ?, hire_date = ?, port_id = ? WHERE employee_id = ?;

DELETE FROM Employee WHERE employee_id = ?;

SELECT Ships.*, Country.country_name, Ports.port_name
  FROM Ships
  LEFT JOIN Country ON Ships.country_id = Country.country_id
  LEFT JOIN Ports ON Ships.port_id = Ports.port_id;

SELECT * FROM Ships WHERE registration_number = ?;

INSERT INTO Ships (ship_name, capacity, registration_number, owner, country_id, port_id)
  VALUES (?, ?, ?, ?, ?, ?);

UPDATE Ships SET ship_name = ?, capacity = ?, registration_number = ?, owner = ?, country_id = ?, port_id = ? WHERE ship_id = ?;

DELETE FROM Ships WHERE ship_id = ?;

SELECT Container.*, Ships.ship_name, Bookings.booking_status
  FROM Container
  LEFT JOIN Ships ON Container.ship_id = Ships.ship_id
  LEFT JOIN Bookings ON Container.booking_id = Bookings.booking_id;

UPDATE Container SET container_type = ?, weight = ?, contents = ?, ship_id = ?, booking_id = ? WHERE container_id = ?;

DELETE FROM Container WHERE container_id = ?;

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
ORDER BY timestamp DESC;

SELECT available_space FROM Ports WHERE port_id = ?;

CALL add_booking(?, ?, ?, ?, ?, ?);

SELECT * FROM Bookings 
  WHERE user_id = ? 
  ORDER BY booking_date_start DESC;

SELECT ship_id, ship_name FROM Ships;

SELECT required_space, port_id FROM Bookings WHERE booking_id = ?;

DELETE FROM Bookings WHERE booking_id = ?;

UPDATE Ports SET available_space = available_space + ? WHERE port_id = ?;

SELECT 
  Bookings.booking_id,
  Bookings.booking_status,
  Bookings.booking_date_start,
  Bookings.booking_date_end,
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
  Bookings.booking_date_start DESC;

SELECT 
  Ports.port_id, 
  Ports.port_name, 
  Ports.capacity, 
  Ports.available_space, 
  Country.country_name
  FROM 
    Ports
  LEFT JOIN 
    Country ON Ports.country_id = Country.country_id
  WHERE 
    Ports.available_space > 0;

SELECT Container.*
  FROM Container
  JOIN Bookings ON Container.booking_id = Bookings.booking_id
  WHERE Bookings.user_id = ?;

SELECT Ships.*, Bookings.booking_date_start, Bookings.booking_date_end
  FROM Ships
  JOIN Bookings ON Ships.ship_id = Bookings.ship_id
  WHERE Bookings.user_id = ? 
    AND Bookings.booking_status = 'pending'
    AND Bookings.booking_date_start > NOW()
  ORDER BY Bookings.booking_date_start ASC;

SELECT Container.*, Bookings.booking_status
  FROM Container
  JOIN Bookings ON Container.booking_id = Bookings.booking_id
  WHERE Bookings.user_id = ?;

SELECT * FROM Users WHERE email = ?;

INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?);

SELECT * FROM Users WHERE email = ?;

SELECT * FROM Users WHERE user_id = ?;

UPDATE Users SET username = ?, email = ? WHERE user_id = ?;
