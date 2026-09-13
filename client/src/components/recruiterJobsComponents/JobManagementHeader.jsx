const JobManagementHeader = ({ onCreate }) => (
  <header className="management-header">
    <div>
      <p className="eyebrow">Your hiring workspace</p>
      <h1>My Jobs</h1>
      <p>Manage your openings and keep every hiring process moving.</p>
    </div>
    <button
      type="button"
      className="secondary-button dark-button"
      onClick={onCreate}
    >
      + Create Job
    </button>
  </header>
);

export default JobManagementHeader;
