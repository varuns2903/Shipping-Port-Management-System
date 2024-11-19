use dbms_project;

-- Country Table
CREATE TABLE Country (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(100) NOT NULL
);

-- Ports Table
CREATE TABLE Ports (
    port_id INT PRIMARY KEY AUTO_INCREMENT,
    port_name VARCHAR(100) NOT NULL,
    country_id INT,
    capacity INT NOT NULL,
    available_space INT NOT NULL,
    location VARCHAR(255),
    FOREIGN KEY (country_id) REFERENCES Country(country_id) ON DELETE CASCADE
);

-- Ships Table
CREATE TABLE Ships (
    ship_id INT PRIMARY KEY AUTO_INCREMENT,
    ship_name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    registration_number VARCHAR(50) UNIQUE,
    owner VARCHAR(100),
    country_id INT,
    port_id INT,
    FOREIGN KEY (country_id) REFERENCES Country(country_id) ON DELETE SET NULL,
    FOREIGN KEY (port_id) REFERENCES Ports(port_id) ON DELETE SET NULL
);

-- Employee Table
CREATE TABLE Employee (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    position VARCHAR(100),
    salary DECIMAL(10, 2),
    hire_date DATE,
    port_id INT,
    FOREIGN KEY (port_id) REFERENCES Ports(port_id) ON DELETE SET NULL
);

-- Users Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    port_id INT,
    ship_id INT,
    booking_date_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    booking_date_end TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    booking_status ENUM('pending', 'confirmed', 'canceled') DEFAULT 'pending',
    required_space INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (port_id) REFERENCES Ports(port_id) ON DELETE CASCADE,
    FOREIGN KEY (ship_id) REFERENCES Ships(ship_id) ON DELETE CASCADE
);

-- Container Table
CREATE TABLE Container (
    container_id INT PRIMARY KEY AUTO_INCREMENT,
    container_type VARCHAR(50) NOT NULL,
    weight INT NOT NULL,
    contents VARCHAR(255),
    ship_id INT,
    booking_id INT,
    FOREIGN KEY (ship_id) REFERENCES Ships(ship_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
);

-- Procedure for adding booking
DELIMITER //
CREATE PROCEDURE add_booking(
  IN p_user_id INT,
  IN p_port_id INT,
  IN p_ship_id INT,
  IN p_start_date TIMESTAMP,
  IN p_end_date TIMESTAMP,
  IN p_required_space INT
)
BEGIN
  DECLARE available INT;
  DECLARE new_booking_id INT;

  SELECT available_space INTO available FROM Ports WHERE port_id = p_port_id;

  IF available >= p_required_space THEN
    INSERT INTO Bookings (user_id, port_id, ship_id, booking_date_start, booking_date_end, booking_status, required_space)
    VALUES (p_user_id, p_port_id, p_ship_id, p_start_date, p_end_date, 'pending', p_required_space);
    
    SET new_booking_id = LAST_INSERT_ID();

    UPDATE Ports
    SET available_space = available_space - p_required_space
    WHERE port_id = p_port_id;

    SELECT 'Booking created successfully' AS message, new_booking_id AS booking_id;
  ELSE
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Insufficient space available at the selected port for this booking.';
  END IF;
END //
DELIMITER ;

-- Function to calculate port utilization
DELIMITER //
CREATE FUNCTION calculate_port_utilization(pid INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
  DECLARE total_capacity INT;
  DECLARE space_available INT;
  DECLARE utilization DECIMAL(5,2);

  SELECT capacity, available_space INTO total_capacity, space_available
  FROM Ports
  WHERE port_id = pid;

  IF total_capacity > 0 THEN
    SET utilization = ((total_capacity - space_available) / total_capacity) * 100;
  ELSE
    SET utilization = 0;
  END IF;

  RETURN utilization;
END //
DELIMITER ;

-- Trigger for preventing deletion of country if associated with any port or ship
DELIMITER //
CREATE TRIGGER prevent_country_deletion
BEFORE DELETE ON Country
FOR EACH ROW
BEGIN
  DECLARE port_count INT;
  DECLARE ship_count INT;
  
  SELECT COUNT(*) INTO port_count FROM Ports WHERE country_id = OLD.country_id;
  SELECT COUNT(*) INTO ship_count FROM Ships WHERE country_id = OLD.country_id;
  
  IF port_count > 0 OR ship_count > 0 THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Cannot delete country with associated ports or ships.';
  END IF;
END //
DELIMITER ;

-- Trigger for prevention of deletion of ports if associated with any ship
DELIMITER //
CREATE TRIGGER prevent_port_deletion
BEFORE DELETE ON Ports
FOR EACH ROW
BEGIN
  DECLARE ship_count INT;

  SELECT COUNT(*) INTO ship_count FROM Ships WHERE port_id = OLD.port_id;

  IF ship_count > 0 THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Cannot delete port with associated ships.';
  END IF;
END //
DELIMITER ;

CREATE TABLE Booking_Logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    user_id INT,
    username varchar(50),
    port_id INT,
    portname varchar(100),
    ship_id INT,
    shipname varchar(100),
    booking_date_start TIMESTAMP,
    booking_date_end TIMESTAMP,
    booking_status ENUM('pending', 'confirmed', 'canceled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER after_booking_insert
AFTER INSERT ON Bookings
FOR EACH ROW
BEGIN
    DECLARE user_name VARCHAR(50);
    DECLARE port_name VARCHAR(100);
    DECLARE ship_name VARCHAR(100);

    SELECT username INTO user_name FROM Users WHERE user_id = NEW.user_id;

    SELECT port_name INTO port_name FROM Ports WHERE port_id = NEW.port_id;

    SELECT ship_name INTO ship_name FROM Ships WHERE ship_id = NEW.ship_id;

    INSERT INTO Booking_Logs (booking_id, user_id, username, port_id, portname, ship_id, shipname, booking_date_start, booking_date_end, booking_status)
    VALUES (NEW.booking_id, NEW.user_id, user_name, NEW.port_id, port_name, NEW.ship_id, ship_name, NEW.booking_date_start, NEW.booking_date_end, NEW.booking_status);
END //
DELIMITER ;

insert into bookings () values ();