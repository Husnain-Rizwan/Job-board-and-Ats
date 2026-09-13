import JobCard from "./JobCard";

const JobList = ({ jobs }) => (
  <section className="job-list-area">
    <div className="job-list-heading">
      <div>
        <p className="eyebrow">Opportunities for you</p>
        <h2>Job Listings</h2>
      </div>
      <span>{jobs.length} roles found</span>
    </div>
    {jobs.length ? (
      <div className="job-list">
        {jobs.map((job, index) => (
          <JobCard key={job._id || job.id || `job-${index}`} job={job} />
        ))}
      </div>
    ) : (
      <div className="jobs-empty">
        <h3>No jobs found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    )}
  </section>
);

export default JobList;
