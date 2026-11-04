const express = require("express");
const router = express.Router();

const { getBatches } = require("../controllers/batchController");

// GET all batches with search, filters and pagination
router.get("/", getBatches);

module.exports = router;