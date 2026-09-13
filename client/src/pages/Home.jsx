import { useState } from "react";
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

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Northstar Labs",
    location: "Lahore, Pakistan",
    type: "Full-time",
    salary: "80k - 120k PKR",
    posted: "2 days ago",
    skills: ["React", "JavaScript", "Tailwind"],
    tone: "teal",
    mark: "N",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Cedar & Co.",
    location: "Remote - Worldwide",
    type: "Full-time",
    salary: "90k - 140k PKR",
    posted: "3 days ago",
    skills: ["Figma", "UX Research", "Prototyping"],
    tone: "lavender",
    mark: "C",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "Orbit Systems",
    location: "Islamabad, Pakistan",
    type: "Full-time",
    salary: "100k - 160k PKR",
    posted: "4 days ago",
    skills: ["Node.js", "MongoDB", "APIs"],
    tone: "gold",
    mark: "O",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Morrow",
    location: "Karachi, Pakistan",
    type: "Hybrid",
    salary: "75k - 115k PKR",
    posted: "5 days ago",
    skills: ["SQL", "Python", "Power BI"],
    tone: "blue",
    mark: "M",
  },
  {
    id: 5,
    title: "Mobile App Developer",
    company: "Pixel Works",
    location: "Remote - Pakistan",
    type: "Full-time",
    salary: "85k - 130k PKR",
    posted: "6 days ago",
    skills: ["React Native", "Firebase", "iOS"],
    tone: "coral",
    mark: "P",
  },
  {
    id: 6,
    title: "Growth Marketing Lead",
    company: "Brightside",
    location: "Lahore, Pakistan",
    type: "Full-time",
    salary: "90k - 135k PKR",
    posted: "1 week ago",
    skills: ["SEO", "Content", "Analytics"],
    tone: "mint",
    mark: "B",
  },
];

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
const categories = [
  "Software Development",
  "Design",
  "Data & Analytics",
  "Mobile Development",
  "Marketing",
  "Business & Finance",
  "Cybersecurity",
  "DevOps & Cloud",
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
  const categorySlug = (category) =>
    category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-");

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
      <FeaturedJobs jobs={jobs} />
      <JobCategories categories={categories} categorySlug={categorySlug} />
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
