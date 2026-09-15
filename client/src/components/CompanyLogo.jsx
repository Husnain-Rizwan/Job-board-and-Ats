import { useEffect, useState } from "react";
import { companyInitials } from "../utils/company";

const CompanyLogo = ({ company, className, name }) => {
  const companyName = company?.name || name || "Company";
  const logo = company?.logo;
  const [showImage, setShowImage] = useState(Boolean(logo));

  useEffect(() => setShowImage(Boolean(logo)), [logo]);

  return (
    <div className={className} aria-label={!showImage ? `${companyName} logo` : undefined} role={!showImage ? "img" : undefined}>
      {showImage ? <img src={logo} alt={`${companyName} logo`} onError={() => setShowImage(false)} /> : companyInitials(companyName)}
    </div>
  );
};

export default CompanyLogo;
