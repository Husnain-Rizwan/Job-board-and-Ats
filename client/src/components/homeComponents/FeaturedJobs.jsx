import { Link } from "react-router-dom";
import CompanyLogo from "../CompanyLogo";

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

const tones = ["teal", "lavender", "gold", "blue", "coral", "mint"];

const formatSalary = (salary) => {
  if (!salary || typeof salary.min !== "number") return "Salary not specified";
  const currency = salary.currency || "PKR";
  if (salary.max == null) return `${salary.min.toLocaleString()}+ ${currency}`;
  return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${currency}`;
};

const postedLabel = (createdAt) => {
  const days = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000));
  if (days === 0) return "today";
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const FeaturedJobs = ({ jobs, loading, error }) => (
  <section className="featured-section">
    <div className="section-shell">
      <div className="section-heading row-heading">
        <div>
          <p className="eyebrow">Fresh opportunities</p>
          <h2>Latest job opportunities</h2>
        </div>
        <Link to="/jobs" className="text-link">
          View All Jobs <ArrowIcon />
        </Link>
      </div>
      <div className="job-grid">
        {loading ? <p className="home-jobs-message">Loading latest opportunities...</p> : error ? <p className="home-jobs-message">{error}</p> : jobs.length === 0 ? <p className="home-jobs-message">No active jobs available yet.</p> : jobs.map((job, index) => (
          <article className="job-card" key={job._id}>
            <Link to={`/jobs/${job._id}`} className="job-card-link">
              <CompanyLogo company={job.company} className={`company-mark ${tones[index % tones.length]}`} />
              <p className="company-name">
                {job.company?.name || "Company"}
                <span className="verified">&#10003;</span>
              </p>
              <h3>{job.title}</h3>
              <div className="job-meta">
                <span>
                  <PinIcon />
                  {job.location}
                </span>
                <span className="work-type">
                  <span>◆</span>
                  {job.employmentType}
                </span>
              </div>
              <p className="salary">{formatSalary(job.salary)}</p>
              <div className="skills">
                {(job.skills || []).slice(0, 3).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </Link>
            <div className="job-bottom">
              <span>Posted {postedLabel(job.createdAt)}</span>
              <Link to={`/jobs/${job._id}`} className="text-link">
                View role <ArrowIcon />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedJobs;
