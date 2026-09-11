const JobHeader = ({ job }) => {
  const companyName = job.company?.name || "Company";
  const companyInitial = companyName.charAt(0).toUpperCase();

  return (
    <header className="details-header">
      <div className="details-company-mark">{job.company?.logo ? <img src={job.company.logo} alt={`${companyName} logo`} /> : companyInitial}</div>
      <div className="details-header-copy"><p className="eyebrow">{job.employmentType || "Open position"}</p><h1>{job.title}</h1><p>{companyName}<span>•</span>{job.location || "Location not specified"}</p></div>
    </header>
  );
};

export default JobHeader;
