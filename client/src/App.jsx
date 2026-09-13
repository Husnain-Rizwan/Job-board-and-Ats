import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/companies/:id" element={<CompanyProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Jobseeker Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["jobseeker"]} />}>
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/jobseeker/dashboard" element={<JobseekerDashboard />} />
        </Route>

        {/* Recruiter Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
          <Route path="/recruiter/jobs/create" element={<CreateJob />} />
          <Route path="/recruiter/applications" element={<RecruiterApplications />} />
          <Route path="/recruiter/jobs/:jobId/applications" element={<RecruiterApplications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;