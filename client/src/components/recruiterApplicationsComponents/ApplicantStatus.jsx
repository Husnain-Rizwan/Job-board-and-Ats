const recruiterStatuses = ["shortlisted", "interview", "selected", "rejected"];
const labels = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
};

const ApplicantStatus = ({ status, onChange, updating }) => {
  const currentStatus = status || "applied";
  const options = currentStatus === "applied"
    ? ["applied", ...recruiterStatuses]
    : recruiterStatuses;

  return (
    <select
      className={`applicant-status-select applicant-status-${currentStatus}`}
      value={currentStatus}
      onChange={(event) => onChange(event.target.value)}
      disabled={updating}
    >
      {options.map((option) => (
        <option key={option} value={option} disabled={option === "applied"}>
          {labels[option]}
        </option>
      ))}
    </select>
  );
};

export default ApplicantStatus;
