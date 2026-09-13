const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { getRecruiterProfile, updateRecruiterProfile } = require("../controllers/recruiterProfileController");

const router = express.Router();
router.use(protect, authorize("recruiter"));
router.get("/", getRecruiterProfile);
router.patch("/", updateRecruiterProfile);

module.exports = router;
