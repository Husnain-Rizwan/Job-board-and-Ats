import { Link } from "react-router-dom";
import ApplicationStatus from "./ApplicationStatus";
import CompanyLogo from "../CompanyLogo";

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
};

const ApplicationCard = ({ application }) => {
  const job = application.job || {};
  const companyName = job.company?.name || job.company || "Company";
  const jobId = job._id;

  return (
    <article className="dashboard-application-card">
      <div className="dashboard-application-main">
        <CompanyLogo company={typeof job.company === "object" ? job.company : null} name={companyName} className="dashboard-company-mark" />
        <div>
          <h3>{job.title || "Job title unavailable"}</h3>
          <p>{companyName}</p>
          <div className="dashboard-job-meta">
            <span>{job.location || "Location unavailable"}</span>
            <span>{job.employmentType || "Employment type unavailable"}</span>
          </div>
        </div>
      </div>
      <div className="dashboard-application-details">
        <div>
          <span>Applied</span>
          <strong>
            {formatDate(application.appliedAt || application.createdAt)}
          </strong>
        </div>
        <div>
          <span>Status</span>
          <ApplicationStatus status={application.status} />
        </div>
        {jobId && (
          <Link to={`/jobs/${jobId}`} className="text-link">
            View Job <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </article>
  );
};

export default ApplicationCard;
