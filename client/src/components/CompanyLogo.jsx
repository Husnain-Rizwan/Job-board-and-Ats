import { useEffect, useState } from "react";
import { companyInitials } from "../utils/company";

const fallbackColors = ["#a8d9ce", "#cdc5e5", "#efd994", "#b8d6df", "#f1baa9", "#c3dfbb"];

const colorForName = (name) => {
  const value = Array.from(name).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return fallbackColors[value % fallbackColors.length];
};

const CompanyLogo = ({ company, className, name }) => {
  const companyName = company?.name || name || "Company";
  const logo = company?.logo;
  const [showImage, setShowImage] = useState(Boolean(logo));

  useEffect(() => setShowImage(Boolean(logo)), [logo]);

  return (
    <div
      className={className}
      aria-label={!showImage ? `${companyName} logo` : undefined}
      role={!showImage ? "img" : undefined}
      style={!showImage ? { backgroundColor: colorForName(companyName) } : undefined}
    >
      {showImage ? <img src={logo} alt={`${companyName} logo`} onError={() => setShowImage(false)} /> : companyInitials(companyName)}
    </div>
  );
};

export default CompanyLogo;
