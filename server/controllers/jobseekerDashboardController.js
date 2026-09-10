const Application = require("../models/Application");


// 14.1 Jobseeker Dashboard Statistics
const jobseekerDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalApplications = await Application.countDocuments({
      applicant: userId
    });

    const shortlisted = await Application.countDocuments({
      applicant: userId,
      status: "shortlisted"
    });

    const interviews = await Application.countDocuments({
      applicant: userId,
      status: "interview"
    });

    const selected = await Application.countDocuments({
      applicant: userId,
      status: "selected"
    });

    res.status(200).json({
      success: true,
      totalApplications,
      shortlisted,
      interviews,
      selected
    });

  } catch (error) {
    next(error);
  }
};


// 14.2 Jobseeker's Applications
const jobseekerApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id
    })
      .select("-resume -coverletter -statusHistory -__v")
      .populate({
        path: "job",
        select: "title company",
        populate: {
          path: "company",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications
    });

  } catch (error) {
    next(error);
  }
};


// 14.3 Jobseeker Application Status Statistics
const jobseekerApplicationStats = async (req, res, next) => {
  try {
    const stats = await Application.aggregate([
      {
        $match: {
          applicant: req.user._id
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const applicationStats = {
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      applicationStats[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      ...applicationStats
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  jobseekerDashboardStats,
  jobseekerApplications,
  jobseekerApplicationStats
};