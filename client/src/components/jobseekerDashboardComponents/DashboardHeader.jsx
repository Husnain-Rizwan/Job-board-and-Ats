const DashboardHeader = ({ user }) => (
  <header className="dashboard-header">
    <div>
      <p className="eyebrow">Your career space</p>
      <h1>Jobseeker Dashboard</h1>
      <p>
        Welcome back, {user?.name || "there"}. Keep your next opportunity in
        view.
      </p>
    </div>
  </header>
);

export default DashboardHeader;
