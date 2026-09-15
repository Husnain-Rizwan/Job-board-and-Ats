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

        industry: {
          type: String,
          default: null,
          trim: true,
          maxlength: 100
        },

        logo: {
            type: String,
            default: null
        },

        website: {
          type: String,
          default: null,
          trim: true,
          validate: {
            validator: (value) => !value || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value),
            message: "Website must be a valid URL starting with http:// or https://"
          }
        },

        location: {
          type: String,
          required: true,
          trim: true
        },

        recruiter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          unique: true
        },

        recruiters: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }],
    },
    {
        timestamps: true
    }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
