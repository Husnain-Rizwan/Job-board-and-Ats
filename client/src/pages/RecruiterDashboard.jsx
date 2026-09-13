import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import RecruiterDashboardHeader from "../components/recruiterDashboardComponents/RecruiterDashboardHeader";
import RecruiterStats from "../components/recruiterDashboardComponents/RecruiterStats";
import RecentRecruiterApplications from "../components/recruiterDashboardComponents/RecentRecruiterApplications";
import RecentJobs from "../components/recruiterDashboardComponents/RecentJobs";
import RecruiterQuickActions from "../components/recruiterDashboardComponents/RecruiterQuickActions";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    interviews: 0,
  });
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [statsResponse, applicationsResponse, jobsResponse] =
        await Promise.all([
          api.get("/recruiter/dashboard/stats"),
          api.get("/recruiter/dashboard/applications"),
          api.get("/recruiter/dashboard/jobs"),
        ]);
      setStats(statsResponse.data || {});
      setApplications(
        Array.isArray(applicationsResponse.data?.applications)
          ? applicationsResponse.data.applications
          : [],
      );
      setJobs(
        Array.isArray(jobsResponse.data?.jobs) ? jobsResponse.data.jobs : [],
      );
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          "Failed to load your recruiter dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchDashboard();
    };
    loadDashboard();
  }, [fetchDashboard]);

  if (loading)
    return (
      <main className="dashboard-page dashboard-state">
        <p>Loading your recruiter dashboard...</p>
      </main>
    );
  if (error)
    return (
      <main className="dashboard-page dashboard-state">
        <h1>{error}</h1>
        <Link to="/" className="secondary-button dark-button">
          Back Home
        </Link>
      </main>
    );

  return (
    <main className="dashboard-page recruiter-dashboard-page">
      <div className="section-shell dashboard-shell">
        <RecruiterDashboardHeader user={user} />
        <RecruiterStats stats={stats} />
        <div className="recruiter-dashboard-grid">
          <RecentRecruiterApplications applications={applications} />
          <RecentJobs jobs={jobs} />
        </div>
        <RecruiterQuickActions />
      </div>
    </main>
  );
};

export default RecruiterDashboard;
