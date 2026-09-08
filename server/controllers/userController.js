const User = require("../models/User");

const getUserProfile = async (req, res, next) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const {
      professionalTitle,
      phone,
      location,
      bio,
      skills,
      education,
      experience,
      resume,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        professionalTitle,
        phone,
        location,
        bio,
        skills,
        education,
        experience,
        resume,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};