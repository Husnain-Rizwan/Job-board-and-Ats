import { Link } from "react-router-dom";
import ApplicationStatus from "./ApplicationStatus";
import CompanyLogo from "../CompanyLogo";

const formatAppliedDate = (date) => {
  if (!date) return "Date unavailable";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

const ApplicationCard = ({ application }) => {
  const job = application.job || {};
  const company = typeof job.company === "object" ? job.company : null;
  const companyName = company?.name || job.company || "Company";
  const jobId = job._id || job.id;

  return (
    <article className="application-card">
      <div className="application-card-top">
        <CompanyLogo company={company} name={companyName} className="application-company-mark" />
        <div>
          <h2>{job.title || "Job title unavailable"}</h2>
          <p>{companyName}</p>
        </div>
      </div>
      <div className="application-job-meta">
        <span>{job.location || "Location unavailable"}</span>
        <span>{job.employmentType || "Employment type unavailable"}</span>
      </div>
      <div className="application-card-bottom">
        <div>
          <span className="application-label">Applied</span>
          <strong>
            {formatAppliedDate(application.appliedAt || application.createdAt)}
          </strong>
        </div>
        <div>
          <span className="application-label">Status</span>
          <ApplicationStatus status={application.status} />
        </div>
        <Link to={jobId ? `/jobs/${jobId}` : "/jobs"} className="text-link">
          View Job <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

export default ApplicationCard;
