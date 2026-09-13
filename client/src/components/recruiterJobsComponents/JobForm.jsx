import { useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  employmentType: "Full-time",
  category: "Software Development",
  salaryMin: "",
  salaryMax: "",
  currency: "PKR",
  experienceMin: "0",
  experienceMax: "",
  skills: "",
  deadline: "",
};

const formFromJob = (job) =>
  job
    ? {
        title: job.title || "",
        description: job.description || "",
        location: job.location || "",
        employmentType: job.employmentType || "Full-time",
        category: job.category || "Other",
        salaryMin: job.salary?.min ?? "",
        salaryMax: job.salary?.max ?? "",
        currency: job.salary?.currency || "PKR",
        experienceMin: job.experience?.min ?? "0",
        experienceMax: job.experience?.max ?? "",
        skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
        deadline: job.deadline ? job.deadline.slice(0, 10) : "",
      }
    : emptyForm;

const JobForm = ({ job, onSubmit, onClose, submitting }) => {
  const [form, setForm] = useState(() => formFromJob(job));

  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      title: form.title,
      description: form.description,
      location: form.location,
      employmentType: form.employmentType,
      category: form.category,
      salary: {
        min: Number(form.salaryMin),
        max: form.salaryMax === "" ? null : Number(form.salaryMax),
        currency: form.currency,
      },
      experience: {
        min: Number(form.experienceMin),
        max: form.experienceMax === "" ? null : Number(form.experienceMax),
      },
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      deadline: form.deadline || null,
    });
  };

  return (
    <div className="job-form-overlay">
      <form className="job-form" onSubmit={submit}>
        <div className="job-form-heading">
          <div>
            <p className="eyebrow">
              {job ? "Update opening" : "Create opening"}
            </p>
            <h2>{job ? "Edit job" : "Create a new job"}</h2>
          </div>
          <button type="button" className="form-close" onClick={onClose}>
            ×
          </button>
        </div>
        <label>
          Job title
          <input name="title" value={form.title} onChange={update} required />
        </label>
        <label>
          Location
          <input
            name="location"
            value={form.location}
            onChange={update}
            required
          />
        </label>
        <div className="form-two-col">
            <label>
              Employment type
            <select
              name="employmentType"
              value={form.employmentType}
              onChange={update}
            >
              {[
                "Full-time",
                "Part-time",
                "Contract",
                "Internship",
                "Temporary",
              ].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={update}>
                <option>Software Development</option><option>Design</option><option>Data & Analytics</option><option>Mobile Development</option><option>Marketing</option><option>Business & Finance</option><option>Cybersecurity</option><option>DevOps & Cloud</option><option>Other</option>
              </select>
            </label>
          <label>
            Currency
            <input
              name="currency"
              value={form.currency}
              onChange={update}
              maxLength="4"
              required
            />
          </label>
        </div>
        <div className="form-two-col">
          <label>
            Minimum salary
            <input
              type="number"
              name="salaryMin"
              value={form.salaryMin}
              onChange={update}
              min="0"
              required
            />
          </label>
          <label>
            Maximum salary
            <input
              type="number"
              name="salaryMax"
              value={form.salaryMax}
              onChange={update}
              min="0"
            />
          </label>
        </div>
        <div className="form-two-col">
          <label>
            Minimum experience
            <input
              type="number"
              name="experienceMin"
              value={form.experienceMin}
              onChange={update}
              min="0"
              required
            />
          </label>
          <label>
            Maximum experience
            <input
              type="number"
              name="experienceMax"
              value={form.experienceMax}
              onChange={update}
              min="0"
            />
          </label>
        </div>
        <label>
          Skills <span className="form-hint">Separate with commas</span>
          <input
            name="skills"
            value={form.skills}
            onChange={update}
            placeholder="React, Node.js, MongoDB"
            required
          />
        </label>
        <label>
          Deadline
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={update}
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={update}
            rows="5"
            required
          />
        </label>
        <div className="job-form-actions">
          <button
            type="button"
            className="light-button secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="dark-button secondary-button"
            disabled={submitting}
          >
            {submitting ? "Saving..." : job ? "Update Job" : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
