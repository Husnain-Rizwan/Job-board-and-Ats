const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Basic account information
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        // System role
        role: {
            type: String,
            enum: ["jobseeker", "recruiter", "admin"],
            default: "jobseeker"
        },

        // Professional information
        professionalTitle: {
            type: String,
            trim: true,
            maxlength: 100
        },

        phone: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true,
            maxlength: 100
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        skills: {
            type: [String],
            default: []
        },

        education: {
            type: String,
            trim: true,
            maxlength: 500
        },

        experience: {
            type: String,
            trim: true,
            maxlength: 500
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
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;