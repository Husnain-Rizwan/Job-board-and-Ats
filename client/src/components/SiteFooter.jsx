import { Link } from "react-router-dom";
import { Brand } from "./SiteHeader";
import { useAuth } from "../hooks/useAuth";

const SiteFooter = () => {
  const { user } = useAuth();
  const isRecruiter = user?.role === "recruiter";
  const isJobseeker = user?.role === "jobseeker";
  return <footer className="site-footer">
    <div className="section-shell site-footer-inner">
      <section className="footer-brand"><Brand /><p>One place to discover meaningful work, build your career, and grow a great team.</p><span className={`footer-role ${isRecruiter ? "recruiter" : isJobseeker ? "jobseeker" : ""}`}>{isRecruiter ? "Hiring talent" : isJobseeker ? "Finding your next role" : "For jobseekers & recruiters"}</span></section>
      <section className="footer-links"><h2>Explore</h2><Link to="/jobs">Browse jobs</Link><Link to="/contact">Contact us</Link><Link to="/privacy-policy">Privacy policy</Link></section>
      <section className="footer-links"><h2>{isRecruiter ? "Recruiters" : "Jobseekers"}</h2>{isRecruiter ? <><Link to="/recruiter/jobs/create">Post a job</Link><Link to="/recruiter/applications">Review candidates</Link><Link to="/recruiter/company">Your company</Link></> : <><Link to="/profile">Build your profile</Link><Link to="/applications">My applications</Link><Link to="/jobs">Find your next role</Link></>}</section>
      <section className="footer-links"><h2>Get started</h2><Link to="/register">Register</Link><Link to="/register">I&apos;m a jobseeker</Link><Link to="/register">I&apos;m a recruiter</Link><Link to="/contact">Support center</Link></section>
    </div>
    <div className="section-shell footer-bottom"><span>© {new Date().getFullYear()} Job&amp;Hire</span><span>Better careers. Stronger teams.</span></div>
  </footer>;
};

export default SiteFooter;
