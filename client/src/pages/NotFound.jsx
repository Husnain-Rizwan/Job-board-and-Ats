import { Link } from "react-router-dom";

const NotFound = () => <main className="info-page not-found-page"><section className="section-shell not-found-shell"><p className="eyebrow">Error 404</p><h1>This page isn&apos;t here.</h1><p>It may have moved, been removed, or the address may be incorrect.</p><div><Link to="/" className="secondary-button dark-button">Go to homepage</Link><Link to="/jobs" className="secondary-button light-button">Browse jobs</Link></div></section></main>;

export default NotFound;
