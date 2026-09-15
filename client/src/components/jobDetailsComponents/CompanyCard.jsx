import CompanyLogo from "../CompanyLogo";

const CompanyCard = ({ company }) => {
  const companyName = company?.name || "Company";

  return (
    <section className="company-details-card">
      <p className="eyebrow">About the company</p>
      <div className="company-details-top">
        <CompanyLogo company={company} name={companyName} className="company-details-mark" />
        <div>
          <h2>{companyName}</h2>
          <p>{company?.location || "Location not specified"}</p>
        </div>
      </div>
      {company?._id && <Link to={`/companies/${company._id}`} className="text-link">View company profile →</Link>}
    </section>
  );
};

export default CompanyCard;
import { Link } from "react-router-dom";
