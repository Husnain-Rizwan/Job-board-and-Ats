const statuses = [
  "applied",
  "shortlisted",
  "interview",
  "selected",
  "rejected",
];
const labels = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
};

const ApplicantStatus = ({ status, onChange, updating }) => (
  <select
    className={`applicant-status-select applicant-status-${status || "applied"}`}
    value={status || "applied"}
    onChange={(event) => onChange(event.target.value)}
    disabled={updating}
  >
    {statuses.map((option) => (
      <option key={option} value={option}>
        {labels[option]}
      </option>
    ))}
  </select>
);

export default ApplicantStatus;
