const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 5000
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    employmentType: {
      type: String,
      required: true,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Temporary",
      ]
    },

    category: {
      type: String,
      enum: [
        "Software Development",
        "Design",
        "Data & Analytics",
        "Mobile Development",
        "Marketing",
        "Business & Finance",
        "Cybersecurity",
        "DevOps & Cloud",
        "Other"
      ],
      default: "Other"
    },

    salary: {
      min: {
        type: Number,
        min: 0,
        required: true
      },

      max: {
        type: Number,
        min: 0,
        default: null
      },

      currency: {
        type: String,
        default: "PKR",
        trim: true,
        uppercase: true
      }
    },

    skills: {
      type: [String],
      required: true,
      default: []
    },

    experience: {
      min: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      },

      max: {
        type: Number,
        required: true,
        min: 0,
        default: null
      }
    },

    deadline: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: [
        "active",
        "inactive"
      ],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
