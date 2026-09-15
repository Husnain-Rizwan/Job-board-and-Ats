import CompanyLogo from "../CompanyLogo";

const JobHeader = ({ job }) => {
  const companyName = job.company?.name || "Company";

  return (
    <header className="details-header">
      <CompanyLogo company={job.company} name={companyName} className="details-company-mark" />
      <div className="details-header-copy">
        <p className="eyebrow">{job.employmentType || "Open position"}</p>
        <h1>{job.title}</h1>
        <p>
          {companyName}
          <span>•</span>
          {job.location || "Location not specified"}
        </p>
      </div>
    </header>
  );
};

export default JobHeader;
