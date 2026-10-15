const db = require("./db");
async function createTables() {
  try {
    await db.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role ENUM('admin', 'responder', 'citizen') DEFAULT 'citizen', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);");
    await db.query("CREATE TABLE IF NOT EXISTS evacuation_centers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(150) NOT NULL, location VARCHAR(255) NOT NULL, latitude DECIMAL(10, 8), longitude DECIMAL(11, 8), capacity INT NOT NULL, current_occupancy INT DEFAULT 0, status ENUM('open', 'full', 'closed') DEFAULT 'open', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);");
    console.log("Tables created successfully!");
    process.exit();
  } catch (err) {
    console.error("Error creating tables:", err.message);
    process.exit(1);
  }
}
createTables();
