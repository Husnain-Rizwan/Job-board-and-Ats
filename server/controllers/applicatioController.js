const Application = require("../models/Application");
const Job = require("../models/Job");
const mongoose = require("mongoose");

const APPLICATION_STATUSES = [
  "applied",
  "shortlisted",
  "interview",
  "selected",
  "rejected"
];

// Returns an application only when its job belongs to the logged-in recruiter.
const findRecruiterApplication = async (applicationId, recruiterId) => {

  // Check whether applicationId is a valid MongoDB ObjectId
  if (!mongoose.isValidObjectId(applicationId)) {
    return null;
  }

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


// ======================================================
// CREATE APPLICATION
// ======================================================

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
    const cloudinary = require("../config/cloudinary");

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


// ======================================================
// STEP 1 — GET RECRUITER APPLICATIONS
// ======================================================

const getRecruiterApplications = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      jobId
    } = req.query;

    const pageNum = Math.max(
      1,
      parseInt(page, 10) || 1
    );

    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 10)
    );

    const skip = (pageNum - 1) * limitNum;

    let jobIds;

    // --------------------------------------------------
    // If recruiter requested a specific job
    // --------------------------------------------------

    if (jobId) {

      // Invalid MongoDB ObjectId
      if (!mongoose.isValidObjectId(jobId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID"
        });
      }

      // Check that this job actually belongs to
      // the authenticated recruiter.
      const job = await Job.findOne({
        _id: jobId,
        recruiter: req.user._id
      }).select("_id");

      // Job doesn't belong to this recruiter
      if (!job) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access applications for this job"
        });
      }

      jobIds = [job._id];

    } else {

      // --------------------------------------------------
      // No specific job requested
      // Return applications from all recruiter's jobs
      // --------------------------------------------------

      const recruiterJobs = await Job.find({
        recruiter: req.user._id
      }).select("_id");

      jobIds = recruiterJobs.map((job) => job._id);
    }


    // --------------------------------------------------
    // Build application filter
    // --------------------------------------------------

    const filter = {
      job: { $in: jobIds }
    };

    // Validate status if provided
    if (status) {

      if (!APPLICATION_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}`
        });
      }

      filter.status = status;
    }


    // --------------------------------------------------
    // Get applications + total count
    // --------------------------------------------------

    const [applications, totalApplications] = await Promise.all([

      Application.find(filter)
        .populate(
          "applicant",
          "name email"
        )
        .populate({
          path: "job",
          select:
            "title company location employmentType status recruiter",
          match: {
            recruiter: req.user._id
          }
        })
        .sort({
          appliedAt: -1
        })
        .skip(skip)
        .limit(limitNum),

      Application.countDocuments(filter)
    ]);


    // --------------------------------------------------
    // IMPORTANT:
    // Zero applications is NOT an error.
    // Return 200 with an empty array.
    // --------------------------------------------------

    res.status(200).json({
      success: true,
      count: applications.length,
      totalApplications,
      totalPages: Math.ceil(
        totalApplications / limitNum
      ),
      currentPage: pageNum,
      applications
    });

  } catch (error) {
    next(error);
  }
};


// ======================================================
// STEP 2 — GET SINGLE APPLICATION
// ======================================================

const getRecruiterApplicationById = async (req, res, next) => {
  try {

    const application = await findRecruiterApplication(
      req.params.applicationId,
      req.user._id
    );

    // Application doesn't exist OR
    // application belongs to another recruiter's job
    if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found or you are not authorized to modify it"
    });
}

    await application.populate([
      {
        path: "applicant",
        select:
          "name email professionalTitle phone location bio skills education experience"
      },
      {
        path: "job",
        select:
          "title description company location employmentType salary skills experience deadline status"
      },
      {
        path: "statusHistory.changedBy",
        select:
          "name email role"
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


// ======================================================
// STEP 3, 4 & 5 — UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus = async (req, res, next) => {
  try {

    const { status } = req.body;

    // --------------------------------------------------
    // Validate new status
    // --------------------------------------------------

    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          `Status must be one of: ${APPLICATION_STATUSES.join(", ")}`
      });
    }


    // --------------------------------------------------
    // Find application belonging to this recruiter
    // --------------------------------------------------

    const application = await findRecruiterApplication(
      req.params.applicationId,
      req.user._id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found or you are not authorized to modify it"
      });
    }


    // --------------------------------------------------
    // Prevent same status
    // --------------------------------------------------

    if (application.status === status) {
      return res.status(400).json({
        success: false,
        message:
          `Application is already ${status}`
      });
    }


    // --------------------------------------------------
    // STEP 4 — Update current status
    // --------------------------------------------------

    application.status = status;


    // --------------------------------------------------
    // STEP 5 — Add status history
    // --------------------------------------------------

    application.statusHistory.push({
      status,
      changedBy: req.user._id
    });


    await application.save();


    res.status(200).json({
      success: true,
      message:
        "Application status updated successfully",
      application
    });

  } catch (error) {
    next(error);
  }
};


// ======================================================
// STEP 6 — APPLICATION STATISTICS
// ======================================================

const getRecruiterApplicationStatistics = async (
  req,
  res,
  next
) => {
  try {

    // Get only this recruiter's jobs
    const recruiterJobs = await Job.find({
      recruiter: req.user._id
    }).select("_id");

    const jobIds = recruiterJobs.map(
      (job) => job._id
    );


    // Group applications by status
    const groupedStats = await Application.aggregate([
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


    // Initialize every status with 0
    const statistics = APPLICATION_STATUSES.reduce(
      (totals, status) => {
        totals[status] = 0;
        return totals;
      },
      {}
    );


    // Insert actual counts
    groupedStats.forEach(
      ({ _id, count }) => {
        statistics[_id] = count;
      }
    );


    // Calculate total applications
    const totalApplications =
      Object.values(statistics).reduce(
        (sum, count) => sum + count,
        0
      );


    res.status(200).json({
      success: true,
      totalApplications,
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