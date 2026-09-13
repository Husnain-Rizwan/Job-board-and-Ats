import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import DashboardHeader from "../components/jobseekerDashboardComponents/DashboardHeader";
import ApplicationStats from "../components/jobseekerDashboardComponents/ApplicationStats";
import RecentApplications from "../components/jobseekerDashboardComponents/RecentApplications";
import QuickActions from "../components/jobseekerDashboardComponents/QuickActions";

const JobseekerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    shortlisted: 0,
    interviews: 0,
    selected: 0,
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [statsResponse, applicationsResponse] = await Promise.all([
        api.get("/jobseeker/dashboard/stats"),
        api.get("/jobseeker/dashboard/applications"),
      ]);
      setStats(statsResponse.data || {});
      setApplications(
        Array.isArray(applicationsResponse.data?.applications)
          ? applicationsResponse.data.applications
          : [],
      );
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          "Failed to load your dashboard.",
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
        <p>Loading your dashboard...</p>
      </main>
    );
  if (error)
    return (
      <main className="dashboard-page dashboard-state">
        <h1>{error}</h1>
        <Link to="/jobs" className="secondary-button dark-button">
          Find Jobs
        </Link>
      </main>
    );

  return (
    <main className="dashboard-page">
      <div className="section-shell dashboard-shell">
        <DashboardHeader user={user} />
        <ApplicationStats stats={stats} />
        <RecentApplications applications={applications} />
        <QuickActions />
      </div>
    </main>
  );
};

export default JobseekerDashboard;
