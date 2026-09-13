const statItems = [
  ["totalApplications", "Applications"],
  ["shortlisted", "Shortlisted"],
  ["interviews", "Interviews"],
  ["selected", "Selected"],
];

const ApplicationStats = ({ stats }) => (
  <section className="dashboard-stats" aria-label="Application statistics">
    {statItems.map(([key, label]) => (
      <div className="dashboard-stat" key={key}>
        <strong>{stats[key] ?? 0}</strong>
        <span>{label}</span>
      </div>
    ))}
  </section>
);

export default ApplicationStats;
