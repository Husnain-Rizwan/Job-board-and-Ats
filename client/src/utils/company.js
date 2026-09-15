export const companyInitials = (name) => {
  const words = String(name || "Company").trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "C";
};

export const PAKISTAN_PHONE_PATTERN = "\\+92[0-9]{10}";
export const isPakistanPhone = (value) => !value || /^\+92\d{10}$/.test(value);
