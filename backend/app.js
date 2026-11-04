const express = require("express");
const cors = require("cors");

const batchRoutes = require("./routes/batchRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/batches", batchRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Batch Operations API is running");
});

module.exports = app;