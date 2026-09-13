import { Link } from "react-router-dom";

const RecruiterQuickActions = () => (
  <section className="quick-actions recruiter-quick-actions">
    <div>
      <p className="eyebrow">Keep hiring moving</p>
      <h2>Build your next great team.</h2>
    </div>
    <div>
      <Link
        to="/recruiter/jobs/create"
        className="secondary-button dark-button"
      >
        Post a Job <span aria-hidden="true">→</span>
      </Link>
      <Link
        to="/recruiter/applications"
        className="secondary-button light-button"
      >
        Review Candidates <span aria-hidden="true">→</span>
      </Link>
    </div>
  </section>
);

export default RecruiterQuickActions;