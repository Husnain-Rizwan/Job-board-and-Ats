import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ApplicationList from "../components/applicationsComponents/ApplicationList";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/jobseeker/dashboard/applications");
      setApplications(Array.isArray(response.data?.applications) ? response.data.applications : []);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || "Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadApplications = async () => {
      await fetchApplications();
    };

    loadApplications();
  }, [fetchApplications]);

  return (
    <main className="applications-page">
      <section className="applications-hero"><div className="section-shell"><p className="eyebrow">Keep every opportunity in view</p><h1>My applications</h1><p>Track your applications and stay close to your next opportunity.</p></div></section>
      <div className="section-shell applications-shell">{loading && <div className="applications-state"><p>Loading applications...</p></div>}{error && <div className="applications-state"><h2>{error}</h2><Link to="/login" className="secondary-button dark-button">Log in</Link></div>}{!loading && !error && <ApplicationList applications={applications} />}</div>
    </main>
  );
};

export default MyApplications;
