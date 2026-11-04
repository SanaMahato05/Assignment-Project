const batches = require("../data/batches");

const getBatches = (req, res) => {
  try {
    // Read query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 5);

    const search = (req.query.search || "").trim().toLowerCase();
    const status = req.query.status || "";
    const centre = req.query.centre || "";

    // Search by Batch Code or Course Name
    let filteredBatches = batches.filter((batch) => {
      const matchesSearch =
        batch.batchCode.toLowerCase().includes(search) ||
        batch.courseName.toLowerCase().includes(search);

      const matchesStatus =
        !status || status === "All Status" || batch.status === status;

      const matchesCentre =
        !centre || centre === "All Centres" || batch.centreName === centre;

      return matchesSearch && matchesStatus && matchesCentre;
    });

    // Calculate pagination
    const totalRecords = filteredBatches.length;
    const totalPages = Math.ceil(totalRecords / limit);

    const startIndex = (page - 1) * limit;
    const paginatedBatches = filteredBatches.slice(
      startIndex,
      startIndex + limit
    );

    // Get available centre names for the filter dropdown
    const centres = [...new Set(batches.map((batch) => batch.centreName))];

    // Send response
    res.status(200).json({
      success: true,
      data: paginatedBatches,
      centres,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch batches",
    });
  }
};

module.exports = { getBatches };