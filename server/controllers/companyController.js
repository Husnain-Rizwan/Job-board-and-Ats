const Company = require("../models/Company");

// create Company
const createCompany = async( req, res) => {
try{
  const {name, description, logo, website, location } = req.body;

  const company = await Company.create({
    name,
    description, 
    logo, 
    website, 
    location,
    recruiter: req.user._id
  });

  res.status(201).json({
    message: "Compant added successfully",
    company
  });
} catch(error) {
  res.status(500).json({
    message: "error while creating Company",
    error: error.message
  })
};
};

// Get company details
const getCompanyById = async(req, res, next) => {
  try{
    const company = await Company.findById(req.params.id);

    if(!company){
      return res.status(404).json({message: "company not Found"});
    }

    res.status(200).json({
      success: true,
      company
    })

  }catch(error){
    next(error);
  }
};

// update compant details by api endpoint /api/companies/:_id
// PUT /api/companies/:id (Update Company)
const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Authorization check: Ensure logged-in recruiter owns this company profile
    if (company.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this company profile" });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      message: "Company profile updated successfully",
      company
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/companies/:id (Delete Company)
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Authorization check: Ensure logged-in recruiter owns this company profile
    if (company.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this company profile" });
    }

    await company.deleteOne();

    res.status(200).json({
      message: "Company deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany
};