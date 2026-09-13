import { Link } from "react-router-dom";

const statusLabels = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
};

const RecruiterApplicationCard = ({ application }) => {
  const applicant = application.applicant || {};
  const job = application.job || {};
  const status = application.status || "applied";

  return (
    <article className="recruiter-application-card">
      <div>
        <h3>{applicant.name || "Applicant"}</h3>
        <p>{applicant.email || "Email unavailable"}</p>
      </div>
      <div>
        <span className="recruiter-application-job">
          {job.title || "Job title unavailable"}
        </span>
        <span className={`dashboard-status dashboard-status-${status}`}>
          <span aria-hidden="true" />
          {statusLabels[status] || "Applied"}
        </span>
      </div>
      <Link to="/recruiter/applications" className="text-link">
        Review <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
};

export default RecruiterApplicationCard;
