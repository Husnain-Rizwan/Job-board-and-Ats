import { useEffect, useState } from "react";
import api from "../services/api";
import { isPakistanPhone, PAKISTAN_PHONE_PATTERN } from "../utils/company";

const emptyProfile = { name: "", email: "", phone: "", professionalTitle: "" };

const RecruiterProfile = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [company, setCompany] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/recruiter/profile");
        setProfile({ ...emptyProfile, ...response.data?.user });
        setCompany(response.data?.company || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load recruiter profile.");
      } finally { setLoading(false); }
    };
    void load();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    if (!isPakistanPhone(profile.phone)) {
      setError("Phone number must use the format +923012345678.");
      return;
    }
    try {
      setSaving(true); setError("");
      const response = await api.patch("/recruiter/profile", profile);
      setProfile({ ...emptyProfile, ...response.data?.user });
      setEditing(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save recruiter profile.");
    } finally { setSaving(false); }
  };

  if (loading) return <main className="profile-page profile-state"><p>Loading recruiter profile...</p></main>;
  return <main className="profile-page"><div className="section-shell profile-shell">
    <header className="profile-header"><div><p className="eyebrow">Recruiter workspace</p><h1>Recruiter Profile</h1><p>{company?.name || "No company linked"}</p></div>
      {!editing && <button className="profile-edit-button" onClick={() => setEditing(true)}>Edit Profile</button>}</header>
    {error && <p className="management-error" role="alert">{error}</p>}
    {editing ? <form className="profile-form" onSubmit={save}><div className="profile-form-grid">
      <label>Name<input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
      <label>Work email<input required type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label>
      <label>Phone<input type="tel" inputMode="tel" pattern={PAKISTAN_PHONE_PATTERN} title="Use the format +923012345678" placeholder="+923012345678" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label>
      <label>Job title<input value={profile.professionalTitle || ""} onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })} /></label>
    </div><div className="profile-form-actions"><button type="button" className="secondary-button light-button" onClick={() => setEditing(false)}>Cancel</button><button className="secondary-button dark-button" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button></div></form> :
      <section className="profile-card"><div className="profile-summary"><h2>{profile.name}</h2><p>{profile.professionalTitle || "Job title not added"}</p></div><div className="applicant-details-grid"><div><span>Work email</span><strong>{profile.email}</strong></div><div><span>Phone</span><strong>{profile.phone || "Not added"}</strong></div><div><span>Linked company</span><strong>{company?.name || "Not linked yet"}</strong></div></div></section>}
  </div></main>;
};

export default RecruiterProfile;
