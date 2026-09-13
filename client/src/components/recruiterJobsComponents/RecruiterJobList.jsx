import RecruiterJobCard from "./RecruiterJobCard";

const RecruiterJobList = ({ jobs, onEdit, onToggleStatus, changingJobId }) => (
  <section className="management-list">
    {jobs.length ? (
      jobs.map((job, index) => (
        <RecruiterJobCard
          key={job._id || `job-${index}`}
          job={job}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          changing={changingJobId === job._id}
        />
      ))
    ) : (
      <div className="management-empty">
        <h2>No jobs posted yet</h2>
        <p>Create your first opening to start receiving applications.</p>
      </div>
    )}
  </section>
);

export default RecruiterJobList;
