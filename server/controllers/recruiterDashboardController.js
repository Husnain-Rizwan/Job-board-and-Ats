const Job = require("../models/Job");
const Application = require("../models/Application");


// Get all job IDs belonging to logged-in recruiter
const getRecruiterJobIds = async (recruiterId) => {
  const jobs = await Job.find(
    { recruiter: recruiterId },
    { _id: 1 }
  );

  return jobs.map(job => job._id);
};


// 13.1 Recruiter Dashboard Statistics
const recruiterDashboardStats = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({
      recruiter: recruiterId
    });

    const jobIds = jobs.map(job => job._id);

    const totalJobs = jobs.length;

    const activeJobs = jobs.filter(
      job => job.status === "active"
    ).length;

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds }
    });

    const interviews = await Application.countDocuments({
      job: { $in: jobIds },
      status: "interview"
    });

    res.status(200).json({
      success: true,
      totalJobs,
      activeJobs,
      totalApplications,
      interviews
    });

  } catch (error) {
    next(error);
  }
};


// 13.2 Recruiter's Recent Jobs
const recruiterDashboardJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentJobs = await Promise.all(
      jobs.map(async (job) => {

        const applicantCount = await Application.countDocuments({
          job: job._id
        });

        return {
          _id: job._id,
          title: job.title,
          status: job.status,
          applicantCount
        };
      })
    );

    res.status(200).json({
      success: true,
      jobs: recentJobs
    });

  } catch (error) {
    next(error);
  }
};


// 13.3 Recruiter's Recent Applications
const recruiterDashboardApplications = async (req, res, next) => {
  try {
    const jobIds = await getRecruiterJobIds(req.user._id);

    const applications = await Application.find({
      job: { $in: jobIds }
    })
      .select("-resume -coverletter -statusHistory -__v")
      .populate("applicant", "name email")
      .populate("job", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      applications
    });

  } catch (error) {
    next(error);
  }
};


// 13.4 Application Status Statistics
const recruiterApplicationStats = async (req, res, next) => {
  try {
    const jobIds = await getRecruiterJobIds(req.user._id);

    const stats = await Application.aggregate([
      {
        $match: {
          job: { $in: jobIds }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Default values
    const applicationStats = {
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0
    };

    // Put database results into the object
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
  recruiterDashboardStats,
  recruiterDashboardJobs,
  recruiterDashboardApplications,
  recruiterApplicationStats
};