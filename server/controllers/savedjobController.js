const SavedJob  = require("../models/SavedJob");

// create savedJob by /api/savedJob/:jobId
const createSavedJob = async (req, res) => {
  try{
    const { jobId } = req.params;
    const userId = req.user._id;

    const savedJob = await SavedJob.create({
      user: userId,
      job: jobId
    });

    res.status(200).json({
      success: true,
      message: "job was saved succesfully",
      savedJob
    })

  }catch(error){
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Job is already saved"
      });
    }
  }
};

// delet savedJob
const deleteSavedJob = async (req, res, next) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      user: req.user._id,
      job: req.params.jobId
    });

    if (!savedJob) {
      return res.status(404).json({
        message: "Saved job not found"
      });
    }

    res.status(200).json({
      message: "Job was deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}; 

// Get savedJoba by /api/savedJobs
const getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const savedJobs = await SavedJob.find({
      user: userId
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      savedJobs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSavedJob,
  deleteSavedJob,
  getSavedJobs
};

