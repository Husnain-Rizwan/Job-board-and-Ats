const Application = require("../models/Application");
const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");

const APPLICATION_STATUSES = [
  "applied",
  "shortlisted",
  "interview",
  "selected",
  "rejected"
];

// Returns an application only when its job belongs to the logged-in recruiter.
const findRecruiterApplication = async (applicationId, recruiterId) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    return null;
  }

  const job = await Job.findOne({
    _id: application.job,
    recruiter: recruiterId
  });

  return job ? application : null;
};

// Create Application
const createApplication = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverletter } = req.body;

    // 1. Check if resume was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required"
      });
    }

    // 2. Check if job exists
    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // 3. Check if job is active
    if (existingJob.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications"
      });
    }

    // 4. Check if user has already applied
    const existingApplication = await Application.findOne({
      applicant: req.user._id,
      job: jobId
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // 5. Upload resume to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "job-board/resumes",
          resource_type: "raw",
          public_id: `${req.user._id}_${Date.now()}.pdf`
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });
    console.log("Cloudinary result:", uploadResult);

    // 6. Create application
    const application = await Application.create({
      applicant: req.user._id,
      job: jobId,

      resume: {
        url: uploadResult.secure_url,
        filename: req.file.originalname
      },

      coverletter: coverletter || null,

      statusHistory: [
        {
          status: "applied",
          changedBy: req.user._id
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    next(error);
  }
};

// Get applications submitted to jobs created by the authenticated recruiter.
const getRecruiterApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Do not accept a recruiter ID from the client. Only jobs owned by req.user
    // can be used when finding applications.
    const recruiterJobs = await Job.find({ recruiter: req.user._id }).select("_id");
    const jobIds = recruiterJobs.map((job) => job._id);

    const filter = { job: { $in: jobIds } };
    if (status) {
      filter.status = status;
    }

    const [applications, totalApplications] = await Promise.all([
      Application.find(filter)
        .populate("applicant", "name email")
        .populate({
          path: "job",
          select: "title company location employmentType status recruiter",
          // Defense in depth: omit a populated job unless it belongs to this recruiter.
          match: { recruiter: req.user._id }
        })
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      totalApplications,
      totalPages: Math.ceil(totalApplications / limitNum),
      currentPage: pageNum,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// Get one application, including the applicant, resume, job, and status history.
const getRecruiterApplicationById = async (req, res, next) => {
  try {
    const application = await findRecruiterApplication(
      req.params.applicationId,
      req.user._id
    );

    // Return 404 for another recruiter's application so its existence is not exposed.
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    await application.populate([
      {
        path: "applicant",
        select: "name email professionalTitle phone location bio skills education experience"
      },
      {
        path: "job",
        select: "title description company location employmentType salary skills experience deadline status"
      },
      {
        path: "statusHistory.changedBy",
        select: "name email role"
      }
    ]);

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};

// Change an application's status and record the recruiter and timestamp.
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}`
      });
    }

    const application = await findRecruiterApplication(
      req.params.applicationId,
      req.user._id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (application.status === status) {
      return res.status(400).json({
        success: false,
        message: `Application is already ${status}`
      });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedBy: req.user._id
    });
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application
    });
  } catch (error) {
    next(error);
  }
};

// Aggregate the authenticated recruiter's applications for dashboard use.
const getRecruiterApplicationStatistics = async (req, res, next) => {
  try {
    const recruiterJobs = await Job.find({ recruiter: req.user._id }).select("_id");
    const jobIds = recruiterJobs.map((job) => job._id);

    const groupedStats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statistics = APPLICATION_STATUSES.reduce((totals, status) => {
      totals[status] = 0;
      return totals;
    }, {});

    groupedStats.forEach(({ _id, count }) => {
      statistics[_id] = count;
    });

    res.status(200).json({
      success: true,
      totalApplications: Object.values(statistics).reduce((sum, count) => sum + count, 0),
      statistics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getRecruiterApplications,
  getRecruiterApplicationById,
  updateApplicationStatus,
  getRecruiterApplicationStatistics
};
