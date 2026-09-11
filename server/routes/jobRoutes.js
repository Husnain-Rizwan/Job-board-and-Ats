const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware")

const {
  getAllJobs,
  createJob,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob
} = require("../controllers/jobController");

const router = express.Router();

// Public routes (Accessible to Jobseekers, recruiters, and visitors)
router.get("", getAllJobs);
router.get("/:id", getJobById);

// Protected routes (Recruiters only)
router.post("/createJob", protect, authorize("recruiter"), createJob); 
router.put("/:id", protect, authorize("recruiter"), updateJob); 
router.patch("/:id/status", protect, authorize("recruiter"), updateJobStatus);
router.delete("/:id", protect, authorize("recruiter"), deleteJob); 

module.exports = router;