import { useState } from "react";
import api from "../../services/api";

const ApplicantDetails = ({ application, onClose }) => {
  const applicant = application.applicant || {};
  const resume = application.resume;
  const [loadingResume, setLoadingResume] = useState(false);

  const handleViewResume = async () => {
    try {
      setLoadingResume(true);

      const response = await api.get(
        `/applications/${application._id}/resume`
      );

      window.open(response.data.url, "_blank");
    } catch (error) {
      console.error("Failed to open resume:", error);

      alert(
        error.response?.data?.message ||
          "Unable to open resume. Please try again."
      );
    } finally {
      setLoadingResume(false);
    }
  };

  return (
    <div className="applicant-details-panel">
      <div className="applicant-details-heading">
        <div>
          <p className="eyebrow">Candidate profile</p>
          <h2>{applicant.name || "Applicant"}</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close applicant details"
        >
          ×
        </button>
      </div>

      <div className="applicant-details-grid">
        <div>
          <span>Email</span>
          <strong>{applicant.email || "Not provided"}</strong>
        </div>

        <div>
          <span>Phone</span>
          <strong>{applicant.phone || "Not provided"}</strong>
        </div>

        <div>
          <span>Location</span>
          <strong>{applicant.location || "Not provided"}</strong>
        </div>

        <div>
          <span>Professional title</span>
          <strong>
            {applicant.professionalTitle || "Not provided"}
          </strong>
        </div>
      </div>

      <div className="applicant-detail-section">
        <span>Skills</span>

        <p>
          {Array.isArray(applicant.skills) && applicant.skills.length
            ? applicant.skills.join(" • ")
            : "Not provided"}
        </p>
      </div>

      <div className="applicant-detail-section">
        <span>Cover letter</span>

        <p>
          {application.coverletter || "No cover letter provided."}
        </p>
      </div>

      {resume?.publicId && (
        <button
          type="button"
          className="secondary-button dark-button applicant-resume-link"
          onClick={handleViewResume}
          disabled={loadingResume}
        >
          {loadingResume ? "Opening Resume..." : "View / Download Resume"}
        </button>
      )}
    </div>
  );
};

export default ApplicantDetails;
