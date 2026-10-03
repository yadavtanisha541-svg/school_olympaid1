// Master Data & LocalStorage Synchronizer for FAQs, Key Info Dropdown, Exam Dates, Syllabus, Sample Papers & Marking Scheme

export const DEFAULT_KEY_INFO_DROPDOWN = [
  { id: 'faqs', label: 'FAQs', page: 'faqs', badge: '', enabled: true, order: 1 },
  { id: 'schedule', label: 'Exam Dates', page: 'schedule', badge: '', enabled: true, order: 2 },
  { id: 'syllabus', label: 'Exam Syllabus', page: 'syllabus', badge: '', enabled: true, order: 3 },
  { id: 'sample-papers', label: 'Sample Papers', page: 'sample-papers', badge: 'Mock Tests', enabled: true, order: 4 },
  { id: 'pattern', label: 'Marking Scheme', page: 'pattern', badge: '', enabled: true, order: 5 }
];

export const DEFAULT_SUPERADMIN_FAQS = [
  {
    id: 'faq-1',
    category: 'General & Venue',
    q: 'What will be the venue of the exams?',
    a: 'SkillRise Olympiad exams are conducted 100% online through our secure, AI-proctored examination portal. Students can take the exams conveniently from home or from their school computer labs using a laptop, desktop, or tablet equipped with a working webcam and steady internet connection.',
    enabled: true,
    order: 1
  },
  {
    id: 'faq-2',
    category: 'General & Venue',
    q: 'If appearing for online mode, on which devices can the exam be taken?',
    a: 'The examination can be taken on desktop computers, laptops, and tablets with modern web browsers like Google Chrome, Microsoft Edge, or Mozilla Firefox. A functional web camera (front-facing) and a minimum internet connection speed of 1 Mbps are required for AI-powered live proctoring.',
    enabled: true,
    order: 2
  },
  {
    id: 'faq-3',
    category: 'Integrity & Proctoring',
    q: 'Is there a likelihood of cheating if students take exam from home?',
    a: 'No. SkillRise Olympiads employs a multi-layered AI proctoring system that includes continuous webcam monitoring, face recognition, tab-switch detection, fullscreen lockdown, copy-paste blocking, and human audit reviews to ensure 100% fair play and examination integrity.',
    enabled: true,
    order: 3
  },
  {
    id: 'faq-4',
    category: 'Subjects & Curriculum',
    q: 'Which all subjects are covered under SkillRise Olympiads?',
    a: 'SkillRise Olympiads covers 9 major disciplines for Nursery to Class 12: Mathematics Olympiad (IMO), Science Olympiad (NSO), English Olympiad (IEO), Cyber & AI Olympiad (ICO), Reasoning Olympiad (IRO), Vocabulary Championship (IVC), Environmental Studies (GECO), Creative Arts (ICAO), and General Knowledge (IGKO).',
    enabled: true,
    order: 4
  },
  {
    id: 'faq-5',
    category: 'Registration & Fees',
    q: 'How can a school register for SkillRise Olympiads?',
    a: 'Schools can register online directly through our dedicated "School Registration" page by providing school and coordinator information. Alternatively, schools can download the Offline Registration Form (PDF) and email the student batch details to schools@skillrise.org.',
    enabled: true,
    order: 5
  },
  {
    id: 'faq-6',
    category: 'Registration & Fees',
    q: 'Do you accept individual registrations for SkillRise Olympiads?',
    a: 'Yes. Students whose schools are not participating can register independently as individual candidates through the "Student Registration" portal on our website for any subject and grade from Nursery to Class 12.',
    enabled: true,
    order: 6
  },
  {
    id: 'faq-7',
    category: 'Syllabus & Pattern',
    q: 'Where can I find the Syllabus of Olympiad Subjects?',
    a: 'You can explore detailed class-wise and subject-wise syllabi directly under the "Exam Syllabus" section in the navigation menu. Each subject syllabus includes chapter-by-chapter topics, question weightages, and marking schemes.',
    enabled: true,
    order: 7
  },
  {
    id: 'faq-8',
    category: 'Registration & Fees',
    q: 'What is the exam fee for each subject?',
    a: 'For individual registrations, the examination fee is ₹250 per subject ($15 for international students), which includes access to full-length online mock papers. For school-coordinated registrations, the institutional fee is ₹150 per student.',
    enabled: true,
    order: 8
  },
  {
    id: 'faq-9',
    category: 'Preparation & Trial',
    q: 'Before paying the fees, I would like to take a trial of the platform. Is there any option for the same?',
    a: 'Yes! SkillRise provides a 100% Free Trial Experience where students can take an authentic practice test with webcam setup check, instant score calculation, and step-by-step solution explanations without requiring payment details.',
    enabled: true,
    order: 9
  },
  {
    id: 'faq-10',
    category: 'Syllabus & Pattern',
    q: 'What is the structure and pattern of the examination?',
    a: 'The examination contains Multiple Choice Questions (MCQs) divided into 3 sections: Core Subject Knowledge, Logical Reasoning, and Higher Order Thinking Skills (Achievers Section). Total duration is 45 to 60 minutes with 35 to 50 questions. There is no negative marking.',
    enabled: true,
    order: 10
  },
  {
    id: 'faq-11',
    category: 'Rankings & Awards',
    q: 'What are the criteria for ranking in SkillRise Olympiads?',
    a: 'National and international ranks are determined on total marks scored. In the event of a score tie, ranking criteria prioritize: higher marks in the Achievers / HOTS Section, followed by lower time taken, followed by fewest incorrect questions.',
    enabled: true,
    order: 11
  },
  {
    id: 'faq-12',
    category: 'Rankings & Awards',
    q: 'What awards, scholarships, and certificates do students receive?',
    a: 'Merit rankers receive Gold, Silver, and Bronze Medals, Excellence Trophies, cash scholarships up to ₹50,000, and verifiable Digital Merit Certificates. Every participant receives an official Participation Certificate and comprehensive Diagnostic Performance Analysis.',
    enabled: true,
    order: 12
  },
  {
    id: 'faq-13',
    category: 'Results & Answer Keys',
    q: 'How and when will the results and answer keys be declared?',
    a: 'Official answer keys are published within 72 hours of exam conclusion. Final scorecards, percentiles, zonal ranks, and national leaderboards are released within 2 to 3 weeks on the "Results & Rankings" page.',
    enabled: true,
    order: 13
  },
  {
    id: 'faq-14',
    category: 'Support & Helpdesk',
    q: 'Whom do I contact if I have questions or need technical support?',
    a: 'Our academic and technical support desk is available Monday to Saturday (9:00 AM to 6:00 PM IST). You can email us at support@skillrise.org or call/WhatsApp at +91 11 4988 2000.',
    enabled: true,
    order: 14
  }
];

// Helper to get active Key Info dropdown items with localStorage persistence
export const getKeyInfoDropdownItems = () => {
  try {
    const raw = localStorage.getItem('olympiadhub_keyinfo_dropdown_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(item => item.enabled !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_KEY_INFO_DROPDOWN.filter(item => item.enabled !== false);
};

// Helper to get all FAQs with localStorage persistence
export const getDynamicFaqsList = () => {
  try {
    const raw = localStorage.getItem('olympiadhub_superadmin_faqs_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(item => item.enabled !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_SUPERADMIN_FAQS.filter(item => item.enabled !== false);
};
