# OlympiadHub – Advanced Online Examination & Olympiad Platform

**OlympiadHub** is a production-grade, full-stack, responsive Online Examination and Olympiad Management Software engineered for national-scale assessments.

---

## Architecture

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Modular Component Architecture
* **Backend**: PHP 8 REST API, PDO MySQL, Token Authentication, Server-Side Security Proctoring
* **Database**: MySQL normalized schema with 21 relational tables & seeded datasets
* **Exam Engine**: Distraction-free live portal, auto-save state, anti-cheating tab detection, HH:MM:SS countdown timers, and deterministic rank calculations

---

## Default Login Credentials

| Role | Login ID | Password | Portal Features |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `ADMIN001` | `Admin@123` | Full system control, faculty & student creation, custom RBAC permissions, question bank, exam scheduling, scorecards, audit logs |
| **Teacher** | `TCH101` | `Teacher@123` | Question authoring, CSV import, exam generation, student progress & accuracy analytics |
| **Teacher** | `TCH102` | `Teacher@123` | Multi-subject evaluation & leaderboard tracking |
| **Student** | `STU1001` | `Student@123` | Class 10 candidate (Aarav Mehta), live test engine, results, detailed solutions, merit certificates |
| **Student** | `STU1002` | `Student@123` | Class 10 candidate (Priya Deshmukh), 100% merit scorecard |
| **Student** | `STU1003` | `Student@123` | Class 8 candidate (Kabir Patel) |
| **Student** | `STU1004` | `Student@123` | Class 5 candidate (Sneha Reddy) |

---

## Key Modules & Implementation

### 1. Distraction-Free Exam Engine
* Real-time countdown timer (`HH:MM:SS`) with server-side expiry enforcement
* Live response auto-saving on every option selection
* Question Palette with status indicators (Answered, Not Answered, Marked for Review, Not Visited)
* Proctoring Security with window blur & tab-switch limit warning modals
* Review & Submit modal with response counts before locking

### 2. Comprehensive Question Bank
* Filter by Class (1–12), Subject, Chapter, and Difficulty (Easy, Medium, Hard)
* Exact 4-option MCQ standard with positive/negative marks and step-by-step explanations
* Validated CSV/Excel bulk import with duplicate detection and row error diagnostics
* Downloadable CSV template

### 3. Examination Management
* Supports 4 Exam Types: Free Trial, Practice Tests, Mock Olympiads, and Modular Paid Exams
* Configurable passing percentages, negative grading, and attempt limits
* Option shuffling & question randomization
* Class and individual candidate assignment mappings

### 4. Results & Detailed Solutions
* Instant automated score evaluation and accuracy breakdown
* Subject-wise proficiency bars and time spent metrics
* Step-by-step solution explanations visible after submission based on exam rules

### 5. Deterministic Rankings & Leaderboard
* Exam-wise and All-India Olympiad style rankings
* Strict deterministic tie-breaking (Score DESC, Time Taken ASC, Submission Time ASC)

### 6. Official Merit Certificates
* Cryptographic SHA-256 verification hash
* Unique Certificate ID generation for qualifying scores
* Public certificate verification portal at `#/verify-certificate`

---

## Local URLs

* **Frontend Web Application**: [http://127.0.0.1:3000](http://127.0.0.1:3000)
* **Backend REST API**: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
