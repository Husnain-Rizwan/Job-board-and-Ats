const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const PopularSearches = ({ searches, onSearch }) => (
  <section className="section-shell popular-section">
    <div className="section-heading narrow-heading">
      <p className="eyebrow">Find your starting point</p>
      <h2>Popular searches</h2>
      <p>Explore the roles and paths people are looking for right now.</p>
    </div>
    <div className="popular-grid">
      {searches.map((term) => (
        <button key={term} type="button" onClick={() => onSearch(term)}>
          {term}
          <ArrowIcon />
        </button>
      ))}
    </div>
  </section>
);

export default PopularSearches;
