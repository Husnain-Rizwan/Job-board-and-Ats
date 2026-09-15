export const companyInitials = (name) => {
  return String(name || "Company").trim().charAt(0).toUpperCase() || "C";
};

export const PAKISTAN_PHONE_PATTERN = "\\+92[0-9]{10}";
export const isPakistanPhone = (value) => !value || /^\+92\d{10}$/.test(value);
