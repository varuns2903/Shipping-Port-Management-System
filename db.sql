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
