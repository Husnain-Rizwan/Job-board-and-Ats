const Application = require("../models/Application");
const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");

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

module.exports = {
  createApplication,
  getRecruiterApplications
};
