const SearchIcon = () => <svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>;
const PinIcon = () => <svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></svg>;
const ArrowIcon = () => <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;

const HeroSection = ({ query, location, onQueryChange, onLocationChange, onSearch }) => (
  <section className="hero-section">
    <div className="hero-glow glow-left" /><div className="hero-glow glow-right" />
    <div className="hero-inner">
      <p className="eyebrow">A better way to move forward</p>
      <h1>Find the right job.<br /><span>Build your career.</span></h1>
      <p className="hero-description">Discover opportunities that match your skills, experience, and career goals.</p>
      <form className="search-panel" onSubmit={onSearch}>
        <label className="search-field"><SearchIcon /><span className="sr-only">Job title, skills, or keywords</span><input value={query} onChange={onQueryChange} placeholder="Job title, skills, or keywords" /></label>
        <label className="search-field"><PinIcon /><span className="sr-only">Location</span><input value={location} onChange={onLocationChange} placeholder="Location" /></label>
        <button type="submit" className="primary-button">Search Jobs <ArrowIcon /></button>
      </form>
    </div>
  </section>
);

export default HeroSection;
