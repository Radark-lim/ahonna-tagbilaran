CREATE DATABASE IF NOT EXISTS ahonna_db;
USE ahonna_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evacuation_centers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO evacuation_centers (name, location, latitude, longitude, capacity, current_occupancy, status) VALUES
('Tagbilaran City Gymnasium', 'Cogon, Tagbilaran City', 9.651500, 123.856500, 500, 120, 'Open'),
('Dr. Cecilio V. Putong National High School', 'Gallares St, Tagbilaran City', 9.645200, 123.852100, 800, 310, 'Open'),
('Bohol Wisdom School Gym', 'J.A. Clarin St, Tagbilaran City', 9.658300, 123.861400, 400, 85, 'Open'),
('Mansasa Gymnasium', 'Mansasa, Tagbilaran City', 9.638500, 123.862100, 400, 10, 'Open');