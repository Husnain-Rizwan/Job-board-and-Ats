import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/homeComponents/HeroSection";
import PopularSearches from "../components/homeComponents/PopularSearches";
import FeaturedJobs from "../components/homeComponents/FeaturedJobs";
import JobCategories from "../components/homeComponents/JobCategories";
import HowItWorks from "../components/homeComponents/HowItWorks";
import JobSeekerSection from "../components/homeComponents/JobSeekerSection";
import RecruiterSection from "../components/homeComponents/RecruiterSection";
import StatsSection from "../components/homeComponents/StatsSection";
import CTASection from "../components/homeComponents/CTASection";
import api from "../services/api";

const popularSearches = [
  "Frontend Developer",
  "Backend Developer",
  "MERN Stack Developer",
  "Software Engineer",
  "UI/UX Designer",
  "Data Analyst",
  "Remote Jobs",
  "Internships",
];
const seekers = [
  "Build your profile",
  "Upload your resume",
  "Search and filter jobs",
  "Save jobs",
  "Apply online",
  "Track your applications",
];
const recruiters = [
  "Create your company profile",
  "Post job openings",
  "Receive applications",
  "Review candidates",
  "Change application status",
  "Manage your hiring pipeline",
];

const Home = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const searchFor = (term) =>
    navigate(`/jobs?search=${encodeURIComponent(term)}`);
  useEffect(() => {
    const loadLatestJobs = async () => {
      try {
        setJobsLoading(true);
        const [response, categoriesResponse] = await Promise.all([
          api.get("/jobs", { params: { page: 1, limit: 6 } }),
          api.get("/jobs/categories"),
        ]);
        setJobs(Array.isArray(response.data?.jobs) ? response.data.jobs : []);
        setCategories(Array.isArray(categoriesResponse.data?.categories) ? categoriesResponse.data.categories : []);
      } catch (requestError) {
        console.error("Unable to load home page jobs:", requestError);
        setJobsError("Latest jobs are unavailable right now.");
      } finally {
        setJobsLoading(false);
      }
    };

    void loadLatestJobs();
  }, []);

  return (
    <main className="home-page">
      <HeroSection
        query={query}
        location={location}
        onQueryChange={(event) => setQuery(event.target.value)}
        onLocationChange={(event) => setLocation(event.target.value)}
        onSearch={handleSearch}
      />
      <PopularSearches searches={popularSearches} onSearch={searchFor} />
      <FeaturedJobs jobs={jobs} loading={jobsLoading} error={jobsError} />
      <JobCategories categories={categories} />
      <HowItWorks />
      <section className="section-shell audience-section">
        <JobSeekerSection benefits={seekers} />
        <RecruiterSection benefits={recruiters} />
      </section>
      <StatsSection />
      <CTASection />
    </main>
  );
};

export default Home;
