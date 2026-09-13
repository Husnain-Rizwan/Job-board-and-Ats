const RecruiterDashboardHeader = ({ user }) => (
  <header className="dashboard-header recruiter-dashboard-header">
    <div>
      <p className="eyebrow">Your hiring workspace</p>
      <h1>Recruiter Dashboard</h1>
      <p>
        Welcome back, {user?.name || "there"}. Keep your hiring pipeline moving.
      </p>
    </div>
  </header>
);

export default RecruiterDashboardHeader;
