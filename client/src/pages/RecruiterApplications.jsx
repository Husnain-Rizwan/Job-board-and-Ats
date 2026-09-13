import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import ApplicantList from "../components/recruiterApplicationsComponents/ApplicantList";
import ApplicantDetails from "../components/recruiterApplicationsComponents/ApplicantDetails";

const RecruiterApplications = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const requests = jobId
        ? [api.get(`/jobs/${jobId}`), api.get(`/applications?jobId=${jobId}`)]
        : [Promise.resolve(null), api.get("/applications")];
      const [jobResponse, applicationsResponse] = await Promise.all(requests);
      setJob(jobResponse?.data?.job || null);
      setApplications(
        Array.isArray(applicationsResponse.data?.applications)
          ? applicationsResponse.data.applications
          : [],
      );
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message || "Failed to load applicants.",
      );
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    const loadApplications = async () => {
      await fetchApplications();
    };
    loadApplications();
  }, [fetchApplications]);

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdating(applicationId);
      await api.patch(`/applications/${applicationId}/status`, { status });
      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application,
        ),
      );
      if (selectedApplication?._id === applicationId)
        setSelectedApplication((current) => ({ ...current, status }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update application status.",
      );
    } finally {
      setUpdating("");
    }
  };
  const viewApplicant = async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}`);
      setSelectedApplication(response.data?.application || null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load applicant details.",
      );
    }
  };

  if (loading)
    return (
      <main className="recruiter-applications-page application-manager-state">
        <p>Loading applicants...</p>
      </main>
    );
  if (error && (jobId ? !job : !applications.length))
    return (
      <main className="recruiter-applications-page application-manager-state">
        <h1>{error}</h1>
        <Link to="/recruiter/dashboard" className="secondary-button dark-button">
          Back to Dashboard
        </Link>
      </main>
    );

  return (
    <main className="recruiter-applications-page">
      <div className="section-shell recruiter-applications-shell">
        <Link to={jobId ? "/recruiter/jobs" : "/recruiter/dashboard"} className="details-back-link">
          ← Back to my jobs
        </Link>
        <header className="applicants-header">
          <p className="eyebrow">Candidate pipeline</p>
          <h1>
            Applicants <span>— {job?.title || "Job"}</span>
          </h1>
          <p>
            {job?.company?.name || "Company"} <b>•</b>{" "}
            {job?.location || "Location unavailable"}
          </p>
        </header>
        {error && (
          <p className="management-error" role="alert">
            {error}
          </p>
        )}
        <ApplicantList
          applications={applications}
          onStatusChange={updateStatus}
          onView={viewApplicant}
          updating={updating}
        />
        {selectedApplication && (
          <ApplicantDetails
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
          />
        )}
      </div>
    </main>
  );
};

export default RecruiterApplications;
