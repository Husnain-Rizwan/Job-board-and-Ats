const statItems = [
  ["totalJobs", "Total Jobs"],
  ["activeJobs", "Active Jobs"],
  ["totalApplications", "Applications"],
  ["interviews", "Interviews"],
];

const RecruiterStats = ({ stats }) => (
  <section
    className="dashboard-stats recruiter-stats"
    aria-label="Recruiter statistics"
  >
    {statItems.map(([key, label]) => (
      <div className="dashboard-stat" key={key}>
        <strong>{stats[key] ?? 0}</strong>
        <span>{label}</span>
      </div>
    ))}
  </section>
);

export default RecruiterStats;
