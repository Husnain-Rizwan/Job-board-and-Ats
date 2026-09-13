import { Link } from "react-router-dom";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const JobSeekerSection = ({ benefits }) => (
  <div className="audience-card seeker-card">
    <p className="eyebrow">For job seekers</p>
    <h2>Everything you need for your job search.</h2>
    <ul>
      {benefits.map((item) => (
        <li key={item}>
          <ArrowIcon />
          {item}
        </li>
      ))}
    </ul>
    <Link to="/jobs" className="secondary-button dark-button">
      Find Jobs <ArrowIcon />
    </Link>
  </div>
);

export default JobSeekerSection;
