const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { logoUpload } = require("../middleware/uploadMiddleware");
const {
  createCompany,
  getMyCompany,
  updateMyCompany,
  getCompanyById,
  getCompanyJobs,
  updateCompany,
  deleteCompany,
  addRecruiter,
} = require("../controllers/companyController");

const router = express.Router();

router.post("/", protect, authorize("recruiter"), logoUpload.single("logo"), createCompany);
router.post("/createCompany", protect, authorize("recruiter"), logoUpload.single("logo"), createCompany);
router.get("/my-company", protect, authorize("recruiter"), getMyCompany);
router.patch("/my-company", protect, authorize("recruiter"), logoUpload.single("logo"), updateMyCompany);
router.post("/my-company/recruiters", protect, authorize("recruiter"), addRecruiter);

router.get("/:id/jobs", getCompanyJobs);
router.get("/:id", getCompanyById);

// Legacy recruiter-only routes retained for existing clients.
router.put("/:id", protect, authorize("recruiter"), updateCompany);
router.delete("/:id", protect, authorize("recruiter"), deleteCompany);

module.exports = router;
