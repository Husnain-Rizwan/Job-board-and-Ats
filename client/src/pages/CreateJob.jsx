import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "Full-time",
    category: "Software Development",
    skills: "",
    salaryMin: "",
    salaryMax: "",
    currency: "PKR",
    experienceMin: "0",
    experienceMax: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Process comma-separated skills string into an array if necessary
      const formattedSkills = formData.skills
        ? formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        employmentType: formData.employmentType,
        category: formData.category,
        skills: formattedSkills,
        salary: {
          min: Number(formData.salaryMin),
          max: formData.salaryMax === "" ? null : Number(formData.salaryMax),
          currency: formData.currency,
        },
        experience: {
          min: Number(formData.experienceMin),
          max: formData.experienceMax === "" ? null : Number(formData.experienceMax),
        },
        deadline: formData.deadline || null,
      };

      await api.post("/jobs", payload);

      // Navigate back to recruiter jobs on successful creation
      navigate("/recruiter/jobs");
    } catch (err) {
      console.error("Error creating job:", err);
      setError(
        err.response?.data?.message || "Failed to create job opening. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-page recruiter-dashboard-page">
      <div className="section-shell dashboard-shell create-job-shell">
        {/* Header Section */}
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">Recruiter Workspace</p>
            <h1>Post a New Job</h1>
          </div>
          <Link to="/recruiter/jobs" className="secondary-button dark-button">
            Back to Jobs
          </Link>
        </div>

        {/* Form Container */}
        <div className="dashboard-card create-job-card">
          {error && <div className="error-message" style={{ color: "#d9534f", marginBottom: "1rem" }}>{error}</div>}

          <form onSubmit={handleSubmit} className="create-job-form">
            {/* Job Title */}
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                className="form-input"
              />
            </div>

            {/* Location & Employment Type */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. New York, NY or Remote"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="employmentType">Employment Type *</label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
            </div>

            {/* Salary */}
            <div className="form-group">
              <label htmlFor="category">Job Category *</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} className="form-input">
                <option>Software Development</option><option>Design</option><option>Data & Analytics</option><option>Mobile Development</option><option>Marketing</option><option>Business & Finance</option><option>Cybersecurity</option><option>DevOps & Cloud</option><option>Other</option>
              </select>
            </div>

            {/* Salary */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaryMin">Minimum Salary *</label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  min="0"
                  required
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="e.g. 80000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaryMax">Maximum Salary</label>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  min="0"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="Leave blank if open-ended"
                  className="form-input"
                />
              </div>
            </div>

            {/* Currency & Experience */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="currency">Currency *</label>
                <input
                  type="text"
                  id="currency"
                  name="currency"
                  required
                  maxLength="4"
                  value={formData.currency}
                  onChange={handleChange}
                  placeholder="e.g. PKR"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="experienceMin">Minimum Experience (years) *</label>
                <input
                  type="number"
                  id="experienceMin"
                  name="experienceMin"
                  min="0"
                  required
                  value={formData.experienceMin}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experienceMax">Maximum Experience (years) *</label>
                <input type="number" id="experienceMax" name="experienceMax" min="0" required value={formData.experienceMax} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="deadline">Application Deadline</label>
                <input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Required Skills (Comma separated) *</label>
              <input type="text" id="skills" name="skills" required value={formData.skills} onChange={handleChange} placeholder="e.g. React, JavaScript, Node.js, CSS" className="form-input" />
            </div>

            {/* Job Description */}
            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                rows="6"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe role responsibilities, qualifications, and benefits..."
                className="form-input"
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="secondary-button dark-button"
              >
                {loading ? "Posting Job..." : "Publish Job Opening"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateJob;
