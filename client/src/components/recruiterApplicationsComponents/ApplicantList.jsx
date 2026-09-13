import ApplicantCard from "./ApplicantCard";

const ApplicantList = ({ applications, onStatusChange, onView, updating }) =>
  applications.length ? (
    <div className="applicant-list">
      {applications.map((application, index) => (
        <ApplicantCard
          key={application._id || `applicant-${index}`}
          application={application}
          onStatusChange={onStatusChange}
          onView={onView}
          updating={updating}
        />
      ))}
    </div>
  ) : (
    <div className="applicants-empty">
      <h2>No applicants yet</h2>
      <p>Applications for this job will appear here.</p>
    </div>
  );

export default ApplicantList;
