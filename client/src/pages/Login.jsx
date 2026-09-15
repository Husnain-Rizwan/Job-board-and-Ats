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
      email:
        role === "jobseeker"
          ? "jobseeker@example.com"
          : "recruiter@example.com",
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
      {" "}
      <div className="auth-orbit" />{" "}
      <section className="auth-card">
        {" "}
        <div className="auth-intro">
          {" "}
          <p className="eyebrow">Welcome back</p> <h1>Log in to continue.</h1>{" "}
          <p>
            {" "}
            Pick up where you left off and keep moving toward your next
            opportunity.{" "}
          </p>{" "}
        </div>{" "}
        {registrationMessage && (
          <p className="auth-success" role="status">
            {" "}
            {registrationMessage}{" "}
          </p>
        )}{" "}
        <form className="auth-form" onSubmit={handleSubmit}>
          {" "}
          <label>
            {" "}
            Email{" "}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />{" "}
          </label>{" "}
          <label>
            {" "}
            Password{" "}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={updateField}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />{" "}
          </label>{" "}
          <div
            className="test-account-actions"
            aria-label="Test account shortcuts"
          >
            {" "}
            <button type="button" onClick={() => fillTestAccount("jobseeker")}>
              {" "}
              Test for jobseeker{" "}
            </button>{" "}
            <button type="button" onClick={() => fillTestAccount("recruiter")}>
              {" "}
              Test for recruiter{" "}
            </button>{" "}
          </div>{" "}
          <p className="text-center text-xs text-gray-400 -mt-2">
            {" "}
            Click an account to automatically fill the login details.{" "}
          </p>{" "}
          {error && (
            <p className="auth-error" role="alert">
              {" "}
              {error}{" "}
            </p>
          )}{" "}
          <button type="submit" className="auth-submit" disabled={submitting}>
            {" "}
            {submitting ? "Logging in..." : "Log In"}{" "}
          </button>{" "}
          <div className="text-center text-xs text-gray-400 my-2"> OR </div>{" "}
          <Link
            to="/register"
            className="block w-full text-center py-2.5 px-4 rounded-lg border border-green-300 text-green-600! font-medium transition hover:border-green-500 hover:text-green-900!"
          >
            {" "}
            Register Yourself{" "}
          </Link>{" "}
        </form>{" "}
      </section>{" "}
    </main>
  );
};

export default Login;
