import ApplicantStatus from "./ApplicantStatus";

const ApplicantCard = ({ application, onStatusChange, onView, updating }) => {
  const applicant = application.applicant || {};
  const job = application.job || {};
  const appliedDate = application.appliedAt || application.createdAt;
  const formattedDate = appliedDate
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(appliedDate))
    : "Date unavailable";

  return (
    <article className="applicant-card">
      <div className="applicant-card-main">
        <div className="applicant-avatar">
          {(applicant.name || "A").charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{applicant.name || "Applicant"}</h2>
          <p>{applicant.email || "Email unavailable"}</p>
          <span className="applicant-job-name">
            {job.title || "Job title unavailable"}
          </span>
        </div>
      </div>
      <div className="applicant-card-meta">
        <div>
          <span>Applied</span>
          <strong>{formattedDate}</strong>
        </div>
        <div>
          <span>Status</span>
          <ApplicantStatus
            status={application.status}
            onChange={(status) => onStatusChange(application._id, status)}
            updating={updating === application._id}
          />
        </div>
      </div>
      <button
        type="button"
        className="applicant-view-button"
        onClick={() => onView(application._id)}
      >
        View details
      </button>
    </article>
  );
};

export default ApplicantCard;
