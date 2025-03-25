const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",        
  database: "sports_cars_db",
  password: "120704", 
  port: 5432
});

app.get("/sports-cars", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sports_cars");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving cars:", error);
    res.status(500).json({ message: "Failed to retrieve cars" });
  }
});

app.post("/sports-cars", async (req, res) => {
  const { make, model, horsepower, top_speed } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO sports_cars (make, model, horsepower, top_speed) VALUES ($1, $2, $3, $4) RETURNING *",
      [make, model, horsepower, top_speed]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting car:", error);
    res.status(500).json({ message: "Failed to add car" });
  }
});

app.get("/", (req, res) => {
  res.send("Sports Cars API is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});