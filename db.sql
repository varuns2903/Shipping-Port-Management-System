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
    FOREIGN KEY (country_id) REFERENCES Country(country_id) ON DELETE SET NULL
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

-- Shares Table
CREATE TABLE Shares (
    share_id INT PRIMARY KEY AUTO_INCREMENT,
    country_id INT,
    port_id INT,
    percentage_share DECIMAL(5, 2) CHECK (percentage_share >= 0 AND percentage_share <= 100),
    FOREIGN KEY (country_id) REFERENCES Country(country_id) ON DELETE CASCADE,
    FOREIGN KEY (port_id) REFERENCES Ports(port_id) ON DELETE CASCADE
);

-- Users Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
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
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    booking_status ENUM('pending', 'confirmed', 'canceled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (port_id) REFERENCES Ports(port_id) ON DELETE SET NULL,
    FOREIGN KEY (ship_id) REFERENCES Ships(ship_id) ON DELETE SET NULL
);

-- Container Table
CREATE TABLE Container (
    container_id INT PRIMARY KEY AUTO_INCREMENT,
    container_type VARCHAR(50) NOT NULL,
    weight INT NOT NULL,
    contents VARCHAR(255),
    ship_id INT,
    booking_id INT,
    FOREIGN KEY (ship_id) REFERENCES Ships(ship_id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
);


INSERT INTO Country (country_name) VALUES
('United States'),
('Germany'),
('China'),
('India'),
('Brazil'),
('Australia'),
('South Korea');


INSERT INTO Ports (port_name, country_id, capacity, available_space, location) VALUES
('Port of Los Angeles', 1, 10000, 5000, 'California, USA'),
('Port of Hamburg', 2, 8000, 3000, 'Hamburg, Germany'),
('Port of Shanghai', 3, 15000, 7000, 'Shanghai, China'),
('Port of Mumbai', 4, 12000, 6000, 'Mumbai, India'),
('Port of Santos', 5, 11000, 4500, 'Santos, Brazil'),
('Port of Sydney', 6, 9500, 4000, 'Sydney, Australia'),
('Port of Busan', 7, 13000, 6500, 'Busan, South Korea');


INSERT INTO Employee (first_name, last_name, position, salary, hire_date, port_id) VALUES
('John', 'Doe', 'Port Manager', 85000.00, '2015-06-12', 1),
('Anna', 'Smith', 'Dock Supervisor', 60000.00, '2018-02-21', 2),
('Wei', 'Li', 'Logistics Coordinator', 75000.00, '2017-08-14', 3),
('Raj', 'Kumar', 'Operations Manager', 90000.00, '2016-11-10', 4),
('Maria', 'Silva', 'Customs Officer', 55000.00, '2019-01-05', 5),
('Jack', 'Brown', 'Security Officer', 50000.00, '2020-03-25', 6),
('Sung', 'Park', 'Harbor Master', 95000.00, '2014-05-11', 7);


INSERT INTO Ships (ship_name, capacity, registration_number, owner, country_id, port_id) VALUES
('USS Enterprise', 5000, 'US12345', 'US Navy', 1, 1),
('MSC Meraviglia', 4500, 'DE98765', 'MSC Cruises', 2, 2),
('Cosco Shipping Aries', 11000, 'CN11111', 'Cosco Shipping', 3, 3),
('Indian Ocean', 8500, 'IN20222', 'Indian Navy', 4, 4),
('Santos Star', 9000, 'BR33333', 'Santos Port Authority', 5, 5),
('Sydney Explorer', 9500, 'AU44444', 'Australian Government', 6, 6),
('Busan Mariner', 12000, 'KR55555', 'Hanjin Shipping', 7, 7);


INSERT INTO Shares (country_id, port_id, percentage_share) VALUES
(1, 1, 45.00),
(2, 2, 60.00),
(3, 3, 50.00),
(4, 4, 40.00),
(5, 5, 55.00),
(6, 6, 70.00),
(7, 7, 65.00);

INSERT INTO Bookings (user_id, port_id, ship_id, booking_date, booking_status) VALUES
(1, 1, 1, '2024-05-01 14:30:00', 'pending'),
(1, 2, 2, '2024-06-15 09:00:00', 'confirmed'),
(1, 3, 3, '2024-07-10 11:15:00', 'canceled'),
(1, 4, 4, '2024-05-10 17:30:00', 'pending'),
(1, 5, 5, '2024-06-01 12:45:00', 'confirmed'),
(1, 6, 6, '2024-07-20 08:00:00', 'pending'),
(1, 7, 7, '2024-07-25 16:00:00', 'confirmed');

update bookings set booking_date="2024-11-20" where user_id=1 and booking_status="pending";
INSERT INTO Container (container_type, weight, contents, ship_id, booking_id) VALUES
('Refrigerated', 5000, 'Frozen Goods', 1, 1),
('Standard', 2000, 'Textiles', 2, 2),
('Dry', 3500, 'Electronics', 3, 3),
('Open Top', 4500, 'Machinery', 4, 4),
('Flat Rack', 6000, 'Construction Materials', 5, 5),
('Standard', 3000, 'Clothing', 6, 6),
('Refrigerated', 4000, 'Perishable Foods', 7, 7);




