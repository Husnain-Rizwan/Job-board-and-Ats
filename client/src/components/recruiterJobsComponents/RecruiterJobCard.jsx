import { Link } from "react-router-dom";

const RecruiterJobCard = ({ job, onEdit, onToggleStatus, changing }) => {
  const companyName = job.company?.name || "Company";
  const isActive = job.status === "active";

  return (
    <article className="management-job-card">
      <div className="management-job-main">
        <div className="management-company-mark">
          {companyName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{job.title}</h2>
          <p>
            {companyName} <span>•</span> {job.location}
          </p>
          <div className="management-job-meta">
            <span>{job.employmentType}</span>
            <span className={`job-status job-status-${job.status}`}>
              {job.status}
            </span>
          </div>
        </div>
      </div>
      <div className="management-job-actions">
        <button type="button" disabled={changing} onClick={() => onEdit(job)}>
          Edit
        </button>
        <Link to={`/recruiter/jobs/${job._id}/applications`}>Applicants</Link>
        <button type="button" disabled={changing} onClick={() => onToggleStatus(job)}>
          {changing ? "Updating..." : isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
    </article>
  );
};

export default RecruiterJobCard;
