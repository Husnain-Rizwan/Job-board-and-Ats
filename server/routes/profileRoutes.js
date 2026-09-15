const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { resumeUpload } = require("../middleware/uploadMiddleware");
const {
  getProfile,
  getProfileCompletion,
  getRecruiterApplicantProfile,
  getRecruiterApplicantResume,
  updateProfile,
  uploadProfileResume,
  deleteProfileResume,
  getProfileResume,
} = require("../controllers/profileController");

const router = express.Router();
router.get("/applicants/:applicantId", protect, authorize("recruiter"), getRecruiterApplicantProfile);
router.get("/applicants/:applicantId/resume", protect, authorize("recruiter"), getRecruiterApplicantResume);
router.use(protect, authorize("jobseeker"));
router.get("/completion", getProfileCompletion);
router.get("/", getProfile);
router.patch("/", updateProfile);
router.post("/resume", resumeUpload.single("resume"), uploadProfileResume);
router.get("/resume", getProfileResume);
router.delete("/resume", deleteProfileResume);

module.exports = router;
