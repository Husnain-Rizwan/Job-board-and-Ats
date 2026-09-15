import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { saveAuthToken } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const registrationMessage = location.state?.message || "";

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const fillTestAccount = (role) => {
    setError("");
    setForm({
      email: role === "jobseeker" ? "jobseeker@example.com" : "recruiter@example.com",
      password: "123456",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      const response = await api.post("/auth/login", form);
      saveAuthToken(response.data.token);
      login(response.data.user);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || "Unable to log in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page login-page">
      <div className="auth-orbit" />
      <section className="auth-card">
        <div className="auth-intro"><p className="eyebrow">Welcome back</p><h1>Log in to continue.</h1><p>Pick up where you left off and keep moving toward your next opportunity.</p></div>
        {registrationMessage && <p className="auth-success" role="status">{registrationMessage}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email<input type="email" name="email" value={form.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" required /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={updateField} placeholder="Your password" autoComplete="current-password" required /></label>
          <div className="test-account-actions" aria-label="Test account shortcuts">
            <button type="button" onClick={() => fillTestAccount("jobseeker")}>Test for jobseeker</button>
            <button type="button" onClick={() => fillTestAccount("recruiter")}>Test for recruiter</button>
          </div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? "Logging in..." : "Log In"}</button>
        </form>
        <p className="auth-footer">Don&apos;t have an account? <Link to="/register">Create one</Link></p>
      </section>
    </main>
  );
};

export default Login;
