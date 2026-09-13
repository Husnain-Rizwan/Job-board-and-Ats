import { Link } from "react-router-dom";
import ApplicationCard from "./ApplicationCard";

const RecentApplications = ({ applications }) => (
  <section className="recent-applications">
    <div className="dashboard-section-heading">
      <div>
        <p className="eyebrow">Keep track of your progress</p>
        <h2>Recent Applications</h2>
      </div>
      <Link to="/applications" className="text-link">
        View all <span aria-hidden="true">→</span>
      </Link>
    </div>
    {applications.length ? (
      <div className="dashboard-application-list">
        {applications.slice(0, 3).map((application, index) => (
          <ApplicationCard
            key={application._id || `application-${index}`}
            application={application}
          />
        ))}
      </div>
    ) : (
      <div className="dashboard-empty">
        <h3>No applications yet</h3>
        <p>Start exploring jobs to see your applications here.</p>
        <Link to="/jobs" className="secondary-button dark-button">
          Find Jobs
        </Link>
      </div>
    )}
  </section>
);

export default RecentApplications;
