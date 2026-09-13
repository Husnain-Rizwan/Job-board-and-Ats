import { Link } from "react-router-dom";

const JobManagementHeader = () => (
  <header className="management-header">
    <div>
      <p className="eyebrow">Your hiring workspace</p>
      <h1>My Jobs</h1>
      <p>Manage your openings and keep every hiring process moving.</p>
    </div>
    <Link
      to="/recruiter/jobs/create"
      className="secondary-button dark-button"
    >
      + Create Job
    </Link>
  </header>
);

export default JobManagementHeader;
