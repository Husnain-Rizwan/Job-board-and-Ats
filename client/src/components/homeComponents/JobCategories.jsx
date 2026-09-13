import { Link } from "react-router-dom";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const JobCategories = ({ categories, categorySlug }) => (
  <section className="section-shell category-section">
    <div className="section-heading row-heading">
      <div>
        <p className="eyebrow">Discover more possibilities</p>
        <h2>Explore jobs by category</h2>
      </div>
      <span className="section-label">08 categories</span>
    </div>
    <div className="category-grid">
      {categories.map((category, index) => (
        <Link key={category} to={`/jobs?category=${categorySlug(category)}`}>
          <span>0{index + 1}</span>
          <strong>{category}</strong>
          <ArrowIcon />
        </Link>
      ))}
    </div>
  </section>
);

export default JobCategories;
