import { Link } from "react-router-dom";

const RecentJobs = ({ jobs }) => (
  <section className="recent-applications recent-jobs">
    <div className="dashboard-section-heading">
      <div>
        <p className="eyebrow">Your latest openings</p>
        <h2>Recent Jobs</h2>
      </div>
      <Link to="/recruiter/jobs" className="text-link">
        Manage jobs <span aria-hidden="true">→</span>
      </Link>
    </div>
    {jobs.length ? (
      <div className="recruiter-jobs-list">
        {jobs.map((job, index) => (
          <article
            className="recruiter-job-card"
            key={job._id || `job-${index}`}
          >
            <div>
              <h3>{job.title || "Untitled job"}</h3>
              <p>
                {job.applicantCount ?? 0} applicant
                {job.applicantCount === 1 ? "" : "s"}
              </p>
            </div>
            <span className={`job-status job-status-${job.status || "active"}`}>
              {job.status || "active"}
            </span>
          </article>
        ))}
      </div>
    ) : (
      <div className="dashboard-empty">
        <h3>No jobs posted yet</h3>
        <p>Create your first opening to start building a candidate pipeline.</p>
      </div>
    )}
  </section>
);

export default RecentJobs;
