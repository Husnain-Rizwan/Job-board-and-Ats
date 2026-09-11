import { Link } from "react-router-dom";

const ArrowIcon = () => <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;

const RecruiterSection = ({ benefits }) => (
  <div className="audience-card recruiter-card"><p className="eyebrow">For recruiters</p><h2>Hire better.<br />Manage <span className="nowrap">candidates easier.</span></h2><ul>{benefits.map((item) => <li key={item}><ArrowIcon />{item}</li>)}</ul><Link to="/register" className="secondary-button dark-button">Post a Job <ArrowIcon /></Link></div>
);

export default RecruiterSection;
