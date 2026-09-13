const User = require("../models/User");
const Application = require("../models/Application");
const Job = require("../models/Job");
const mongoose = require("mongoose");
const { getMissingProfileFields, hasCompletedJobseekerProfile } = require("../utils/profileCompletion");
const {
  deleteResumePdf,
  getSignedResumeUrl,
  resumeMetadata,
  uploadProfileResume: uploadProfileResumePdf,
} = require("../utils/resumeCloudinary");

const profileFields = [
  "professionalTitle",
  "phone",
  "location",
  "bio",
  "skills",
  "education",
  "experience",
];

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const getProfileCompletion = async (req, res, next) => {
  try {
    const missingFields = getMissingProfileFields(req.user);
    res.status(200).json({
      success: true,
      complete: hasCompletedJobseekerProfile(req.user),
      missingFields,
    });
  } catch (error) {
    next(error);
  }
};

const recruiterCanViewApplicant = async (recruiterId, applicantId) => {
  if (!mongoose.isValidObjectId(applicantId)) return false;

  const recruiterJobIds = await Job.find({ recruiter: recruiterId }).distinct("_id");
  if (!recruiterJobIds.length) return false;

  return Boolean(
    await Application.exists({ applicant: applicantId, job: { $in: recruiterJobIds } }),
  );
};

const getRecruiterApplicantProfile = async (req, res, next) => {
  try {
    const canView = await recruiterCanViewApplicant(req.user._id, req.params.applicantId);
    if (!canView) {
      return res.status(403).json({ success: false, message: "You are not authorized to view this profile" });
    }

    const user = await User.findById(req.params.applicantId).select(
      "name email professionalTitle phone location bio skills education experience resume",
    );
    if (!user) return res.status(404).json({ success: false, message: "Applicant not found" });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        resume: user.resume?.publicId
          ? { filename: user.resume.filename, available: true }
          : { filename: null, available: false },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRecruiterApplicantResume = async (req, res, next) => {
  try {
    const canView = await recruiterCanViewApplicant(req.user._id, req.params.applicantId);
    if (!canView) {
      return res.status(403).json({ success: false, message: "You are not authorized to view this resume" });
    }

    const user = await User.findById(req.params.applicantId).select("resume");
    if (!user?.resume?.publicId) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.status(200).json({
      success: true,
      url: getSignedResumeUrl(user.resume),
      filename: user.resume.filename,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([field]) =>
        profileFields.includes(field),
      ),
    );
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    next(error);
  }
};

const uploadProfileResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const previousResume = user.resume?.publicId
      ? {
          url: user.resume.url,
          publicId: user.resume.publicId,
          filename: user.resume.filename,
        }
      : null;
    const result = await uploadProfileResumePdf(req.file, req.user._id);

    user.resume = resumeMetadata(result, req.file.originalname);
    await user.save();

    // A Cloudinary cleanup failure must not make a successfully saved resume
    // appear failed to the jobseeker. Keep the old asset cleanup best-effort.
    if (previousResume) {
      try {
        await deleteResumePdf(previousResume);
      } catch (cleanupError) {
        console.error("Unable to remove replaced profile resume:", cleanupError);
      }
    }

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    next(error);
  }
};

const getProfileResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resume?.publicId) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const signedUrl = getSignedResumeUrl(user.resume);

    res.status(200).json({
      success: true,
      url: signedUrl,
      filename: user.resume.filename,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProfileResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const previousResume = user.resume?.publicId
      ? {
          url: user.resume.url,
          publicId: user.resume.publicId,
          filename: user.resume.filename,
        }
      : null;
    user.resume = { url: null, publicId: null, filename: null };
    await user.save();

    if (previousResume) {
      try {
        await deleteResumePdf(previousResume);
      } catch (cleanupError) {
        console.error("Unable to remove profile resume from Cloudinary:", cleanupError);
      }
    }
    res
      .status(200)
      .json({ success: true, message: "Resume removed successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getProfileCompletion,
  getRecruiterApplicantProfile,
  getRecruiterApplicantResume,
  updateProfile,
  uploadProfileResume,
  deleteProfileResume,
  getProfileResume,
};
