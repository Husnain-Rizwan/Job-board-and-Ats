const statusLabels = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
};

const ApplicationStatus = ({ status }) => (
  <span className={`application-status status-${status || "applied"}`}>
    <span className="status-dot" aria-hidden="true" />
    {statusLabels[status] || "Applied"}
  </span>
);

export default ApplicationStatus;
