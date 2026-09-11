const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];
const experienceOptions = ["Any", "0–1 years", "1–3 years", "3–5 years", "5+ years"];
const salaryOptions = ["Any", "Under 50,000", "50,000–100,000", "100,000–150,000", "150,000+"];

const JobFilters = ({ filters, onFilterChange, onClear, onApply }) => (
  <aside className="job-filters">
    <div className="filter-heading"><p className="eyebrow">Refine results</p><h2>Filters</h2></div>
    <label className="filter-label">Location<input value={filters.location} onChange={(event) => onFilterChange("location", event.target.value)} placeholder="Lahore" /></label>
    <fieldset><legend>Employment type</legend>{employmentTypes.map((type) => <label className="checkbox-option" key={type}><input type="checkbox" checked={filters.employmentType.includes(type)} onChange={() => onFilterChange("employmentType", type)} /><span>{type}</span></label>)}</fieldset>
    <fieldset><legend>Experience</legend>{experienceOptions.map((option) => <label className="radio-option" key={option}><input type="radio" name="experience" value={option} checked={filters.experience === option} onChange={(event) => onFilterChange("experience", event.target.value)} /><span>{option}</span></label>)}</fieldset>
    <fieldset><legend>Salary</legend>{salaryOptions.map((option) => <label className="radio-option" key={option}><input type="radio" name="salary" value={option} checked={filters.salary === option} onChange={(event) => onFilterChange("salary", event.target.value)} /><span>{option}</span></label>)}</fieldset>
    <div className="filter-actions"><button type="button" className="filter-apply" onClick={onApply}>Apply filters</button><button type="button" className="clear-filters" onClick={onClear}>Clear filters</button></div>
  </aside>
);

export default JobFilters;
