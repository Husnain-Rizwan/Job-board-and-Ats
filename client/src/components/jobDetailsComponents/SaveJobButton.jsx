import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const SaveJobButton = ({ jobId, user, authLoading }) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const isJobseeker = user?.role === "jobseeker";

  const checkSavedState = useCallback(async () => {
    if (authLoading || !isJobseeker || !jobId) return;

    try {
      setChecking(true);
      const response = await api.get("/savedJobs");
      const savedJobs = Array.isArray(response.data?.savedJobs)
        ? response.data.savedJobs
        : [];
      setSaved(
        savedJobs.some((savedJob) => {
          const savedJobId = savedJob.job?._id || savedJob.job;
          return savedJobId?.toString() === jobId.toString();
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setChecking(false);
    }
  }, [authLoading, isJobseeker, jobId]);

  useEffect(() => {
    const loadSavedState = async () => {
      await checkSavedState();
    };

    loadSavedState();
  }, [checkSavedState]);

  const toggleSaved = async () => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (!isJobseeker || loading) {
      setMessage("Only job seekers can save jobs.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      if (saved) {
        if (!window.confirm("Remove this job from your saved jobs?")) {
          setLoading(false);
          return;
        }
        await api.delete(`/savedJobs/${jobId}`);
        setSaved(false);
      } else {
        await api.post(`/savedJobs/${jobId}`);
        setSaved(true);
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Unable to update saved job.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="save-job-control">
      <button
        type="button"
        className="details-save"
        onClick={toggleSaved}
        disabled={authLoading || loading || checking}
      >
        <span aria-hidden="true">{saved ? "♥" : "♡"}</span>{" "}
        {authLoading
          ? "Checking session..."
          : checking
            ? "Checking..."
            : saved
              ? "Saved"
              : "Save Job"}
      </button>
      {message && (
        <p className="save-job-error" role="alert">
          {message}
        </p>
      )}
    </div>
  );
};

export default SaveJobButton;
