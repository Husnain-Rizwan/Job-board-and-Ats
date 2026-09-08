const dotenv = require("dotenv");
dotenv.config(); // Must be called before any other require that reads process.env

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes")
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes")
const applicationRoutes = require("./routes/applicationRoutes")

const connectDB = require("./config/db");

const User = require("./models/User");
const Company = require("./models/Company");
const Job = require("./models/Job");
const Application = require("./models/Application");
const SavedJob = require("./models/SavedJob");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/savedJobs", savedJobRoutes);
app.use("/api/applications", applicationRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "Job Board API is running"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
};

startServer();