const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
    <path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const JobSearchBar = ({
  search,
  location,
  onSearchChange,
  onLocationChange,
  onSubmit,
}) => (
  <section className="jobs-search-hero">
    <div className="jobs-search-orbit" />
    <div className="section-shell jobs-search-inner">
      <p className="eyebrow">Find your next opportunity</p>
      <h1>
        Find jobs that move
        <br />
        <span>your career forward.</span>
      </h1>
      <p>
        Search roles that match your skills, goals, and preferred way of
        working.
      </p>
      <form className="jobs-search-form" onSubmit={onSubmit}>
        <label className="jobs-search-input">
          <SearchIcon />
          <span className="sr-only">Job title, skills, or keywords</span>
          <input
            value={search}
            onChange={onSearchChange}
            placeholder="Job title, skills, or keywords"
          />
        </label>
        <label className="jobs-search-input">
          <PinIcon />
          <span className="sr-only">Location</span>
          <input
            value={location}
            onChange={onLocationChange}
            placeholder="Location"
          />
        </label>
        <button className="primary-button" type="submit">
          Search Jobs <ArrowIcon />
        </button>
      </form>
    </div>
  </section>
);

export default JobSearchBar;
