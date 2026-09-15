import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import CompanyLogo from "../components/CompanyLogo";

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const [companyResponse, jobsResponse] = await Promise.all([
        api.get(`/companies/${id}`),
        api.get(`/companies/${id}/jobs`),
      ]);
      setCompany(companyResponse.data?.company || null);
      setJobs(
        Array.isArray(jobsResponse.data?.jobs) ? jobsResponse.data.jobs : [],
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load this company.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadProfile]);

  if (loading)
    return (
      <main className="company-page company-state">
        <p>Loading company profile...</p>
      </main>
    );
  if (error || !company)
    return (
      <main className="company-page company-state">
        <h1>{error || "Company not found"}</h1>
        <Link className="secondary-button dark-button" to="/jobs">
          Browse jobs
        </Link>
      </main>
    );
  return (
    <main className="company-page">
      <div className="section-shell company-shell">
        <Link to="/jobs" className="details-back-link">
          ← Back to jobs
        </Link>
        <header className="public-company-header">
          <CompanyLogo company={company} className="company-profile-logo" />
          <div>
            <p className="eyebrow">Company profile</p>
            <h1>{company.name}</h1>
            <p>
              {company.industry || "Industry not specified"} ·{" "}
              {company.location || "Location not specified"}
            </p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer">
                Visit website ↗
              </a>
            )}
          </div>
        </header>
        <section className="company-content">
          <h2>About {company.name}</h2>
          <p>{company.description}</p>
        </section>
        <section className="company-openings">
          <div>
            <p className="eyebrow">Current opportunities</p>
            <h2>Open Positions</h2>
          </div>
          {jobs.length ? (
            <div className="company-jobs-list">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="company-job-card"
                >
                  <div>
                    <h3>{job.title}</h3>
                    <p>
                      {job.location} · {job.employmentType}
                    </p>
                  </div>
                  <strong>
                    {job.salary?.currency || "PKR"}{" "}
                    {job.salary?.min?.toLocaleString()}{" "}
                    {job.salary?.max
                      ? `– ${job.salary.max.toLocaleString()}`
                      : "+"}
                  </strong>
                </Link>
              ))}
            </div>
          ) : (
            <p className="company-no-jobs">
              There are no active openings at this company right now.
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default CompanyProfile;
