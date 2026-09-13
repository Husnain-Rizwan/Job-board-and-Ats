import { Link } from "react-router-dom";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const CTASection = () => (
  <section className="final-cta section-shell">
    <div>
      <p className="eyebrow">Your next opportunity is closer</p>
      <h2>Ready to find your next opportunity?</h2>
      <p>
        Explore thousands of opportunities and take the next step in your
        career.
      </p>
    </div>
    <Link to="/jobs" className="secondary-button dark-button">
      Browse Jobs <ArrowIcon />
    </Link>
  </section>
);

export default CTASection;
