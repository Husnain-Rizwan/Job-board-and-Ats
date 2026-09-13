import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const blankProfile = {
  professionalTitle: "",
  phone: "",
  location: "",
  bio: "",
  skills: "",
};
const blankEntry = {
  title: "",
  organization: "",
  duration: "",
  description: "",
};
const entries = (value) => (Array.isArray(value) ? value : []);

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(blankProfile);
  const [editing, setEditing] = useState(false);
  const [entryType, setEntryType] = useState(null);
  const [entry, setEntry] = useState(blankEntry);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const setProfileForm = (user) =>
    setForm({
      ...blankProfile,
      ...user,
      skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
    });
  const loadProfile = useCallback(async () => {
    try {
      const response = await api.get("/profile");
      setProfile(response.data?.user);
      setProfileForm(response.data?.user);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load your profile.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProfile();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadProfile]);

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };
      const response = await api.patch("/profile", payload);
      setProfile(response.data?.user);
      setProfileForm(response.data?.user);
      setEditing(false);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to save your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveEntry = async (event) => {
    event.preventDefault();
    const field = entryType === "experience" ? "experience" : "education";
    const formattedEntry =
      entryType === "experience"
        ? {
            title: entry.title,
            company: entry.organization,
            duration: entry.duration,
            description: entry.description,
          }
        : {
            title: entry.title,
            institution: entry.organization,
            duration: entry.duration,
            description: entry.description,
          };
    try {
      setSaving(true);
      setError("");
      const response = await api.patch("/profile", {
        [field]: [...entries(profile[field]), formattedEntry],
      });
      setProfile(response.data?.user);
      setEntryType(null);
      setEntry(blankEntry);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || `Unable to add ${field}.`,
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF resumes are allowed.");
      return;
    }
    try {
      setUploading(true);
      setError("");
      const data = new FormData();
      data.append("resume", file);
      const response = await api.post("/profile/resume", data);
      const uploadedResume = response.data?.resume;
      if (!uploadedResume?.publicId || !uploadedResume?.filename) {
        throw new Error("The uploaded resume details were not returned.");
      }
      setProfile((current) => ({ ...current, resume: uploadedResume }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to upload or replace your resume.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const removeResume = async () => {
    if (!window.confirm("Delete your uploaded resume? This action cannot be undone.")) return;
    try {
      setUploading(true);
      setError("");
      await api.delete("/profile/resume");
      setProfile((current) => ({ ...current, resume: null }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to remove your resume.",
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <main className="profile-page profile-state">
        <p>Loading your profile...</p>
      </main>
    );
  if (!profile)
    return (
      <main className="profile-page profile-state">
        <h1>{error || "Profile not found"}</h1>
      </main>
    );
  const resume = profile.resume;
  const hasResume = Boolean(resume?.publicId);
  const openEntryModal = (type) => {
    setEntryType(type);
    setEntry(blankEntry);
  };

  return (
    <main className="profile-page">
      <div className="section-shell profile-shell">
        <header className="profile-header">
          <div>
            <p className="eyebrow">Jobseeker workspace</p>
            <h1>My Profile</h1>
            <p>
              {profile.name} · {profile.email}
            </p>
          </div>
          {!editing && (
            <button
              className="profile-edit-button"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </header>
        {error && (
          <p className="management-error" role="alert">
            {error}
          </p>
        )}
        {editing ? (
          <form className="profile-form" onSubmit={saveProfile}>
            <div className="profile-form-grid">
              <label>
                Professional title
                <input
                  value={form.professionalTitle || ""}
                  onChange={(e) =>
                    setForm({ ...form, professionalTitle: e.target.value })
                  }
                />
              </label>
              <label>
                Phone
                <input
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                Location
                <input
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </label>
              <label>
                Skills <small>Separate with commas</small>
                <input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                />
              </label>
            </div>
            <label>
              Bio
              <textarea
                rows="5"
                maxLength="1000"
                value={form.bio || ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </label>
            <div className="profile-form-actions">
              <button
                type="button"
                className="secondary-button light-button"
                onClick={() => {
                  setEditing(false);
                  setProfileForm(profile);
                }}
              >
                Cancel
              </button>
              <button
                className="secondary-button dark-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        ) : (
          <section className="profile-card">
            <div className="profile-summary">
              <h2>
                {profile.professionalTitle || "Professional title not added"}
              </h2>
              <p>
                {profile.phone || "Phone not added"} ·{" "}
                {profile.location || "Location not added"}
              </p>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            </div>
            <div className="profile-detail">
              <h3>Skills</h3>
              <div className="profile-skills">
                {profile.skills?.length ? (
                  profile.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))
                ) : (
                  <p>Skills not added</p>
                )}
              </div>
            </div>
            <ProfileEntries
              title="Education"
              items={entries(profile.education)}
              organizationLabel="Institution"
              onAdd={() => openEntryModal("education")}
            />
            <ProfileEntries
              title="Experience"
              items={entries(profile.experience)}
              organizationLabel="Company"
              onAdd={() => openEntryModal("experience")}
            />
            <section className="profile-detail profile-resume" aria-labelledby="resume-heading">
              <div className="profile-resume-heading">
                <div className="profile-resume-icon" aria-hidden="true">PDF</div>
                <div>
                  <h3 id="resume-heading">Your resume</h3>
                  <p>Keep one current PDF ready for your profile.</p>
                </div>
              </div>
              {hasResume ? (
                <div className="profile-resume-file">
                  <div>
                    <strong title={resume.filename || "Resume.pdf"}>{resume.filename || "Resume.pdf"}</strong>
                    <span>PDF resume uploaded</span>
                  </div>
                  <div className="profile-resume-actions">
                    <button
                      type="button"
                      className="secondary-button light-button"
                      disabled={uploading}
                      onClick={async () => {
                        setError("");
                        const resumeWindow = window.open("", "_blank");
                        if (!resumeWindow) {
                          setError("Please allow pop-ups to view your resume.");
                          return;
                        }
                        try {
                          const response = await api.get("/profile/resume");
                          resumeWindow.location.replace(response.data.url);
                        } catch (requestError) {
                          resumeWindow.close();
                          setError(requestError.response?.data?.message || "Unable to open your resume.");
                        }
                      }}
                    >
                      View
                    </button>
                    <label className="secondary-button dark-button profile-upload">
                      {uploading ? "Replacing..." : "Replace"}
                      <input type="file" accept="application/pdf,.pdf" disabled={uploading} onChange={uploadResume} />
                    </label>
                    <button type="button" className="text-button" disabled={uploading} onClick={removeResume}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-resume-empty">
                  <p>No resume uploaded yet. Add a PDF to complete this part of your profile.</p>
                  <label className="secondary-button dark-button profile-upload">
                    {uploading ? "Uploading..." : "Upload resume"}
                    <input type="file" accept="application/pdf,.pdf" disabled={uploading} onChange={uploadResume} />
                  </label>
                </div>
              )}
              <small className="profile-resume-note">PDF only · Maximum file size: 5 MB</small>
            </section>
          </section>
        )}
      </div>
      {entryType && (
        <EntryModal
          type={entryType}
          entry={entry}
          setEntry={setEntry}
          saving={saving}
          onClose={() => setEntryType(null)}
          onSubmit={saveEntry}
        />
      )}
    </main>
  );
};

const ProfileEntries = ({ title, items, onAdd }) => (
  <div className="profile-detail profile-entries">
    <div className="profile-section-heading">
      <h3>{title}</h3>
      <button className="profile-add-button" onClick={onAdd}>
        + Add {title === "Education" ? "Education" : "Experience"}
      </button>
    </div>
    {items.length ? (
      items.map((item, index) => (
        <article
          key={item._id || `${item.title}-${index}`}
          className="profile-entry"
        >
          <h4>{item.title}</h4>
          <p>
            {item.company || item.institution}{" "}
            {item.duration && `· ${item.duration}`}
          </p>
          {item.description && <p>{item.description}</p>}
        </article>
      ))
    ) : (
      <p>No {title.toLowerCase()} added yet.</p>
    )}
  </div>
);

const EntryModal = ({ type, entry, setEntry, saving, onClose, onSubmit }) => {
  const label = type === "experience" ? "Company" : "University or College";
  const title = type === "experience" ? "Add Experience" : "Add Education";
  return (
    <div className="profile-modal-backdrop" role="presentation">
      <form className="profile-entry-modal" onSubmit={onSubmit}>
        <div className="profile-modal-heading">
          <div>
            <p className="eyebrow">Build your profile</p>
            <h2>{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form">
            ×
          </button>
        </div>
        <label>
          Title *
          <input
            required
            placeholder={
              type === "experience"
                ? "Frontend Developer Intern"
                : "BS Computer Science"
            }
            value={entry.title}
            onChange={(e) => setEntry({ ...entry, title: e.target.value })}
          />
        </label>
        <label>
          {label} *
          <input
            required
            placeholder={
              type === "experience" ? "DevelopersHub" : "University of Lahore"
            }
            value={entry.organization}
            onChange={(e) =>
              setEntry({ ...entry, organization: e.target.value })
            }
          />
        </label>
        <label>
          Duration
          <input
            placeholder="May 2026 - June 2026"
            value={entry.duration}
            onChange={(e) => setEntry({ ...entry, duration: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            rows="5"
            placeholder="Developed React-based interfaces..."
            value={entry.description}
            onChange={(e) =>
              setEntry({ ...entry, description: e.target.value })
            }
          />
        </label>
        <div className="profile-form-actions">
          <button
            type="button"
            className="secondary-button light-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="secondary-button dark-button" disabled={saving}>
            {saving ? "Adding..." : title}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
