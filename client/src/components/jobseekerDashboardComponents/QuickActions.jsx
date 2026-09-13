import { Link } from "react-router-dom";

const QuickActions = () => (
  <section className="quick-actions">
    <p className="eyebrow">Keep moving</p>
    <h2>Make your next move count.</h2>
    <div>
      <Link to="/jobs" className="secondary-button dark-button">
        Find Jobs <span aria-hidden="true">→</span>
      </Link>
      <Link to="/applications" className="secondary-button light-button">
        View Applications <span aria-hidden="true">→</span>
      </Link>
      <Link to="/profile" className="secondary-button light-button">
        My Profile
      </Link>
    </div>
  </section>
);

export default QuickActions;
