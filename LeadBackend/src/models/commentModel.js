const pool = require("../config/db");

// ✅ Create table if not exists
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      stakeholder_name VARCHAR(100),
      section_reference VARCHAR(50),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const insertComment = async (stakeholder_name, section_reference, comment) => {
  const result = await pool.query(
    "INSERT INTO comments (stakeholder_name, section_reference, comment) VALUES ($1, $2, $3) RETURNING *",
    [stakeholder_name, section_reference, comment]
  );
  return result.rows[0];
};

const getComments = async () => {
  const result = await pool.query("SELECT * FROM comments ORDER BY created_at DESC");
  return result.rows;
};

module.exports = { createTable, insertComment, getComments };
