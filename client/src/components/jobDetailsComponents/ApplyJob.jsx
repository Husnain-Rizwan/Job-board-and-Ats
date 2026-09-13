import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ApplyJob = ({ jobId, user, onClose, onSubmitted, onAlreadyApplied }) => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [coverletter, setCoverletter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleResumeChange = async (event) => {
    const selectedResume = event.target.files?.[0];
    if (!selectedResume) return;

    if (
      selectedResume.type !== "application/pdf" &&
      !selectedResume.name.toLowerCase().endsWith(".pdf")
    ) {
      setMessage("Only PDF files are allowed.");
      return;
    }

    try {
      setUploadingResume(true);
      setMessage("");
      const formData = new FormData();
      formData.append("resume", selectedResume);
      const response = await api.post("/applications/upload-resume", formData);
      setResume(response.data?.resume || null);
    } catch (error) {
      console.error(error);
      setResume(null);
      setMessage(
        error.response?.data?.message || "Unable to upload your resume.",
      );
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "jobseeker") {
      setMessage("Only job seekers can apply for jobs.");
      return;
    }

    if (!resume?.url || !resume?.filename) {
      setMessage("Please upload a PDF resume.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      await api.post(`/applications/${jobId}`, { resume, coverletter });
      setSubmitted(true);
      onSubmitted();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) {
        onAlreadyApplied();
        return;
      }
      setMessage(
        error.response?.data?.message || "Unable to submit your application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return null;

  return (
    <div className="apply-job-panel">
      <div className="apply-job-heading">
        <div>
          <p className="eyebrow">Take the next step</p>
          <h2>Apply for this job</h2>
        </div>
        <button
          type="button"
          className="apply-job-close"
          onClick={onClose}
          aria-label="Close application form"
        >
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="apply-file-label">
          Resume
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleResumeChange}
            disabled={uploadingResume || submitting}
          />
        </label>
        {uploadingResume && (
          <p className="selected-file">Uploading resume...</p>
        )}
        {resume?.filename && <p className="selected-file">{resume.filename}</p>}
        <label className="apply-letter-label">
          Cover Letter
          <textarea
            value={coverletter}
            onChange={(event) => setCoverletter(event.target.value)}
            placeholder="Tell the employer why you are a strong fit..."
            rows="6"
            maxLength="3000"
          />
        </label>
        {message && (
          <p className="apply-job-error" role="alert">
            {message}
          </p>
        )}
        <button
          type="submit"
          className="details-apply"
          disabled={submitting || uploadingResume}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyJob;
