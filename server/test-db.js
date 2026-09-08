const dotenv = require("dotenv");
const connectDB = require("./config/db");

const User = require("./models/User");
const Company = require("./models/Company");
const Job = require("./models/Job");
const Application = require("./models/Application");
const SavedJob = require("./models/SavedJob");

dotenv.config();

const testDatabase = async () => {
  try {
    await connectDB();

    console.log("Connected to database");

    // 1. Create User
    const user = await User.create({
      name: "Test Recruiter",
      email: "recruiter@test.com",
      password: "123456",
      role: "recruiter"
    });

    console.log("User created:", user._id);

    // 2. Create Company
    const company = await Company.create({
      name: "Test Technologies",
      description: "A test software company",
      website: "https://example.com",
      location: "Lahore, Pakistan",
      recruiter: user._id
    });

    console.log("Company created:", company._id);

    // 3. Create Job
    const job = await Job.create({
      title: "MERN Stack Developer",
      description: "We are looking for a MERN Stack Developer.",
      company: company._id,
      recruiter: user._id,
      location: "Lahore, Pakistan",
      employmentType: "Full-time",

      salary: {
        min: 80000,
        max: 150000,
        currency: "PKR"
      },

      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB"
      ],

      experience: {
        min: 0,
        max: 2
      },

      status: "active"
    });

    console.log("Job created:", job._id);

    // 4. Create another user who will apply
    const applicant = await User.create({
      name: "Test Applicant",
      email: "applicant@test.com",
      password: "123456",
      role: "jobseeker"
    });

    console.log("Applicant created:", applicant._id);

    // 5. Create Application
    const application = await Application.create({
      applicant: applicant._id,
      job: job._id,

      resume: {
        url: "https://example.com/resume.pdf",
        filename: "Test_Resume.pdf"
      },

      coverLetter: "I am interested in this position.",

      statusHistory: [
        {
          status: "applied",
          changedBy: applicant._id
        }
      ]
    });

    console.log("Application created:", application._id);

    const populatedApplication = await Application
      .findById(application._id)
      .populate("applicant")
      .populate("job");

    console.log("\nPopulated Application:");
    console.log(populatedApplication);

    // 6. Save Job
    const savedJob = await SavedJob.create({
      user: applicant._id,
      job: job._id
    });

    console.log("Saved job created:", savedJob._id);

    console.log("\nAll schema tests passed!");

    await SavedJob.deleteMany({
      user: applicant._id
    });

    await Application.deleteMany({
      applicant: applicant._id
    });

    await Job.findByIdAndDelete(job._id);

    await Company.findByIdAndDelete(company._id);

    await User.deleteMany({
      _id: {
        $in: [user._id, applicant._id]
      }
    });

    process.exit(0);

  } catch (error) {
    console.error("\nTEST FAILED:");
    console.error(error);

    process.exit(1);
  }
};

testDatabase();