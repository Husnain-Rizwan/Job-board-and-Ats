import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CompanyProfile from "./pages/CompanyProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import ProtectedRoute from "./components/ProtectedRoute";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";
import RecruiterApplications from "./pages/RecruiterApplications";
import CreateJob from "./pages/CreateJob"; // Import page
import RecruiterCompany from "./pages/RecruiterCompany";
import Profile from "./pages/Profile";
import ApplicantProfile from "./pages/ApplicantProfile";
import RecruiterProfile from "./pages/RecruiterProfile";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <SiteHeader />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/companies/:id" element={<CompanyProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Jobseeker Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["jobseeker"]} />}>
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/jobseeker/dashboard" element={<JobseekerDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Recruiter Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
          <Route path="/recruiter/jobs/create" element={<CreateJob />} />
          <Route path="/recruiter/company" element={<RecruiterCompany />} />
          <Route path="/recruiter/profile" element={<RecruiterProfile />} />
          <Route path="/recruiter/applications" element={<RecruiterApplications />} />
          <Route path="/recruiter/jobs/:jobId/applications" element={<RecruiterApplications />} />
          <Route path="/recruiter/applicants/:applicantId" element={<ApplicantProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuthPage && <SiteFooter />}
    </>
  );
}

function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}

export default App;
