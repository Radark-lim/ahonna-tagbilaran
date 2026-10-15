const db = require("./db");

async function seedData() {
  try {
    await db.query("INSERT INTO evacuation_centers (name, location, latitude, longitude, capacity, current_occupancy, status) VALUES ('Tagbilaran City Comprehensive High School', 'Cogon, Tagbilaran City', 9.6543, 123.8561, 500, 45, 'open'), ('Dr. Cecilio Putong National High School', 'Gallares St, Tagbilaran City', 9.6834, 123.8602, 600, 120, 'open'), ('Tagbilaran City Gymnasium', 'Shaolin St, Tagbilaran City', 9.6712, 123.8549, 1000, 300, 'open'), ('Mansasa Gymnasium', 'Mansasa, Tagbilaran City', 9.6421, 123.8712, 400, 10, 'open');");
    console.log("Sample evacuation centers added successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding data:", err.message);
    process.exit(1);
  }
}

seedData();
