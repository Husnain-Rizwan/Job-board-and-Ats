const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { 
  createApplication,
  uploadResume,
  getRecruiterApplications,
  getRecruiterApplicationById,
  updateApplicationStatus,
  getRecruiterApplicationStatistics
 } = require("../controllers/applicatioController");

const router = express.Router();

// Recruiters can only view applications for jobs they uploaded.
router.get("/", protect, authorize("recruiter"), getRecruiterApplications);
router.get("/statistics", protect, authorize("recruiter"), getRecruiterApplicationStatistics);
router.get("/:applicationId", protect, authorize("recruiter"), getRecruiterApplicationById);

router.patch("/:applicationId/status", protect, authorize("recruiter"), updateApplicationStatus);
router.post("/upload-resume", protect, authorize("jobseeker"), upload.single("resume"), uploadResume);
router.post("/:jobId", protect, authorize("jobseeker"), upload.single("resume"), createApplication);

module.exports = router;
