const express = require("express");

const {
  recruiterDashboardStats,
  recruiterDashboardJobs,
  recruiterDashboardApplications,
  recruiterApplicationStats
} = require("../controllers/recruiterDashboardController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware")

const router = express.Router();


router.get("/stats", protect, authorize("recruiter"), recruiterDashboardStats);
router.get("/jobs", protect, authorize("recruiter"), recruiterDashboardJobs);
router.get("/applications", protect, authorize("recruiter"), recruiterDashboardApplications);
router.get("/application-stats", protect, authorize("recruiter"), recruiterApplicationStats);


module.exports = router;