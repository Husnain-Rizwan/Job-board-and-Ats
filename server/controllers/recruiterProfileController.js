const User = require("../models/User");
const Company = require("../models/Company");

const fields = ["name", "email", "phone", "professionalTitle"];

const getRecruiterProfile = async (req, res, next) => {
  try {
    const [user, company] = await Promise.all([
      User.findById(req.user._id).select("name email phone professionalTitle"),
      Company.findOne({ $or: [{ recruiter: req.user._id }, { recruiters: req.user._id }] }).select("name"),
    ]);
    res.status(200).json({ success: true, user, company });
  } catch (error) {
    next(error);
  }
};

const updateRecruiterProfile = async (req, res, next) => {
  try {
    const updates = Object.fromEntries(Object.entries(req.body).filter(([field]) => fields.includes(field)));
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
      .select("name email phone professionalTitle");
    if (!user) return res.status(404).json({ message: "Recruiter not found" });
    res.status(200).json({ success: true, message: "Recruiter profile updated", user });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "That work email is already in use" });
    next(error);
  }
};

module.exports = { getRecruiterProfile, updateRecruiterProfile };
