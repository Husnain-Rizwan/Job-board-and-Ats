import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const list = (value) => (Array.isArray(value) ? value : []);

const ApplicantProfile = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openingResume, setOpeningResume] = useState(false);

  useEffect(() => {
    const loadApplicant = async () => {
      try {
        const response = await api.get(`/profile/applicants/${applicantId}`);
        setApplicant(response.data?.user || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load this applicant profile.");
      } finally {
        setLoading(false);
      }
    };

    void loadApplicant();
  }, [applicantId]);

  const openResume = async () => {
    const resumeWindow = window.open("", "_blank");
    if (!resumeWindow) {
      setError("Please allow pop-ups to view the resume.");
      return;
    }

    try {
      setOpeningResume(true);
      setError("");
      const response = await api.get(`/profile/applicants/${applicantId}/resume`);
      resumeWindow.location.replace(response.data.url);
    } catch (requestError) {
      resumeWindow.close();
      setError(requestError.response?.data?.message || "Unable to open the resume.");
    } finally {
      setOpeningResume(false);
    }
  };

  if (loading) return <main className="profile-page profile-state"><p>Loading applicant profile...</p></main>;
  if (!applicant) return <main className="profile-page profile-state"><h1>{error || "Applicant not found"}</h1></main>;

  return (
    <main className="profile-page">
      <div className="section-shell profile-shell">
        <header className="profile-header">
          <div>
            <p className="eyebrow">Recruiter view · Read only</p>
            <h1>{applicant.name}</h1>
            <p>{applicant.email}</p>
          </div>
          <button type="button" className="profile-edit-button" onClick={() => navigate(-1)}>
            Back to applications
          </button>
        </header>
        {error && <p className="management-error" role="alert">{error}</p>}
        <section className="profile-card applicant-profile-card">
          <div className="profile-summary">
            <h2>{applicant.professionalTitle || "Professional title not added"}</h2>
            <p>{applicant.phone || "Phone not added"} · {applicant.location || "Location not added"}</p>
            {applicant.bio && <p className="profile-bio">{applicant.bio}</p>}
          </div>
          <ReadOnlySection title="Skills">
            <div className="profile-skills">
              {list(applicant.skills).length ? list(applicant.skills).map((skill) => <span key={skill}>{skill}</span>) : <p>Skills not added</p>}
            </div>
          </ReadOnlySection>
          <Entries title="Education" items={list(applicant.education)} />
          <Entries title="Experience" items={list(applicant.experience)} />
          <section className="profile-detail profile-resume">
            <div className="profile-resume-heading">
              <div className="profile-resume-icon" aria-hidden="true">PDF</div>
              <div><h3>Resume</h3><p>Applicant profile resume</p></div>
            </div>
            {applicant.resume?.available ? (
              <div className="profile-resume-file">
                <div><strong>{applicant.resume.filename || "Resume.pdf"}</strong><span>PDF resume uploaded</span></div>
                <button type="button" className="secondary-button dark-button" disabled={openingResume} onClick={openResume}>
                  {openingResume ? "Opening..." : "View resume"}
                </button>
              </div>
            ) : <div className="profile-resume-empty"><p>This applicant has not added a profile resume.</p></div>}
          </section>
        </section>
      </div>
    </main>
  );
};

const ReadOnlySection = ({ title, children }) => <section className="profile-detail"><h3>{title}</h3>{children}</section>;

const Entries = ({ title, items }) => (
  <section className="profile-detail profile-entries">
    <h3>{title}</h3>
    {items.length ? items.map((item, index) => (
      <article key={item._id || `${item.title}-${index}`} className="profile-entry">
        <h4>{item.title}</h4>
        <p>{item.company || item.institution}{item.duration && ` · ${item.duration}`}</p>
        {item.description && <p>{item.description}</p>}
      </article>
    )) : <p>No {title.toLowerCase()} added.</p>}
  </section>
);

export default ApplicantProfile;
