import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await api.post("/auth/register", form);
      navigate("/login", {
        state: { message: "Account created successfully. Please log in." },
      });
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          "Unable to create your account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page register-page">
      <div className="auth-orbit" />
      <section className="auth-card">
        <div className="auth-intro">
          <p className="eyebrow">Start your next chapter</p>
          <h1>Create your account</h1>
          <p>Join a better way to find opportunities and build your career.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Your full name"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={updateField}
              placeholder="At least 6 characters"
              minLength="6"
              required
            />
          </label>
          <fieldset>
            <legend>Register as</legend>
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="jobseeker"
                checked={form.role === "jobseeker"}
                onChange={updateField}
              />
              Job Seeker
            </label>
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={form.role === "recruiter"}
                onChange={updateField}
              />
              Recruiter
            </label>
          </fieldset>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
