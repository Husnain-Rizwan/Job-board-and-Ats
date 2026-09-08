const express = require("express");

const {
  loginUser,
  registerUser
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    user: req.user
  });
})

router.get("/recruiter-test", protect, authorize("recruiter"), (req, res) => {
  return res.json({
    message: "You are recruiter",
    user: req.user
  })
});



module.exports = router;