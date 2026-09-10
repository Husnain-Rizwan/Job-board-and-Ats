const express = require("express");
const router = express.Router();

const {
  jobseekerDashboardStats,
  jobseekerApplications,
  jobseekerApplicationStats
} = require("../controllers/jobseekerDashboardController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


router.get(
  "/stats",
  protect,
  authorize("jobseeker"),
  jobseekerDashboardStats
);


router.get(
  "/applications",
  protect,
  authorize("jobseeker"),
  jobseekerApplications
);


router.get(
  "/application-stats",
  protect,
  authorize("jobseeker"),
  jobseekerApplicationStats
);


module.exports = router;