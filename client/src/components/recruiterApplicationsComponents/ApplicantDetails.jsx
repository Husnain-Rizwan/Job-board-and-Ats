import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ApplicantDetails = ({ application, onClose }) => {
  const applicant = application.applicant || {};
  const resume = application.resume;
  const statusHistory = Array.isArray(application.statusHistory) ? [...application.statusHistory].sort((first, second) => new Date(second.changedAt || 0) - new Date(first.changedAt || 0)) : [];
  const [loadingResume, setLoadingResume] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const navigate = useNavigate();
  const handleViewResume = async () => {
    try { setLoadingResume(true); setResumeError(""); const response = await api.get(`/applications/${application._id}/resume`); window.open(response.data.url, "_blank"); }
    catch (error) { console.error("Failed to open resume:", error); setResumeError(error.response?.data?.message || "Unable to open resume. Please try again."); }
    finally { setLoadingResume(false); }
  };
  return <div className="applicant-details-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="applicant-details-panel" role="dialog" aria-modal="true" aria-labelledby="applicant-details-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="applicant-details-heading"><div><p className="eyebrow">Candidate profile</p><h2 id="applicant-details-title">{applicant.name || "Applicant"}</h2><p>{applicant.professionalTitle || "Candidate"}</p></div><button type="button" onClick={onClose} aria-label="Close applicant details">×</button></div>
      <div className="applicant-details-grid"><div><span>Email</span><strong>{applicant.email || "Not provided"}</strong></div><div><span>Phone</span><strong>{applicant.phone || "Not provided"}</strong></div><div><span>Location</span><strong>{applicant.location || "Not provided"}</strong></div><div><span>Professional title</span><strong>{applicant.professionalTitle || "Not provided"}</strong></div></div>
      <div className="applicant-detail-section"><span>Skills</span>{Array.isArray(applicant.skills) && applicant.skills.length ? <div className="applicant-skill-list">{applicant.skills.map((skill) => <span key={skill}>{skill}</span>)}</div> : <p>Not provided</p>}</div>
      <div className="applicant-detail-section"><span>Cover letter</span><p>{application.coverletter || "No cover letter provided."}</p></div>
      <div className="applicant-detail-section"><span>Current status</span><strong className="applicant-current-status">{application.status || "applied"}</strong></div>
      <div className="applicant-detail-section applicant-status-history"><span>Status history</span>{statusHistory.length ? <ol>{statusHistory.map((entry, index) => { const changedBy = entry.changedBy || {}; const changedAt = entry.changedAt ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(entry.changedAt)) : "Date unavailable"; return <li key={entry._id || `${entry.status}-${index}`}><strong>{entry.status || "Status updated"}</strong><time>{changedAt}</time><p>Changed by {changedBy.name || "Unknown user"}</p></li>; })}</ol> : <p>No status changes recorded yet.</p>}</div>
      <div className="applicant-details-actions">{resume?.publicId && <button type="button" className="secondary-button dark-button" onClick={handleViewResume} disabled={loadingResume}>{loadingResume ? "Opening resume..." : "View / download resume"}</button>}{applicant._id && <button type="button" className="secondary-button light-button" onClick={() => navigate(`/recruiter/applicants/${applicant._id}`)}>Full profile</button>}</div>
      {resumeError && <p className="applicant-resume-error" role="alert">{resumeError}</p>}
    </section>
  </div>;
};

export default ApplicantDetails;
