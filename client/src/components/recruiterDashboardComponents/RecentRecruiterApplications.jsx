import { Link } from "react-router-dom";
import RecruiterApplicationCard from "./RecruiterApplicationCard";

const RecentRecruiterApplications = ({ applications }) => (
  <section className="recent-applications recruiter-recent-applications">
    <div className="dashboard-section-heading">
      <div>
        <p className="eyebrow">Latest candidate activity</p>
        <h2>Recent Applications</h2>
      </div>
      <Link to="/recruiter/applications" className="text-link">
        View all <span aria-hidden="true">→</span>
      </Link>
    </div>
    {applications.length ? (
      <div className="recruiter-application-list">
        {applications.map((application, index) => (
          <RecruiterApplicationCard
            key={application._id || `application-${index}`}
            application={application}
          />
        ))}
      </div>
    ) : (
      <div className="dashboard-empty">
        <h3>No applications yet</h3>
        <p>Applications for your jobs will appear here.</p>
      </div>
    )}
  </section>
);

export default RecentRecruiterApplications;
