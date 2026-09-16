# Job Board & Application Tracking System

A full-stack **Job Board and Application Tracking System** built with the MERN stack. The platform allows jobseekers to discover and apply for jobs while recruiters can create and manage job postings, review applicants, and track their application status through an ATS workflow.

## 🔗 Links

**Live Demo:** https://job-board-and-ats.vercel.app/

**GitHub Repository:** https://github.com/Husnain-Rizwan

**Portfolio:** https://husnain-rzwan-portfolio.netlify.app/

---

## ✨ Features

### 👤 Jobseeker

* User registration and login
* Browse available jobs
* Search and filter jobs
* View detailed job information
* Save jobs
* Create and manage a professional profile
* Upload and manage resume
* Apply for jobs
* Upload resume with application
* Add a cover letter
* Track submitted applications
* View application status
* Jobseeker dashboard with application statistics

### 🏢 Recruiter

* Recruiter authentication
* Create and manage company information
* Create and manage job postings
* View jobs posted by the recruiter
* View applicants for specific jobs
* View applicant profiles
* View applicant resumes
* View cover letters
* Update applicant ATS status
* Track applicant progress through different hiring stages
* Recruiter dashboard with job and application statistics

### 📊 Application Tracking System

Applications can move through different hiring stages:

**Applied → Shortlisted → Interview → Selected / Rejected**

The system also keeps track of application status history.

### 🔐 Authentication & Security

* JWT-based authentication
* HTTP-only cookies
* Password hashing with bcrypt
* Role-based authorization
* Protected API routes
* Recruiter and jobseeker-specific access
* Resume upload restrictions
* Environment variables for sensitive configuration

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* React Router
* Tailwind CSS
* Axios
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Cloudinary

### Deployment

* Vercel
* MongoDB Atlas
* Cloudinary

---

## 🏗️ Project Structure

```text
job-board/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Husnain-Rizwan/job-board-and-ats.git
cd job-board
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔄 Application Workflow

### Jobseeker Flow

```text
Register/Login
      ↓
Create Profile
      ↓
Browse Jobs
      ↓
View Job Details
      ↓
Apply
      ↓
Upload Resume + Cover Letter
      ↓
Track Application
      ↓
Monitor ATS Status
```

### Recruiter Flow

```text
Login
  ↓
Create Company
  ↓
Create Job
  ↓
Receive Applications
  ↓
Review Applicants
  ↓
View Resume & Cover Letter
  ↓
Update ATS Status
  ↓
Track Hiring Progress
```

---

## 📌 Current Project Status

This project is currently a **functional MVP** focused on demonstrating the core workflow of a modern job board and application tracking system.

Future improvements may include:

* Email notifications
* Advanced recruiter analytics
* Job recommendations
* Improved resume parsing
* Interview scheduling
* Real-time notifications
* Admin management
* More advanced ATS filtering
* Improved UI/UX

---

## 🎯 Purpose

This project was built as a practical full-stack application to strengthen my experience with **React, Node.js, Express.js, MongoDB, REST APIs, authentication, role-based authorization, file uploads, and deployment**.

It focuses on solving a real-world problem rather than being a simple CRUD application.

---

## 👨‍💻 Author

**Muhammad Husnain**

**MERN Stack Developer**

* GitHub: https://github.com/Husnain-Rizwan
* LinkedIn: https://www.linkedin.com/in/muhammad-husnain0/
* Portfolio: https://husnain-rzwan-portfolio.netlify.app/
* Live Project: https://job-board-and-ats.vercel.app/
