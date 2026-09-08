const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        job: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
          required: true
        },

        resume: {
          url: {
            type: String,
            default: null
          },

          filename: {
            type: String,
            default: null
          }
        },

        coverletter: {
          type: String,
          trim: true,
          maxLength: 3000,
          default: null
        },

        status: {
          type: String,
          enum: [
            "applied",
            "shortlisted",
            "interview",
            "selected",
            "rejected"
          ],
          default: "applied"
        },

         statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        "applied",
                        "shortlisted",
                        "interview",
                        "selected",
                        "rejected"
                    ],
                    required: true
                },

                changedAt: {
                    type: Date,
                    default: Date.now
                },

                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            }
        ],

        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    { applicant: 1, job: 1 },
    { unique: true }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

module.exports = Application;