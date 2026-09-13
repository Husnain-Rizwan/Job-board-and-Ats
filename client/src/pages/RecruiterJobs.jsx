import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import JobManagementHeader from "../components/recruiterJobsComponents/JobManagementHeader";
import RecruiterJobList from "../components/recruiterJobsComponents/RecruiterJobList";
import JobForm from "../components/recruiterJobsComponents/JobForm";

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [changingJobId, setChangingJobId] = useState(null);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/jobs/my-jobs");
      setJobs(Array.isArray(response.data?.jobs) ? response.data.jobs : []);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message || "Failed to load your jobs.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadJobs = async () => {
      await fetchJobs();
    };
    loadJobs();
  }, [fetchJobs]);

  const submitJob = async (jobData) => {
    try {
      setSubmitting(true);
      setError("");
      if (editingJob) await api.put(`/jobs/${editingJob._id}`, jobData);
      else await api.post("/jobs", jobData);
      setFormOpen(false);
      setEditingJob(null);
      await fetchJobs();
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message || "Unable to save this job.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  const toggleStatus = async (job) => {
    const deactivating = job.status === "active";
    if (deactivating && !window.confirm(`Deactivate “${job.title}”? Candidates will no longer be able to apply.`)) return;
    try {
      setChangingJobId(job._id);
      setError("");
      await api.patch(`/jobs/${job._id}/status`, {
        status: job.status === "active" ? "inactive" : "active",
      });
      await fetchJobs();
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message || "Unable to change job status.",
      );
    } finally {
      setChangingJobId(null);
    }
  };

  return (
    <main className="management-page">
      <div className="section-shell management-shell">
        <JobManagementHeader />
        {error && (
          <p className="management-error" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <div className="management-state">Loading your jobs...</div>
        ) : (
          <RecruiterJobList
            jobs={jobs}
            onEdit={(job) => {
              setEditingJob(job);
              setFormOpen(true);
            }}
            onToggleStatus={toggleStatus}
            changingJobId={changingJobId}
          />
        )}
      </div>
      {formOpen && (
        <JobForm
          key={editingJob?._id || "new-job"}
          job={editingJob}
          onSubmit={submitJob}
          onClose={() => {
            setFormOpen(false);
            setEditingJob(null);
          }}
          submitting={submitting}
        />
      )}
    </main>
  );
};

export default RecruiterJobs;
