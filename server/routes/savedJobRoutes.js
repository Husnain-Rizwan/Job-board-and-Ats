const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware")
const {
  createSavedJob,
  deleteSavedJob,
  getSavedJobs
} = require("../controllers/savedjobController");

const router = express.Router();

router.post("/:jobId", protect, authorize("jobseeker"), createSavedJob);
router.delete("/:jobId", protect, authorize("jobseeker"), deleteSavedJob);
router.get("/", protect, authorize("jobseeker"), getSavedJobs);


module.exports = router;