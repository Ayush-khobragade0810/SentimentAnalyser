const express = require("express");
const cors = require("cors");
const commentsRouter = require("./src/routes/commentRoutes");
const { createTable } = require("./src/models/commentModel");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Ensure table exists
createTable().then(() => console.log("✅ Comments table ready"));

// ✅ Only ONE router
app.use("/comments", commentsRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
