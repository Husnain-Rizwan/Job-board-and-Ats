const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { 
  createApplication,
  getRecruiterApplications
 } = require("../controllers/applicatioController");

const router = express.Router();

// Recruiters can only view applications for jobs they uploaded.
router.get("", protect, authorize("recruiter"), getRecruiterApplications);

router.post("/:jobId", protect, authorize("jobseeker"), upload.single("resume"), createApplication);

module.exports = router;
