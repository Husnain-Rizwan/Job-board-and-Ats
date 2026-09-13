const statusLabels = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
};

const ApplicationStatus = ({ status }) => (
  <span className={`dashboard-status dashboard-status-${status || "applied"}`}>
    <span aria-hidden="true" />
    {statusLabels[status] || "Applied"}
  </span>
);

export default ApplicationStatus;
