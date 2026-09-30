# OlympiadHub — Premium Online Olympiad Examination Ecosystem

**Tagline:** *Learn. Practice. Compete. Achieve.*

---

## 🌟 Overview

**OlympiadHub** is a complete, modern, and professional EdTech Olympiad examination ecosystem designed for students from **Nursery & Kindergarten up to Class 10**. 

The platform features an original academic identity, a light navy/teal color theme, and includes:

1. **Public Academic Portal:**
   - Sticky Header with custom SVG Academic Achievement Logo & Navigation
   - Hero section with live mock preview badge
   - Filterable upcoming Olympiad examinations list
   - Olympiad category cards (Mathematics, Science, English, Cyber & AI, Logical Reasoning, General Knowledge)
   - 4-step visual flow (*Choose Olympiad → Register → Prepare & Practice → Take Exam & Achieve*)
   - 8 Why OlympiadHub feature highlights
   - Official Sample Papers & Previous Year Papers repository with instant online solving & answer key
   - Animated Live Academic Counters (Students Participated, Olympiads Conducted, Practice Questions, Schools Connected)
   - Testimonials & Structured FAQ accordion
   - Comprehensive footer with sitemap & accreditation links

2. **State-of-the-Art Proctored Online Examination Engine:**
   - Real-time countdown timer with auto-submit
   - 5-State Question Palette:
     - ⚪ Not Visited
     - 🟢 Answered
     - 🔴 Not Answered
     - 🟣 Marked for Review
     - 🟣🟢 Answered + Marked for Review
   - Single-choice selection, clear choice, next/previous, and mark for review
   - Persistent real-time state auto-saving
   - Security monitoring with anti-tab switch detection
   - Responsive touch-friendly layout for mobile, tablet, and desktop

3. **Instant Diagnostic Result & Performance Dashboard:**
   - Overall Score, Percentage, Attempted, Correct, Incorrect, Accuracy Rate, and Time Taken
   - Topic-Wise Mastery breakdown (e.g., Fractions & Decimals, Numbers, Geometry, Logical Reasoning)
   - Step-by-Step Question Review modal with explanations for every question
   - Direct integration to Claim Certificate and National Leaderboard

4. **Dynamic Certificate Generator:**
   - Authentic, high-resolution Certificate of Achievement
   - Student Name, Class, Olympiad Name, Score, National Rank, Certificate ID, Verification Hash, Authorized Seal & Signature
   - One-click PDF Print & Download

5. **Multi-Role Portals:**
   - **Student Portal:** Personalized dashboard, active registered exams, practice mock launcher, rank & certificates.
   - **Parent Portal:** Learning time tracker, strongest subjects, improvement recommendations, exam schedule, report download.
   - **School Portal:** Institutional coordinator dashboard, national rank (#12), student roster, and **Bulk Student CSV Importer** with sample CSV download.
   - **Payment & Checkout Simulator:** Instant registration checkout, order ID, GST invoice summary, and seat confirmation.

6. **SuperAdmin Control Hub:**
   - Live analytics & participation metrics
   - Question Bank CRUD (Add, Edit, Delete, Filter by subject/class/difficulty)
   - Exam & Schedule Manager
   - Result & Merit list publisher
   - Student & School Directory
   - Platform Security & Proctoring Settings

---

## 🚀 How to Run

1. Open `index.html` directly in any modern web browser (Chrome, Firefox, Edge, Safari):
   ```
   file:///C:/Users/HP/.gemini/antigravity/scratch/olympiadhub/index.html
   ```
2. Or serve it via any static local web server.

---

## 🎨 Color Palette & Design Tokens

- **Primary Background:** Soft Off-White / Crisp White (`#F8FAFC`, `#FFFFFF`)
- **Primary Brand Color:** Deep Navy / Royal Blue (`#0F2744`, `#1E3A8A`)
- **Secondary Accent:** Mint / Teal (`#0D9488`, `#14B8A6`, `#059669`)
- **Academic Gold:** `#D97706` / `#F59E0B`
- **Typography:** `Plus Jakarta Sans`, `Inter`, `JetBrains Mono`

---

## 📁 Directory Structure

```
olympiadhub/
├── index.html                  # Master application entry point
├── README.md                   # System documentation
├── css/
│   └── styles.css              # Theme, animations, print rules, question palette styles
├── js/
│   ├── db.js                   # Relational database schema & rich pre-seeded mock dataset
│   ├── exam-engine.js          # Interactive proctored online MCQ examination engine
│   ├── analytics.js            # Result calculation, topic breakdown & solution review
│   ├── certificate.js          # Dynamic verifiable certificate generator & PDF export
│   ├── portals.js              # Student, Parent, School portals & payment checkout
│   ├── admin.js                # Full SuperAdmin dashboard & Question Bank CRUD
│   └── app.js                  # Master router, auth demo switcher & UI coordinator
└── assets/
    ├── logo.svg                # Original OlympiadHub academic upward achievement logo
    └── favicon.svg             # Favicon & icon mark
```
