const formatSalary = (salary) => {
  if (!salary) return "Not specified";
  const currency = salary.currency || "PKR";
  if (salary.max == null)
    return `${Number(salary.min).toLocaleString()}+ ${currency}`;
  return `${Number(salary.min).toLocaleString()} - ${Number(salary.max).toLocaleString()} ${currency}`;
};

const formatExperience = (experience) => {
  if (!experience) return "Not specified";
  if (experience.max == null) return `${experience.min}+ years`;
  return `${experience.min} - ${experience.max} years`;
};

const JobOverview = ({ job }) => (
  <section className="details-overview">
    <p className="eyebrow">Job overview</p>
    <div className="overview-grid">
      <div>
        <span>Location</span>
        <strong>{job.location || "Not specified"}</strong>
      </div>
      <div>
        <span>Employment</span>
        <strong>{job.employmentType || "Not specified"}</strong>
      </div>
      <div>
        <span>Salary</span>
        <strong>{formatSalary(job.salary)}</strong>
      </div>
      <div>
        <span>Experience</span>
        <strong>{formatExperience(job.experience)}</strong>
      </div>
    </div>
  </section>
);

export default JobOverview;
