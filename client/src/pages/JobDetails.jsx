import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import JobHeader from "../components/jobDetailsComponents/JobHeader";
import JobOverview from "../components/jobDetailsComponents/JobOverview";
import JobDescription from "../components/jobDetailsComponents/JobDescription";
import JobSkills from "../components/jobDetailsComponents/JobSkills";
import JobSidebar from "../components/jobDetailsComponents/JobSidebar";
import CompanyCard from "../components/jobDetailsComponents/CompanyCard";

const JobDetails = () => {
  const { id } = useParams();
  const { user, authLoading } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data?.job || null);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || "Failed to load this job.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const loadJob = async () => {
      await fetchJob();
    };

    loadJob();
  }, [fetchJob]);

  if (loading) return <main className="job-details-page details-state"><p>Loading job details...</p></main>;
  if (error || !job) return <main className="job-details-page details-state"><h1>{error || "Job not found"}</h1><Link to="/jobs" className="details-back-link">Back to jobs</Link></main>;

  return (
    <main className="job-details-page">
      <div className="section-shell details-shell"><Link to="/jobs" className="details-back-link">← Back to jobs</Link><JobHeader job={job} /><div className="details-layout"><div className="details-main"><JobDescription description={job.description} /><JobSkills skills={job.skills} /></div><aside className="details-side"><JobSidebar jobId={job._id} user={user} authLoading={authLoading} /><JobOverview job={job} /><CompanyCard company={job.company} /></aside></div></div>
    </main>
  );
};

export default JobDetails;