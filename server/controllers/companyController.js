const Company = require("../models/Company");
const Job = require("../models/Job");
const { uploadCompanyLogo } = require("../utils/companyLogoCloudinary");

const companyFields = ["name", "description", "industry", "location", "website"];
const normaliseCompanyData = (data) => {
  const companyData = Object.fromEntries(Object.entries(data).filter(([field]) => companyFields.includes(field)));
  if (companyData.website === "") companyData.website = null;
  return companyData;
};
const companyMemberFilter = (recruiterId) => ({
  $or: [{ recruiter: recruiterId }, { recruiters: recruiterId }],
});

const createCompany = async (req, res, next) => {
  try {
    const existingCompany = await Company.findOne(companyMemberFilter(req.user._id));
    if (existingCompany) return res.status(409).json({ message: "You already have a company profile" });

    const companyData = normaliseCompanyData(req.body);
    const company = await Company.create({ ...companyData, recruiter: req.user._id, recruiters: [req.user._id] });
    if (req.file) {
      const uploadedLogo = await uploadCompanyLogo(req.file, company._id);
      company.logo = uploadedLogo.secure_url;
      await company.save();
    }
    await company.populate("recruiters", "name email professionalTitle phone");
    res.status(201).json({ success: true, message: "Company created successfully", company });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You already have a company profile" });
    next(error);
  }
};

const getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne(companyMemberFilter(req.user._id));
    if (company && !company.recruiters.some((memberId) => memberId.equals(company.recruiter))) {
      company.recruiters.push(company.recruiter);
      await company.save();
    }
    if (company) await company.populate("recruiters", "name email professionalTitle phone");
    res.status(200).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

const updateMyCompany = async (req, res, next) => {
  try {
    const updates = normaliseCompanyData(req.body);
    const company = await Company.findOne(companyMemberFilter(req.user._id));
    if (!company) return res.status(404).json({ message: "Company profile not found" });
    Object.assign(company, updates);
    if (req.file) {
      const uploadedLogo = await uploadCompanyLogo(req.file, company._id);
      company.logo = uploadedLogo.secure_url;
    }
    await company.save();
    await company.populate("recruiters", "name email professionalTitle phone");
    res.status(200).json({ success: true, message: "Company profile updated successfully", company });
  } catch (error) {
    next(error);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).select("name description industry location website logo");
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

const getCompanyJobs = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).select("_id");
    if (!company) return res.status(404).json({ message: "Company not found" });
    const jobs = await Job.find({ company: company._id, status: "active" })
      .select("title location employmentType salary experience skills deadline createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndUpdate({ _id: req.params.id, recruiter: req.user._id }, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ message: "Company not found or not authorized" });
    res.status(200).json({ message: "Company profile updated successfully", company });
  } catch (error) {
    next(error);
  }
};

const addRecruiter = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Recruiter's work email is required" });

    const company = await Company.findOne(companyMemberFilter(req.user._id));
    if (!company) return res.status(404).json({ message: "Company profile not found" });

    const User = require("../models/User");
    const recruiter = await User.findOne({ email, role: "recruiter" });
    if (!recruiter) return res.status(404).json({ message: "No recruiter account exists with this email" });

    const alreadyLinked = await Company.findOne({
      _id: { $ne: company._id },
      ...companyMemberFilter(recruiter._id),
    });
    if (alreadyLinked) return res.status(409).json({ message: "This recruiter is already linked to another company" });

    if (!company.recruiters.some((memberId) => memberId.equals(company.recruiter))) {
      company.recruiters.push(company.recruiter);
    }
    if (!company.recruiters.some((memberId) => memberId.equals(recruiter._id))) {
      company.recruiters.push(recruiter._id);
      await company.save();
    }

    await company.populate("recruiters", "name email professionalTitle phone");
    res.status(200).json({ success: true, message: "Recruiter added to your company", company });
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndDelete({ _id: req.params.id, recruiter: req.user._id });
    if (!company) return res.status(404).json({ message: "Company not found or not authorized" });
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCompany, getMyCompany, updateMyCompany, getCompanyById, getCompanyJobs, updateCompany, deleteCompany, addRecruiter };
