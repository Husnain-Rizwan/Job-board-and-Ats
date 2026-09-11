import ApplicationCard from "./ApplicationCard";

const ApplicationList = ({ applications }) => (
  <section className="applications-list-section"><div className="applications-list-heading"><div><p className="eyebrow">Your career journey</p><h2>My Applications</h2></div><span>{applications.length} application{applications.length === 1 ? "" : "s"}</span></div>{applications.length ? <div className="applications-list">{applications.map((application, index) => <ApplicationCard key={application._id || `application-${index}`} application={application} />)}</div> : <div className="applications-empty"><h3>No applications yet</h3><p>Applications you submit will appear here.</p><a href="/jobs" className="secondary-button dark-button">Find Jobs</a></div>}</section>
);

export default ApplicationList;
