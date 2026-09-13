import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyJob from "./ApplyJob";
import SaveJobButton from "./SaveJobButton";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const JobSidebar = ({ jobId, user, authLoading }) => {
  const [showApplication, setShowApplication] = useState(false);
  const [applied, setApplied] = useState(false);
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    setShowApplication(true);
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
        />
      ) : (
        <>
          <button
            type="button"
            className="details-apply"
            onClick={handleApplyClick}
            disabled={applied || authLoading}
          >
            {applied ? (
              "✓ Applied"
            ) : authLoading ? (
              "Checking session..."
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
