import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyJob from "./ApplyJob";
import SaveJobButton from "./SaveJobButton";
import api from "../../services/api";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const JobSidebar = ({ jobId, user, authLoading }) => {
  const [showApplication, setShowApplication] = useState(false);
  const [applied, setApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [profileComplete, setProfileComplete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "jobseeker") {
      setApplied(false);
      setShowApplication(false);
      setProfileComplete(null);
      return;
    }

    const checkApplication = async () => {
      try {
        setCheckingApplication(true);
        const [response, profileResponse] = await Promise.all([
          api.get("/jobseeker/dashboard/applications"),
          api.get("/profile/completion"),
        ]);
        setProfileComplete(Boolean(profileResponse.data?.complete));
        const applications = Array.isArray(response.data?.applications)
          ? response.data.applications
          : [];
        setApplied(
          applications.some((application) => {
            const applicationJob = application.job;
            const applicationJobId =
              typeof applicationJob === "string"
                ? applicationJob
                : applicationJob?._id;
            return applicationJobId === jobId;
          }),
        );
      } catch (error) {
        console.error("Unable to check application status:", error);
        setApplied(false);
        setProfileComplete(false);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [authLoading, jobId, user]);

  const handleApplyClick = () => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "jobseeker") return;

    if (!profileComplete) {
      navigate("/profile");
      return;
    }

    if (!applied) setShowApplication(true);
  };

  return (
    <section className="details-actions">
      {showApplication ? (
        <ApplyJob
          jobId={jobId}
          user={user}
          onClose={() => setShowApplication(false)}
          onSubmitted={() => {
            setApplied(true);
            setShowApplication(false);
          }}
          onAlreadyApplied={() => {
            setApplied(true);
            setShowApplication(false);
          }}
        />
      ) : (
        <>
          <button
            type="button"
            className={`details-apply${applied ? " details-apply-applied" : ""}`}
            onClick={handleApplyClick}
            disabled={applied || authLoading || checkingApplication}
          >
            {applied ? (
              "✓ Applied"
            ) : authLoading ? (
              "Checking session..."
            ) : checkingApplication ? (
              "Checking profile..."
            ) : profileComplete === false ? (
              "Complete Profile to Apply"
            ) : (
              <>
                Apply Now <ArrowIcon />
              </>
            )}
          </button>
          {applied && (
            <p className="apply-success-message">
              Application submitted successfully!
            </p>
          )}
        </>
      )}
      <SaveJobButton jobId={jobId} user={user} authLoading={authLoading} />
    </section>
  );
};

export default JobSidebar;
