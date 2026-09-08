const Job = require("../models/Job");
const Company = require("../models/Company")

// create job by POST /api/jobs/createJob with json data
const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            employmentType,
            skills,
            salary,
            experience,
            deadline
        } = req.body;

        const company = await Company.findOne({
            recruiter: req.user._id
        });

        // check whether recruiter belongs to a company or not
        if(!company) {
          return res.status(404).json({
            message: "company not found",   
          });
        }

        if (company.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to post jobs for this company" });
        }

        const job = await Job.create({
            title,
            description,
            company: company._id,
            recruiter: req.user._id,
            location,
            employmentType,
            skills,
            salary,
            experience,
            deadline,
            status: "active"
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
          message: "error while Creating Job",
          error: error.message
        });
    }
};

// Get All jobs
const getAllJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      employmentType,
      skills,
      experience,
      salary,
      page = 1,
      limit = 10
    } = req.query;

    // Base filter for active jobs
    const filter = {
      status: "active"
    };

    // Keyword search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } }
      ];
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Employment type filter
    if (employmentType) {
      filter.employmentType = employmentType;
    }

    // Skills filter (handles single skill or comma-separated list)
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      filter.skills = { $in: skillsArray.map((s) => new RegExp(s, "i")) };
    }

    // Experience filter - range overlap
if (experience && experience !== "any") {
  let minExp;
  let maxExp;

  switch (experience) {
    case "0-1":
      minExp = 0;
      maxExp = 1;
      break;

    case "1-3":
      minExp = 1;
      maxExp = 3;
      break;

    case "3-5":
      minExp = 3;
      maxExp = 5;
      break;

    case "5-plus":
      minExp = 5;
      break;
  }

    if (minExp !== undefined && maxExp !== undefined) {
        filter["experience.min"] = { $lte: maxExp };
        filter["experience.max"] = { $gte: minExp };
    } else if (minExp !== undefined) {
        filter["experience.max"] = { $gte: minExp };
    }
}


    // Salary filter - range overlap
if (salary && salary !== "any") {
  let minSalary;
  let maxSalary;

  switch (salary) {
    case "under-50000":
      minSalary = 0;
      maxSalary = 50000;
      break;

    case "50000-100000":
      minSalary = 50000;
      maxSalary = 100000;
      break;

    case "100000-150000":
      minSalary = 100000;
      maxSalary = 150000;
      break;

    case "150000-plus":
      minSalary = 150000;
      break;
  }

  if (minSalary !== undefined && maxSalary !== undefined) {
    filter["salary.min"] = { $lte: maxSalary };
    filter["salary.max"] = { $gte: minSalary };
  } else if (minSalary !== undefined) {
    filter["salary.max"] = { $gte: minSalary };
  }
}

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(
    100,
    Math.max(1, parseInt(limit, 10) || 10)
    );
    const skip = (pageNum - 1) * limitNum;

    // Execute query with skip, limit, and population
    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter)
        .populate("company", "name location logo")
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalJobs / limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages,
      currentPage: pageNum,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// Get jobs by id /api/jobs/:id
const getJobById= async(req, res, next) => {
    try{
    const job = await Job.findById(req.params.id);

    if(!job){
        return res.status(404).json({
            message: "job not Found"
        });
    }

    res.status(200).json({
        success: true,
        job
    });
}catch(error){
    next(error);
}
};

// Update job by /api/jobs/:id
const updateJob= async(req, res, next) => {
    try{
    let job = await  Job.findById(req.params.id);

    if(!job){
        return res.status(404).json({
            message: "Job not found"
        });
    }

    if(job.recruiter.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "not authorize to update Job"
        })
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        message: "Job updated successfully",
        job
    });
} catch(error){
    next(error);
}
};

// 5. Change Job Status / Close Job (Recruiter - Creator Only)
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // Expects { "status": "inactive" } or "active"

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ownership check
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to change status of this job" });
    }

    job.status = status;
    await job.save();

    res.status(200).json({ success: true, message: `Job marked as ${status}`, job });
  } catch (error) {
    next(error);
  }
};

// Delete job by /api/jobs/:id
const deleteJob= async(req, res, next) => {
    try{
    let job = await Job.findById(req.params.id);

    if(!job){
        return res.status(404).json({
            message: "Job not found"
        });
    }

    if(job.recruiter.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "not authorize to delete Job"
        })
    }

    await job.deleteOne();

    res.status(200).json({
        message: "Job deleted successfully",
    });
} catch(error){
    next(error);
}
};

module.exports = {
    getAllJobs,
    createJob,
    getJobById,
    updateJob,
    updateJobStatus,
    deleteJob
};