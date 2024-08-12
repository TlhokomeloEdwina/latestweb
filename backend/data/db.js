const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_Name,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed: " + err.stack);
    return;
  }

  console.log("Connected to database.");
});

module.exports = db;
