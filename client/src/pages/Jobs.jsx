import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import JobSearchBar from "../components/jobsComponents/JobSearchBar";
import JobFilters from "../components/jobsComponents/JobFilters";
import JobList from "../components/jobsComponents/JobList";
import Pagination from "../components/jobsComponents/Pagination";

import api from "../services/api";

const initialFilters = {
  location: "",
  employmentType: [],
  experience: "Any",
  salary: "Any",
};

const experienceRanges = {
  "0–1 years": { minExperience: 0, maxExperience: 1 },
  "1–3 years": { minExperience: 1, maxExperience: 3 },
  "3–5 years": { minExperience: 3, maxExperience: 5 },
  "5+ years": { minExperience: 5 },
};

const salaryRanges = {
  "Under 50,000": { maxSalary: 50000 },
  "50,000–100,000": { minSalary: 50000, maxSalary: 100000 },
  "100,000–150,000": { minSalary: 100000, maxSalary: 150000 },
  "150,000+": { minSalary: 150000 },
};

const JOBS_PER_PAGE = 10;

const Jobs = () => {
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const [filters, setFilters] = useState(initialFilters);

  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(
    async ({
      searchValue = "",
      locationValue = "",
      filterValues = initialFilters,
      page = 1,
    } = {}) => {
      try {
        setLoading(true);
        setError("");

        const params = {
          search: searchValue.trim(),
          location: locationValue.trim(),
          page,
          limit: JOBS_PER_PAGE,
        };

        if (filterValues.employmentType.length > 0) {
          params.employmentType = filterValues.employmentType.join(",");
        }

        const experienceRange = experienceRanges[filterValues.experience];
        if (experienceRange) {
          Object.assign(params, experienceRange);
        }

        const salaryRange = salaryRanges[filterValues.salary];
        if (salaryRange) {
          Object.assign(params, salaryRange);
        }

        const response = await api.get("/jobs", {
          params,
        });

        setJobs(Array.isArray(response.data?.jobs) ? response.data.jobs : []);
        setCurrentPage(response.data?.currentPage || page);
        setTotalPages(Math.max(1, response.data?.totalPages || 1));
      } catch (error) {
        console.error(error);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const loadJobs = async () => {
      await fetchJobs({
        searchValue: searchParams.get("search") || "",
        locationValue: searchParams.get("location") || "",
      });
    };

    loadJobs();
  }, [fetchJobs, searchParams]);

  const updateFilter = (name, value) => {
    setFilters((current) => {
      if (name !== "employmentType") {
        return { ...current, [name]: value };
      }

      const employmentType = current.employmentType.includes(value)
        ? current.employmentType.filter((type) => type !== value)
        : [...current.employmentType, value];

      return { ...current, employmentType };
    });
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearch("");
    setLocation("");
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchJobs({
      searchValue: search,
      locationValue: location,
      filterValues: filters,
      page: 1,
    });
  };

  const applyFilters = () => {
    fetchJobs({
      searchValue: search,
      locationValue: location,
      filterValues: filters,
      page: 1,
    });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchJobs({
      searchValue: search,
      locationValue: location,
      filterValues: filters,
      page,
    });
  };

  return (
    <main className="jobs-page">
      <JobSearchBar
        search={search}
        location={location}
        onSearchChange={(event) => setSearch(event.target.value)}
        onLocationChange={(event) => setLocation(event.target.value)}
        onSubmit={handleSearch}
      />

      <section className="jobs-content section-shell">
        <JobFilters
          filters={filters}
          onFilterChange={updateFilter}
          onClear={clearFilters}
          onApply={applyFilters}
        />

        {loading && <p>Loading jobs...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && <JobList jobs={jobs} />}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
};

export default Jobs;
