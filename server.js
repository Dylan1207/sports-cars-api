require("dotenv").config();

console.log("DB USER:", process.env.DB_USER);

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASS),
  port: process.env.DB_PORT,
});

app.get("/sports-cars", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sports_cars");
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error); // Log full error in terminal
    res.status(500).json({ message: "Error retrieving cars", error: error.message });
  }
});

async function seedDatabase() {
  const cars = [
    ["Ferrari", "488 GTB", 661, 205],
    ["Lamborghini", "Huracán", 630, 202],
    ["Porsche", "911 Turbo S", 640, 205],
    ["McLaren", "720S", 710, 212],
    ["Aston Martin", "Vantage", 503, 195],
    ["Chevrolet", "Corvette Z06", 670, 195],
    ["Bugatti", "Chiron", 1500, 261],
    ["Koenigsegg", "Jesko", 1600, 300],
    ["Tesla", "Roadster", 1020, 250],
    ["Ford", "GT", 660, 216],
    ["Dodge", "Viper ACR", 645, 206],
    ["Maserati", "MC20", 621, 202],
    ["Nissan", "GT-R Nismo", 600, 205],
    ["Audi", "R8 V10", 602, 206],
    ["BMW", "M8 Competition", 617, 190],
    ["Mercedes", "AMG GT Black Series", 720, 202],
    ["Jaguar", "F-Type R", 575, 186],
    ["Pagani", "Huayra", 730, 238],
    ["Lexus", "LFA", 552, 202],
    ["Rimac", "Nevera", 1914, 258],
  ];

  for (const car of cars) {
    await pool.query(
      "INSERT INTO sports_cars (make, model, horsepower, top_speed) VALUES ($1, $2, $3, $4)",
      car
    );
  }
  console.log("Database seeded with sports cars");
}

// seedDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});