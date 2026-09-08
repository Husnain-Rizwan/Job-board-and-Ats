const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware")

const { createCompany, 
  getCompanyById, 
  updateCompany,
  deleteCompany
 } = require("../controllers/companyController");

const router = express.Router();

router.post("/createCompany", protect, authorize("recruiter"), createCompany);
router.get("/:id", protect, authorize("recruiter"), getCompanyById);
router.put("/:id", protect, authorize("recruiter"), updateCompany);
router.delete("/:id", protect, authorize("recruiter"), deleteCompany);


module.exports = router;