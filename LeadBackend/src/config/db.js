const { Pool } = require("pg");

// Adjust with your PostgreSQL credentials
const pool = new Pool({
  user: "postgres",       // your db username
  host: "localhost",      // your db host
  database: "SentimentAnalysis",    // your db name
  password: "boss", // your db password
  port: 5432,             // default PostgreSQL port
});

module.exports = pool;
