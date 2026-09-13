import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const emptyCompany = { name: "", industry: "", location: "", website: "", logo: "", description: "" };

const RecruiterCompany = () => {
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState(emptyCompany);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [addingRecruiter, setAddingRecruiter] = useState(false);

  const loadCompany = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/companies/my-company");
      const currentCompany = response.data?.company || null;
      setCompany(currentCompany);
      setForm(currentCompany ? { ...emptyCompany, ...currentCompany } : emptyCompany);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load your company profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCompany(); }, [loadCompany]);

  const saveCompany = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const response = company
        ? await api.patch("/companies/my-company", form)
        : await api.post("/companies", form);
      const savedCompany = response.data?.company;
      setCompany(savedCompany);
      setForm({ ...emptyCompany, ...savedCompany });
      setEditing(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save your company profile.");
    } finally {
      setSaving(false);
    }
  };

  const addRecruiter = async (event) => {
    event.preventDefault();
    try {
      setAddingRecruiter(true);
      setError("");
      const response = await api.post("/companies/my-company/recruiters", { email: recruiterEmail });
      setCompany(response.data?.company);
      setRecruiterEmail("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add recruiter.");
    } finally {
      setAddingRecruiter(false);
    }
  };

  if (loading) return <main className="company-page company-state"><p>Loading company profile...</p></main>;

  if (!company && !editing) {
    return <main className="company-page"><div className="section-shell company-shell"><section className="company-empty">
      <p className="eyebrow">Recruiter workspace</p><h1>Create your company profile</h1>
      <p>You have not created a company profile yet. Add one before posting jobs.</p>
      <button className="secondary-button dark-button" onClick={() => setEditing(true)}>Create Company</button>
    </section></div></main>;
  }

  return <main className="company-page"><div className="section-shell company-shell">
    <header className="company-management-header"><div><p className="eyebrow">Recruiter workspace</p><h1>My Company</h1></div>
      {!editing && <button className="secondary-button dark-button" onClick={() => setEditing(true)}>Edit Company</button>}</header>
    {error && <p className="management-error" role="alert">{error}</p>}
    {editing ? <form className="company-form" onSubmit={saveCompany}>
      <div className="company-form-grid">
        <label>Company name *<input required name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Industry<input name="industry" value={form.industry || ""} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></label>
        <label>Location *<input required name="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
        <label>Website<input type="url" name="website" value={form.website || ""} placeholder="https://example.com" onChange={(e) => setForm({ ...form, website: e.target.value })} /></label>
      </div>
      <label>Logo URL<input type="url" name="logo" value={form.logo || ""} placeholder="https://example.com/logo.png" onChange={(e) => setForm({ ...form, logo: e.target.value })} /></label>
      <label>Company description *<textarea required name="description" rows="7" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <div className="company-form-actions"><button type="button" className="secondary-button light-button" onClick={() => { setEditing(false); setForm(company ? { ...emptyCompany, ...company } : emptyCompany); }}>Cancel</button><button className="secondary-button dark-button" disabled={saving}>{saving ? "Saving..." : "Save Company"}</button></div>
    </form> : <section className="company-management-card">
      <div className="company-profile-identity"><div className="company-profile-logo">{company.logo ? <img src={company.logo} alt={`${company.name} logo`} /> : company.name.charAt(0).toUpperCase()}</div><div><h2>{company.name}</h2><p>{company.industry || "Industry not specified"} · {company.location}</p></div></div>
      {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="text-link">Visit website ↗</a>}
      <div className="company-description"><h3>About {company.name}</h3><p>{company.description}</p></div>
      <section className="company-team">
        <h3>Recruiter team</h3>
        <p>Add an existing recruiter account using its work email.</p>
        <form className="company-team-form" onSubmit={addRecruiter}>
          <input required type="email" value={recruiterEmail} placeholder="recruiter@company.com" onChange={(e) => setRecruiterEmail(e.target.value)} />
          <button className="secondary-button dark-button" disabled={addingRecruiter}>{addingRecruiter ? "Adding..." : "Add recruiter"}</button>
        </form>
        <div className="company-team-list">
          {(company.recruiters || []).map((recruiter) => <div key={recruiter._id || recruiter}>
            <strong>{recruiter.name || "Recruiter"}</strong><span>{recruiter.email || ""}{recruiter.professionalTitle ? ` · ${recruiter.professionalTitle}` : ""}</span>
          </div>)}
        </div>
      </section>
    </section>}
  </div></main>;
};

export default RecruiterCompany;
