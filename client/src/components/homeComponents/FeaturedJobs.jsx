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

const FeaturedJobs = ({ jobs }) => (
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
        {jobs.map((job) => (
          <article className="job-card" key={job.id}>
            <Link to={`/jobs/${job.id}`} className="job-card-link">
              <div className={`company-mark ${job.tone}`}>{job.mark}</div>
              <p className="company-name">
                {job.company}
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
                  {job.type}
                </span>
              </div>
              <p className="salary">{job.salary}</p>
              <div className="skills">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </Link>
            <div className="job-bottom">
              <span>Posted {job.posted}</span>
              <Link to={`/jobs/${job.id}`} className="text-link">
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
