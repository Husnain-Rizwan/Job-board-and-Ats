import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

export const Brand = ({ onClick }) => (
  <Link to="/" className="site-brand" onClick={onClick} aria-label="Job and Hire home">
    <img src="/favicon.svg" alt="" />
    <span>Job<span className="brand-ampersand">&amp;</span>Hire</span>
  </Link>
);

const navigationByRole = {
  recruiter: [["Dashboard", "/recruiter/dashboard"], ["My jobs", "/recruiter/jobs"], ["Candidates", "/recruiter/applications"], ["Company", "/recruiter/company"], ["Profile", "/recruiter/profile"]],
  jobseeker: [["Dashboard", "/jobseeker/dashboard"], ["Find jobs", "/jobs"], ["My applications", "/applications"], ["Profile", "/profile"]],
  public: [["Find jobs", "/jobs"], ["For jobseekers", "/register"], ["For recruiters", "/register"]],
};

const SiteHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const role = user?.role;
  const links = navigationByRole[role] || navigationByRole.public;
  const closeMenu = () => setMenuOpen(false);
  const signOut = async () => {
    try { await api.post("/auth/logout"); } catch { /* The local session should still be cleared. */ }
    logout(); setAccountOpen(false); closeMenu(); navigate("/");
  };

  return <header className="site-header"><div className="site-header-inner">
    <Brand onClick={closeMenu} />
    <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((open) => !open)}>
      <span className="sr-only">{menuOpen ? "Close" : "Open"} menu</span><span /><span /><span />
    </button>
    <div className={`site-menu ${menuOpen ? "is-open" : ""}`} id="main-navigation">
      <nav className="site-nav" aria-label="Main navigation">{links.map(([label, to]) => <NavLink key={label} to={to} onClick={closeMenu}>{label}</NavLink>)}</nav>
      <div className="site-account">{user ? <>
        <div className="account-menu"><button type="button" className="account-trigger" aria-expanded={accountOpen} aria-haspopup="menu" onClick={() => setAccountOpen((open) => !open)}><span className="account-avatar" aria-hidden="true">{user.name?.charAt(0)?.toUpperCase() || "U"}</span><span className="account-summary"><span className="account-name">{user.name}</span><span className={`role-badge ${role}`}>{role === "recruiter" ? "Recruiter" : "Jobseeker"}</span></span><span className="account-caret" aria-hidden="true">⌄</span></button>
          {accountOpen && <div className="account-dropdown" role="menu"><Link role="menuitem" to={role === "recruiter" ? "/recruiter/profile" : "/profile"} onClick={() => { setAccountOpen(false); closeMenu(); }}>My profile</Link>{role === "recruiter" && <Link role="menuitem" to="/recruiter/jobs/create" onClick={() => { setAccountOpen(false); closeMenu(); }}>Post a job</Link>}<button type="button" role="menuitem" onClick={signOut}>Log out</button></div>}
        </div>
      </> : <><Link to="/login" className="header-login" onClick={closeMenu}>Log in</Link><Link to="/register" className="header-primary" onClick={closeMenu}>Create account</Link></>}</div>
    </div>
  </div></header>;
};

export default SiteHeader;
