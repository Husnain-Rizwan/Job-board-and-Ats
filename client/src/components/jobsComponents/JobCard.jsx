import { Link } from "react-router-dom";

const PinIcon = () => (
  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
    <path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const formatSalary = (salary) => {
  if (!salary) return "Salary not specified";
  if (typeof salary === "string") return salary;
  if (salary.min == null && salary.max == null) return "Salary not specified";
  const currency = salary.currency || "PKR";
  const formatAmount = (amount) => Number(amount).toLocaleString();
  if (salary.max == null) return `${formatAmount(salary.min)}+ ${currency}`;
  if (salary.min == null)
    return `Up to ${formatAmount(salary.max)} ${currency}`;
  return `${formatAmount(salary.min)} - ${formatAmount(salary.max)} ${currency}`;
};

const formatPostedDate = (createdAt) => {
  if (!createdAt) return "Posted date unavailable";

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return "Posted date unavailable";

  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - createdDate.getTime()) / 1000),
  );
  if (elapsedSeconds < 60) return "Posted just now";

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60)
    return `Posted ${elapsedMinutes} minute${elapsedMinutes === 1 ? "" : "s"} ago`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24)
    return `Posted ${elapsedHours} hour${elapsedHours === 1 ? "" : "s"} ago`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 7)
    return `Posted ${elapsedDays} day${elapsedDays === 1 ? "" : "s"} ago`;

  const elapsedWeeks = Math.floor(elapsedDays / 7);
  return `Posted ${elapsedWeeks} week${elapsedWeeks === 1 ? "" : "s"} ago`;
};

const JobCard = ({ job }) => {
  const jobId = job._id;
  const companyName = job.company?.name || job.company || "Company";
  const companyLogo = job.company?.logo;
  const companyMark = companyName?.charAt(0).toUpperCase() || "J";
  const skills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <article className="listing-job-card">
      <Link to={`/jobs/${jobId}`} className="listing-job-main">
        <div className="company-mark listing-company-mark">
          {companyLogo ? (
            <img src={companyLogo} alt={`${companyName} logo`} />
          ) : (
            companyMark
          )}
        </div>
        <p className="company-name">
          {companyName}
          <span className="verified">&#10003;</span>
        </p>
        <h2>{job.title}</h2>
        <div className="listing-meta">
          <span>
            <PinIcon />
            {job.location || "Location not specified"}
          </span>
          <span>
            <strong>◆</strong>
            {job.employmentType || "Employment type not specified"}
          </span>
          <span>
            <strong>◈</strong>
            {formatSalary(job.salary)}
          </span>
        </div>
        <div className="skills">
          {skills.map((skill, index) => (
            <span key={`${skill}-${index}`}>{skill}</span>
          ))}
        </div>
      </Link>
      <div className="listing-job-footer">
        <span>{formatPostedDate(job.createdAt)}</span>
        <Link to={`/jobs/${jobId}`} className="text-link">
          View Job <ArrowIcon />
        </Link>
      </div>
    </article>
  );
};

export default JobCard;
