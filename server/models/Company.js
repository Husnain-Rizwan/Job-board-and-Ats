const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: 2000
        },

        logo: {
            type: String,
            default: null
        },

        website: {
          type: String,
          default: null,
          trim: true
        },

        location: {
          type: String,
          required: true,
          trim: true
        },

        recruiter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
    },
    {
        timestamps: true
    }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;