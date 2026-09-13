const PROFILE_REQUIREMENTS = [
  ["professionalTitle", "professional title"],
  ["phone", "phone number"],
  ["location", "location"],
];

const getMissingProfileFields = (user) =>
  PROFILE_REQUIREMENTS.filter(([field]) => !user?.[field]?.trim()).map(
    ([, label]) => label,
  );

const hasCompletedJobseekerProfile = (user) =>
  getMissingProfileFields(user).length === 0;

module.exports = { getMissingProfileFields, hasCompletedJobseekerProfile };
