// OlympiadHub - Client-Side Mock & Persistence Engine for Vercel / Static Deployment
// Enables 100% full-stack functionality (SuperAdmin, Student Dashboard, Exams, Quizzes, Auth) without requiring a PHP/MySQL server.

const STORAGE_PREFIX = 'olympiadhub_db_';

const initialStore = {
  users: [
    {
      id: 1,
      name: 'Super Administrator',
      email: 'admin@olympiadhub.com',
      role: 'superadmin',
      status: 'active',
      permissions: ['all'],
      created_at: '2026-01-01 10:00:00'
    },
    {
      id: 2,
      name: 'Aarav Sharma',
      email: 'student@olympiadhub.com',
      role: 'student',
      status: 'active',
      class: 'Class 6',
      grade: 'Class 6',
      school: 'Delhi Public School',
      created_at: '2026-02-15 14:30:00'
    }
  ],
  free_quizzes: [
    {
      id: 1,
      title: 'Number Systems & Roman Numerals Sprint',
      subject: 'Mathematics',
      subject_code: 'IMO',
      class: 'Class 6',
      class_name: 'Class 6',
      duration_minutes: 5,
      total_marks: 5,
      questions_count: 5,
      status: 'published',
      description: 'Quick daily 5-minute mathematics Olympiad quiz focusing on roman numerals and large number estimation.',
      questions: [
        {
          id: 1,
          q: 'What is the value of Roman numeral CLXVIII in standard Hindu-Arabic numeral system?',
          options: ['168', '148', '178', '158'],
          correct: 0,
          marks: 1,
          hint: 'C = 100, L = 50, X = 10, VIII = 8',
          explanation: 'C (100) + L (50) + X (10) + V (5) + III (3) = 168.'
        },
        {
          id: 2,
          q: 'The smallest 6-digit natural number formed using digits 4, 0, 3, 7, 1, 9 without repetition is:',
          options: ['103479', '013479', '130479', '103497'],
          correct: 0,
          marks: 1,
          hint: 'First digit cannot be zero.',
          explanation: 'Arrange digits in ascending order placing the smallest non-zero digit first: 1, 0, 3, 4, 7, 9 = 103479.'
        },
        {
          id: 3,
          q: 'Find the greatest common divisor (HCF) of 84 and 126.',
          options: ['42', '21', '14', '28'],
          correct: 0,
          marks: 1,
          hint: '84 = 42 x 2, 126 = 42 x 3',
          explanation: '84 = 2^2 x 3 x 7, 126 = 2 x 3^2 x 7. HCF = 2 x 3 x 7 = 42.'
        },
        {
          id: 4,
          q: 'A prime number is always:',
          options: ['An integer with exactly two distinct positive divisors', 'An odd number', 'A positive number ending in 1, 3, 7 or 9', 'Divisible by 3'],
          correct: 0,
          marks: 1,
          hint: 'Consider 2 as a prime number.',
          explanation: 'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.'
        },
        {
          id: 5,
          q: 'If 3x + 7 = 28, find the value of 2x - 3.',
          options: ['11', '7', '14', '9'],
          correct: 0,
          marks: 1,
          hint: 'First solve for x.',
          explanation: '3x = 21 => x = 7. Therefore 2(7) - 3 = 14 - 3 = 11.'
        }
      ]
    },
    {
      id: 2,
      title: 'Plant Kingdom & Photosynthesis Quick Check',
      subject: 'Science',
      subject_code: 'NSO',
      class: 'Class 6',
      class_name: 'Class 6',
      duration_minutes: 5,
      total_marks: 5,
      questions_count: 5,
      status: 'published',
      description: 'Test your understanding of autotrophic nutrition, stomata function, and chlorophyll action.',
      questions: [
        {
          id: 1,
          q: 'Which gas is predominantly released by green plants during the process of photosynthesis?',
          options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Methane'],
          correct: 0,
          marks: 1,
          hint: 'Essential for human respiration.',
          explanation: 'During photosynthesis in sunlight, plants convert CO2 and water into glucose and release O2 gas.'
        },
        {
          id: 2,
          q: 'The tiny pores present on the surface of leaves responsible for gaseous exchange are called:',
          options: ['Stomata', 'Chloroplasts', 'Lenticels', 'Xylem'],
          correct: 0,
          marks: 1,
          hint: 'Guarded by kidney-shaped guard cells.',
          explanation: 'Stomata are microscopic apertures mainly present on leaf epidermises that regulate transpiration and gas diffusion.'
        },
        {
          id: 3,
          q: 'Which pigment gives green color to plant leaves and traps sunlight energy?',
          options: ['Chlorophyll', 'Carotenoid', 'Anthocyanin', 'Hemoglobin'],
          correct: 0,
          marks: 1,
          hint: 'Found inside chloroplasts.',
          explanation: 'Chlorophyll absorbs blue and red wavelengths of light and reflects green light, giving plants their characteristic color.'
        }
      ]
    }
  ],
  online_classes: [
    {
      id: 1,
      title: 'Complete IMO Math Olympiad Masterclass (Classes 1-12)',
      subject: 'Mathematics',
      class: 'All',
      instructor: 'Dr. Vivek Ramanujan, IMO Medalist Coach',
      price: 1499,
      original_price: 3999,
      total_lectures: 48,
      status: 'active',
      badge: 'Bestseller',
      description: 'Comprehensive 48-lecture live series covering complete syllabus, shortcuts, mental speed tricks, and previous 10-year papers.',
      batches: [
        { id: 1, name: 'Weekend Elite Batch A', timing: 'Sat & Sun 10:00 AM - 11:30 AM', seats_left: 12 },
        { id: 2, name: 'Weekday Fast-Track Batch B', timing: 'Mon, Wed, Fri 06:00 PM - 07:00 PM', seats_left: 5 }
      ]
    },
    {
      id: 2,
      title: 'NSO Science Olympiad Booster & Concept Camp',
      subject: 'Science',
      class: 'All',
      instructor: 'Prof. Shalini Sen, Senior Research Fellow',
      price: 1299,
      original_price: 3499,
      total_lectures: 36,
      status: 'active',
      badge: 'Popular',
      description: 'In-depth visual scientific demonstrations, higher-order reasoning problems, and chapter-wise mock test solutions.'
    }
  ],
  revision_vault: [
    {
      id: 1,
      title: 'IMO Class 6 - Formula Sheet & Speed Math Cheatsheet',
      subject: 'Mathematics',
      subject_code: 'IMO',
      class: 'Class 6',
      category: 'Formula Sheet',
      download_count: 428,
      status: 'published',
      description: 'Complete one-page summary of all number system laws, geometry perimeter/area formulas, and unitary shortcuts.'
    },
    {
      id: 2,
      title: 'NSO Class 6 - Science Quick Revision Mind Maps',
      subject: 'Science',
      subject_code: 'NSO',
      class: 'Class 6',
      category: 'Mind Maps',
      download_count: 312,
      status: 'published',
      description: 'Visual flowcharts summarizing plant parts, electricity circuits, motion types, and dietary nutrients.'
    }
  ],
  exams: [
    {
      id: 1,
      title: 'National Mathematics Olympiad - All India Grand Mock Test 2026',
      subject: 'Mathematics',
      subject_code: 'IMO',
      exam_type: 'mock',
      class: 'Class 6',
      class_name: 'Class 6',
      duration_minutes: 60,
      total_questions: 10,
      total_marks: 15,
      exam_year: 2026,
      status: 'published',
      questions: [
        {
          id: 1,
          q: 'Find the sum of all prime numbers between 20 and 35.',
          options: ['83', '87', '79', '91'],
          correct: 0,
          marks: 1,
          explanation: 'The prime numbers are 23, 29, and 31. Sum = 23 + 29 + 31 = 83.'
        },
        {
          id: 2,
          q: 'A rectangular garden is 24 meters long and 15 meters wide. A walkway 2 meters wide is built around the outside of the garden. Find the area of the walkway.',
          options: ['172 sq m', '160 sq m', '180 sq m', '156 sq m'],
          correct: 0,
          marks: 2,
          explanation: 'Outer length = 24 + 4 = 28m, Outer width = 15 + 4 = 19m. Outer area = 28 x 19 = 532 sq m. Inner area = 24 x 15 = 360 sq m. Walkway area = 532 - 360 = 172 sq m.'
        },
        {
          id: 3,
          q: 'If 45% of a number is 135, what is 70% of that number?',
          options: ['210', '200', '225', '190'],
          correct: 0,
          marks: 1,
          explanation: 'Let number be N. 0.45 x N = 135 => N = 300. 70% of 300 = 0.7 x 300 = 210.'
        }
      ]
    }
  ],
  results: [
    {
      id: 101,
      user_id: 2,
      student_name: 'Aarav Sharma',
      exam_id: 1,
      exam_title: 'National Mathematics Olympiad Grand Mock 2026',
      subject: 'Mathematics',
      subject_code: 'IMO',
      score: 14,
      total_marks: 15,
      correct_count: 9,
      incorrect_count: 1,
      unattempted_count: 0,
      accuracy: 90,
      percentile: 98.5,
      rank: 3,
      time_taken_seconds: 2140,
      submitted_at: '2026-03-28 11:45:00'
    }
  ],
  academic_classes: [
    { id: 1, name: 'Nursery', code: 'NUR', order_num: 1, order_no: 1, category: 'Pre-Primary', age_group: '3-4 years old', description: 'Curriculum framework with early childhood foundational sets.', status: 'active' },
    { id: 2, name: 'LKG', code: 'LKG', order_num: 2, order_no: 2, category: 'Pre-Primary', age_group: '4-5 years old', description: 'Curriculum framework with early childhood foundational sets.', status: 'active' },
    { id: 3, name: 'UKG', code: 'UKG', order_num: 3, order_no: 3, category: 'Pre-Primary', age_group: '5-6 years old', description: 'Curriculum framework with early childhood foundational sets.', status: 'active' },
    { id: 4, name: 'Class 1', code: 'C1', order_num: 4, order_no: 4, category: 'Primary', age_group: '5-7 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 5, name: 'Class 2', code: 'C2', order_num: 5, order_no: 5, category: 'Primary', age_group: '6-8 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 6, name: 'Class 3', code: 'C3', order_num: 6, order_no: 6, category: 'Primary', age_group: '7-9 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 7, name: 'Class 4', code: 'C4', order_num: 4, order_no: 4, category: 'Primary', age_group: '8-10 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 8, name: 'Class 5', code: 'C5', order_num: 5, order_no: 5, category: 'Primary', age_group: '9-11 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 9, name: 'Class 6', code: 'C6', order_num: 9, order_no: 9, category: 'Middle', age_group: '10-12 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 10, name: 'Class 7', code: 'C7', order_num: 10, order_no: 10, category: 'Middle', age_group: '11-13 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 11, name: 'Class 8', code: 'C8', order_num: 11, order_no: 11, category: 'Middle', age_group: '12-14 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 12, name: 'Class 9', code: 'C9', order_num: 12, order_no: 12, category: 'Secondary', age_group: '13-15 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 13, name: 'Class 10', code: 'C10', order_num: 13, order_no: 13, category: 'Secondary', age_group: '14-16 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 14, name: 'Class 11', code: 'C11', order_num: 14, order_no: 14, category: 'Senior Secondary', age_group: '15-17 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' },
    { id: 15, name: 'Class 12', code: 'C12', order_num: 15, order_no: 15, category: 'Senior Secondary', age_group: '16-18 years old', description: 'Curriculum framework with Olympiad practice sets.', status: 'active' }
  ],
  academic_subjects: [
    { id: 1, name: 'Mathematics', full_name: 'Mathematics Olympiad (IMO)', code: 'IMO', slug: 'math', icon: 'Calculator', color: '#4e2a4a', category: 'Mathematics', questions_count: 50, duration_minutes: 60, status: 'active', description: 'Comprehensive Olympiad testing conceptual mastery and analytical depth.' },
    { id: 2, name: 'Science', full_name: 'Science Olympiad (NSO)', code: 'NSO', slug: 'science', icon: 'Atom', color: '#d9775b', category: 'Science', questions_count: 50, duration_minutes: 60, status: 'active', description: 'Comprehensive Olympiad testing conceptual mastery and analytical depth.' },
    { id: 3, name: 'English', full_name: 'English Olympiad (IEO)', code: 'IEO', slug: 'english', icon: 'BookOpen', color: '#6d3a68', category: 'Language', questions_count: 50, duration_minutes: 60, status: 'active', description: 'Comprehensive Olympiad testing conceptual mastery and analytical depth.' },
    { id: 4, name: 'Reasoning', full_name: 'Reasoning Olympiad (LRO)', code: 'LRO', slug: 'reasoning', icon: 'Brain', color: '#6c568d', category: 'Reasoning', questions_count: 50, duration_minutes: 60, status: 'active', description: 'Comprehensive Olympiad testing conceptual mastery and analytical depth.' },
    { id: 5, name: 'Cyber & AI', full_name: 'Cyber & AI Olympiad (ICO)', code: 'ICO', slug: 'cyber', icon: 'Cpu', color: '#b17b25', category: 'Technology', questions_count: 50, duration_minutes: 60, status: 'active', description: 'Comprehensive Olympiad testing conceptual mastery and analytical depth.' },
    { id: 6, name: 'Vocabulary', full_name: 'Vocabulary Olympiad (VC)', code: 'VC', slug: 'vocab', icon: 'Sparkles', color: '#6d3a68', category: 'Language', questions_count: 50, duration_minutes: 60, status: 'active', description: 'Comprehensive Olympiad testing conceptual mastery and analytical depth.' },
    { id: 7, name: 'Environment', full_name: 'Environment Olympiad (EGO)', code: 'EGO', slug: 'environment', icon: 'Atom', color: '#059669', category: 'Science', questions_count: 50, duration_minutes: 60, status: 'active', description: 'Comprehensive Olympiad testing conceptual mastery and analytical depth.' },
    { id: 8, name: 'Creative Arts', full_name: 'Creative Arts Olympiad (CAO)', code: 'CAO', slug: 'arts', icon: 'Palette', color: '#80497D', category: 'Arts', questions_count: 50, duration_minutes: 60, status: 'active', description: 'Comprehensive Olympiad testing conceptual mastery and analytical depth.' },
    { id: 9, name: 'General Knowledge', full_name: 'General Knowledge Olympiad (IGKO)', code: 'IGKO', slug: 'gk', icon: 'Globe', color: '#906223', category: 'General', questions_count: 50, duration_minutes: 60, status: 'active', description: 'Comprehensive Olympiad testing conceptual mastery and analytical depth.' }
  ],
  bank_settings: {
    bank_name: 'HDFC Bank Ltd',
    account_number: '50200084920194',
    ifsc_code: 'HDFC0001234',
    account_holder: 'OlympiadHub Education Pvt Ltd',
    upi_id: 'olympiadhub@hdfcbank'
  },
  orders: [],
  workbook_orders: [],
  coordinator_inquiries: [],
  school_registrations: [],
  settings: {
    site_name: 'OlympiadHub',
    support_email: 'support@olympiadhub.com',
    support_phone: '+91 98765 43210'
  }
};

function getDb(table) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + table);
    if (!raw) {
      const defaultData = initialStore[table] || [];
      localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(defaultData));
      return defaultData;
    }
    const parsed = JSON.parse(raw);
    if (table === 'academic_subjects' && (parsed.length < 9 || parsed.some(s => s.code === 'NCO' || s.code === 'RAO'))) {
      localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(initialStore.academic_subjects));
      return initialStore.academic_subjects;
    }
    if (table === 'academic_classes' && (parsed.length < 15 || !parsed.some(c => c.name === 'Nursery'))) {
      localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(initialStore.academic_classes));
      return initialStore.academic_classes;
    }
    return parsed;
  } catch (e) {
    return initialStore[table] || [];
  }
}

function saveDb(table, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export const mockEngine = {
  handleRequest(method, endpoint, body = {}, params = {}) {
    const cleanEndpoint = endpoint.split('?')[0].replace(/^\/api/, '').replace(/^\//, '');
    const segments = cleanEndpoint.split('/');
    const root = segments[0];
    const sub = segments[1];
    const subId = segments[2];

    // AUTH
    if (root === 'auth') {
      if (sub === 'login') {
        const loginId = (body.login_id || body.email || '').toLowerCase().trim();
        const isSuperAdmin = loginId.includes('admin') || loginId === 'superadmin' || loginId === 'admin@olympiadhub.com';
        const user = isSuperAdmin
          ? {
              id: 1,
              name: 'Super Administrator',
              email: 'admin@olympiadhub.com',
              role: 'superadmin',
              status: 'active',
              permissions: ['all']
            }
          : {
              id: 2,
              name: body.name || 'Aarav Sharma',
              email: loginId || 'student@olympiadhub.com',
              role: 'student',
              status: 'active',
              class: 'Class 6',
              grade: 'Class 6',
              school: 'Delhi Public School',
              permissions: []
            };

        return {
          success: true,
          message: 'Login successful',
          data: {
            token: `token_${user.role}_${Date.now()}`,
            user
          }
        };
      }

      if (sub === 'me') {
        const savedUser = sessionStorage.getItem('olympiadhub_user') || localStorage.getItem('olympiadhub_user');
        const user = savedUser ? JSON.parse(savedUser) : initialStore.users[0];
        return { success: true, data: user };
      }

      if (sub === 'logout') {
        return { success: true, message: 'Logged out' };
      }

      if (sub === 'register-student' || sub === 'register-school') {
        return { success: true, message: 'Registration submitted successfully!' };
      }
    }

    // FREE QUIZZES
    if (root === 'free-quizzes') {
      let quizzes = getDb('free_quizzes');
      if (method === 'GET') {
        return { success: true, data: quizzes };
      }
      if (method === 'POST' && sub === 'seed') {
        saveDb('free_quizzes', initialStore.free_quizzes);
        return { success: true, message: 'Reset to sample quizzes', data: initialStore.free_quizzes };
      }
      if (method === 'POST') {
        const newQuiz = {
          id: Date.now(),
          title: body.title || 'Untitled Quiz',
          subject: body.subject || 'Mathematics',
          subject_code: body.subject_code || 'IMO',
          class: body.class || body.class_name || 'Class 6',
          class_name: body.class_name || body.class || 'Class 6',
          duration_minutes: parseInt(body.duration_minutes) || 5,
          total_marks: parseInt(body.total_marks) || 5,
          questions_count: Array.isArray(body.questions) ? body.questions.length : 0,
          status: body.status || 'published',
          description: body.description || '',
          questions: Array.isArray(body.questions) ? body.questions : []
        };
        quizzes.unshift(newQuiz);
        saveDb('free_quizzes', quizzes);
        return { success: true, message: 'Free Quiz created successfully', data: newQuiz };
      }
      if (method === 'PUT' && sub) {
        quizzes = quizzes.map((q) => (String(q.id) === String(sub) ? { ...q, ...body } : q));
        saveDb('free_quizzes', quizzes);
        return { success: true, message: 'Free Quiz updated successfully' };
      }
      if (method === 'DELETE' && sub) {
        quizzes = quizzes.filter((q) => String(q.id) !== String(sub));
        saveDb('free_quizzes', quizzes);
        return { success: true, message: 'Free Quiz deleted successfully' };
      }
    }

    // ONLINE CLASSES
    if (root === 'online-classes') {
      let classes = getDb('online_classes');
      if (method === 'GET') {
        return { success: true, data: classes };
      }
      if (method === 'POST') {
        const newPkg = { id: Date.now(), ...body, status: 'active' };
        classes.unshift(newPkg);
        saveDb('online_classes', classes);
        return { success: true, message: 'Package added', data: newPkg };
      }
      if (method === 'PUT' && sub) {
        classes = classes.map((c) => (String(c.id) === String(sub) ? { ...c, ...body } : c));
        saveDb('online_classes', classes);
        return { success: true, message: 'Package updated' };
      }
      if (method === 'DELETE' && sub) {
        classes = classes.filter((c) => String(c.id) !== String(sub));
        saveDb('online_classes', classes);
        return { success: true, message: 'Package deleted' };
      }
    }

    // REVISION VAULT
    if (root === 'revision-vault') {
      let vault = getDb('revision_vault');
      if (method === 'GET') {
        return { success: true, data: vault };
      }
      if (method === 'POST') {
        const newItem = { id: Date.now(), ...body, download_count: 0 };
        vault.unshift(newItem);
        saveDb('revision_vault', vault);
        return { success: true, message: 'Revision item created', data: newItem };
      }
      if (method === 'PUT' && sub) {
        vault = vault.map((v) => (String(v.id) === String(sub) ? { ...v, ...body } : v));
        saveDb('revision_vault', vault);
        return { success: true, message: 'Revision item updated' };
      }
      if (method === 'DELETE' && sub) {
        vault = vault.filter((v) => String(v.id) !== String(sub));
        saveDb('revision_vault', vault);
        return { success: true, message: 'Revision item deleted' };
      }
    }

    // PACKAGES & SUBJECT MODEL TEST PAPERS
    if (root === 'packages') {
      let pkgs = getDb('packages');
      if (pkgs.length === 0) {
        pkgs = [
          {
            id: 101,
            title: 'Olympiads Level-2 Champs Package - Class 6',
            class_name: 'Class 6',
            subject_code: 'ICSO',
            subject_name: 'International Cyber Olympiad',
            price: 1999,
            original_price: 2500,
            header_color: '#4895d9',
            status: 'active',
            points: [
              '5 Grand Level-2 National Mock Tests',
              'Advanced HOTS & Tie-Breaker Problem Sets',
              'Detailed Video Solutions & Step-by-Step Analysis',
              'National Benchmark Percentile & AIR Ranking',
              'Unlimited Test Retake Attempts for 365 Days'
            ],
            sub_items: [
              {
                id: 'mock_icso_1',
                title: 'Mock Test Series - ICSO Class 6',
                subject: 'ICSO',
                original_price: 600.0,
                price: 400.0,
                points: ['10 ICSO Online Mock Tests', 'Aligned with SOF 2026 Pattern', 'Interactive and Downloadable'],
                is_default_selected: true
              },
              {
                id: 'pyp_icso_1',
                title: 'Previous Years Papers with Solutions - ICSO Class 6',
                subject: 'ICSO',
                original_price: 899.0,
                price: 600.0,
                points: ['6 ICSO Previous Years Papers', 'Answer keys & Explanations', 'Identify Important Topics'],
                is_default_selected: true
              }
            ]
          },
          {
            id: 102,
            title: 'Comprehensive Practice Test Pack - Class 6',
            class_name: 'Class 6',
            subject_code: 'ICSO',
            subject_name: 'International Cyber Olympiad',
            price: 1499,
            original_price: 1999,
            header_color: '#0284c7',
            status: 'active',
            points: [
              '50+ Chapter-wise Diagnostic Tests with Instant Scoring',
              'Previous 5 Years Solved Official Papers (2020-2024)',
              '10 Full-Length Timed Model Examination Papers',
              'Performance Weakness Diagnostic Heatmap',
              'Full Validity for Academic Year 2026-27'
            ],
            sub_items: []
          },
          {
            id: 103,
            title: 'Chapter-wise Synopsis & Worksheets Kit - Class 6',
            class_name: 'Class 6',
            subject_code: 'ICSO',
            subject_name: 'International Cyber Olympiad',
            price: 999,
            original_price: 1499,
            header_color: '#059669',
            status: 'active',
            points: [
              'Comprehensive Chapter-wise Theory & Formula Booklets',
              '75+ Printable High-Yield Practice Worksheets (PDFs)',
              '1000+ Curated Question Bank with Answer Keys',
              'Self-Assessment Progress Trackers for Every Unit',
              'Instant Lifetime Digital Access Across All Devices'
            ],
            sub_items: []
          },
          {
            id: 201,
            title: 'Olympiads Level-2 Champs Package - IMO Class 6',
            class_name: 'Class 6',
            subject_code: 'IMO',
            subject_name: 'International Mathematics Olympiad',
            price: 1999,
            original_price: 2500,
            header_color: '#d97706',
            status: 'active',
            points: [
              '10 Grand Level-2 National Math Mock Tests',
              'Speed Arithmetic & Mental Shortcuts Guide',
              'Step-by-Step Problem Solving Breakdown',
              'Achievers HOTS Math Section with Master Answers'
            ],
            sub_items: []
          },
          {
            id: 301,
            title: 'Olympiads Level-2 Champs Package - ISO Science Class 6',
            class_name: 'Class 6',
            subject_code: 'ISO',
            subject_name: 'International Science Olympiad',
            price: 1999,
            original_price: 2500,
            header_color: '#059669',
            status: 'active',
            points: [
              '10 NSO / ISO Science Olympiad Mock Papers',
              'Concepts, Diagram Analysis & Practical Reasoning',
              'Previous 5 Years Solved Papers',
              'Rank Booster High-Yield Questions'
            ],
            sub_items: []
          },
          {
            id: 401,
            title: 'Olympiads Level-2 Champs Package - IGKO Class 6',
            class_name: 'Class 6',
            subject_code: 'IGKO',
            subject_name: 'International General Knowledge Olympiad',
            price: 1499,
            original_price: 1999,
            header_color: '#e7b84b',
            status: 'active',
            points: [
              '8 Full-Length IGKO Grand Mock Test Papers',
              'Current Affairs Digest & Global News Summaries',
              'India & World Factbook with Life Skills Guide',
              'Instant Scoring & Section-wise Performance Heatmap'
            ],
            sub_items: []
          },
          {
            id: 501,
            title: 'Olympiads Level-2 Champs Package - IEO English Class 6',
            class_name: 'Class 6',
            subject_code: 'IEO',
            subject_name: 'International English Olympiad',
            price: 1499,
            original_price: 1999,
            header_color: '#ea580c',
            status: 'active',
            points: [
              '10 Complete IEO Model Test Papers with Solutions',
              'Grammar, Vocabulary & Reading Comprehension Booster',
              'Idioms, Proverbs & Sentence Structure Mastery',
              'National Percentile & Real Examination Simulation'
            ],
            sub_items: []
          },
          {
            id: 601,
            title: 'Olympiads Level-2 Champs Package - ISSO Reasoning Class 6',
            class_name: 'Class 6',
            subject_code: 'ISSO',
            subject_name: 'International Social Studies & Reasoning Olympiad',
            price: 1499,
            original_price: 1999,
            header_color: '#7c3aed',
            status: 'active',
            points: [
              '8 Full-Length ISSO Social Science & Reasoning Papers',
              'History, Geography & Civics Quick Revision Notes',
              'Logical & Analytical Reasoning Master Practice Sets',
              'Instant Detailed Answers with Expert Explanations'
            ],
            sub_items: []
          }
        ];
        saveDb('packages', pkgs);
      }

      if (method === 'GET') {
        const queryParams = params || {};
        const classFilter = queryParams.class || (endpoint.includes('class=') ? decodeURIComponent(endpoint.split('class=')[1].split('&')[0]) : '');
        const subjectFilter = queryParams.subject || (endpoint.includes('subject=') ? decodeURIComponent(endpoint.split('subject=')[1].split('&')[0]) : '');

        let filtered = [...pkgs];
        if (classFilter && classFilter !== 'All') {
          filtered = filtered.filter((p) => !p.class_name || p.class_name === classFilter || p.class === classFilter || p.class_name === 'All');
        }
        if (subjectFilter && subjectFilter !== 'ALL' && subjectFilter !== 'All') {
          filtered = filtered.filter((p) => !p.subject_code || p.subject_code === subjectFilter || p.subject_code === 'ALL');
        }
        return { success: true, data: filtered };
      }

      if (method === 'POST') {
        const newPkg = {
          id: Date.now(),
          title: body.title || 'New Model Test Package',
          class_name: body.class_name || body.class || 'Class 6',
          subject_code: body.subject_code || 'ICSO',
          subject_name: body.subject_name || body.subject || 'International Cyber Olympiad',
          price: Number(body.price) || 1499,
          original_price: Number(body.original_price) || 1999,
          header_color: body.header_color || '#4895d9',
          status: body.status || 'active',
          points: Array.isArray(body.points) ? body.points : (typeof body.points === 'string' ? body.points.split('\n').filter(Boolean) : []),
          sub_items: Array.isArray(body.sub_items) ? body.sub_items : []
        };
        pkgs.unshift(newPkg);
        saveDb('packages', pkgs);
        return { success: true, message: 'Model Test Package created successfully', data: newPkg };
      }

      if (method === 'PUT' && sub) {
        pkgs = pkgs.map((p) => (String(p.id) === String(sub) ? { ...p, ...body } : p));
        saveDb('packages', pkgs);
        return { success: true, message: 'Model Test Package updated successfully' };
      }

      if (method === 'DELETE' && sub) {
        pkgs = pkgs.filter((p) => String(p.id) !== String(sub));
        saveDb('packages', pkgs);
        return { success: true, message: 'Model Test Package deleted successfully' };
      }
    }

    // SUBJECT-WISE & CLASS-WISE EXAM PAPERS & MOCK TESTS (Super Admin & Student synced)
    if (root === 'exam-papers' || root === 'test-generator' || root === 'test_papers') {
      let papers = getDb('exam_papers');
      if (!papers || papers.length === 0) {
        papers = [
          {
            id: 1001,
            title: 'Class 6 IGKO Previous Year Paper 2019',
            short_code: 'IGKO - 2019',
            subject_code: 'IGKO',
            subject_name: 'IGKO (General Knowledge)',
            class_name: 'Class 6',
            paper_category: 'previous_year',
            exam_year: '2019',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#e7b84b',
            accent_color: '#d97706',
            sections: ['General Awareness', 'Current Affairs', 'Life Skills', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'General Awareness',
                q: "World's first human to human heart transplant operation was conducted by _______.",
                options: ['Christiaan Barnard', 'Robert Koch', 'Antonie van Leeuwenhoek', 'Hans Christian Gram'],
                correct: 0,
                marks: 1,
                explanation: 'Dr. Christiaan Barnard performed the first human heart transplant in 1967 at Groote Schuur Hospital in Cape Town.'
              },
              {
                id: 2,
                section: 'General Awareness',
                q: 'Which strait separates India and Sri Lanka?',
                options: ['Palk Strait', 'Malacca Strait', 'Bering Strait', 'Gibraltar Strait'],
                correct: 0,
                marks: 1,
                explanation: 'The Palk Strait lies between Tamil Nadu state of India and the Jaffna District of the Northern Province of Sri Lanka.'
              },
              {
                id: 3,
                section: 'Current Affairs',
                q: 'The headquarters of the United Nations Educational, Scientific and Cultural Organization (UNESCO) is located in:',
                options: ['Paris, France', 'Geneva, Switzerland', 'New York, USA', 'Vienna, Austria'],
                correct: 0,
                marks: 1,
                explanation: 'UNESCO headquarters is located at Place de Fontenoy in Paris, France.'
              },
              {
                id: 4,
                section: 'Life Skills',
                q: 'If you witness a friend being bullied in school, what is the most responsible action to take?',
                options: ['Report immediately to a trusted teacher or school authority', 'Join in with the bullies', 'Stay silent and ignore', 'Record a video without helping'],
                correct: 0,
                marks: 1,
                explanation: 'Reporting bullying to school authorities ensures safe intervention and support for the victim.'
              },
              {
                id: 5,
                section: 'Achievers Section',
                q: 'Identify the Nobel laureate who was the first woman to win a Nobel Prize and the only person to win in two scientific fields.',
                options: ['Marie Curie', 'Rosalind Franklin', 'Ada Lovelace', 'Barbara McClintock'],
                correct: 0,
                marks: 2,
                explanation: 'Marie Curie won Nobel Prizes in Physics (1903) and Chemistry (1911).'
              }
            ]
          },
          {
            id: 1002,
            title: 'Class 6 ICSO Previous Year Paper 2018',
            short_code: 'ICSO - 2018',
            subject_code: 'ICSO',
            subject_name: 'ICSO (Cyber & AI Olympiad)',
            class_name: 'Class 6',
            paper_category: 'previous_year',
            exam_year: '2018',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#0284c7',
            accent_color: '#0284c7',
            sections: ['Computer & IT', 'Cyber Security & AI', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Computer & IT',
                q: 'Which component of a computer coordinates and controls all the operations of hardware components?',
                options: ['Control Unit (CU)', 'Arithmetic Logic Unit (ALU)', 'Hard Disk Drive (HDD)', 'Input Unit'],
                correct: 0,
                marks: 1,
                explanation: 'The Control Unit (CU) manages and directs flow of data and instructions between CPU components.'
              },
              {
                id: 2,
                section: 'Cyber Security & AI',
                q: 'What is a firewall primarily used for in a computer network?',
                options: ['Monitoring and filtering incoming and outgoing network traffic', 'Speeding up CPU clock rate', 'Cooling down the server', 'Cleaning viruses from hard drive'],
                correct: 0,
                marks: 1,
                explanation: 'A firewall acts as a security barrier that inspects incoming and outgoing network packets based on predetermined security rules.'
              },
              {
                id: 3,
                section: 'Achievers Section',
                q: 'In Python programming, which data structure is enclosed in square brackets [ ] and is mutable?',
                options: ['List', 'Tuple', 'Dictionary', 'Set'],
                correct: 0,
                marks: 2,
                explanation: 'Lists are ordered, mutable collections enclosed in square brackets [].'
              }
            ]
          },
          {
            id: 1003,
            title: 'Class 6 IEO Level-1 Previous Year Paper 2019',
            short_code: 'IEO - 2019',
            subject_code: 'IEO',
            subject_name: 'IEO (English Olympiad)',
            class_name: 'Class 6',
            paper_category: 'previous_year',
            exam_year: '2019',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#ea580c',
            accent_color: '#ea580c',
            sections: ['Word & Structure Knowledge', 'Reading Comprehension', 'Spoken & Written Expression', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Word & Structure Knowledge',
                q: 'Choose the correct antonym for the word "ABUNDANT":',
                options: ['Scarce', 'Plentiful', 'Lavish', 'Overflowing'],
                correct: 0,
                marks: 1,
                explanation: 'Abundant means existing in large quantities; scarce means in short supply.'
              },
              {
                id: 2,
                section: 'Word & Structure Knowledge',
                q: 'Identify the sentence with correct subject-verb agreement:',
                options: ['Neither the teacher nor the students were present.', 'Neither the teacher nor the students was present.', 'Either he or I is responsible.', 'Everyone have finished their homework.'],
                correct: 0,
                marks: 1,
                explanation: 'With "neither...nor", the verb agrees with the subject closest to it ("students were").'
              },
              {
                id: 3,
                section: 'Achievers Section',
                q: 'Complete the proverb: "A bird in the hand is worth _______ in the bush."',
                options: ['two', 'one', 'three', 'four'],
                correct: 0,
                marks: 2,
                explanation: 'The standard proverb is "A bird in the hand is worth two in the bush."'
              }
            ]
          },
          {
            id: 1004,
            title: 'Class 6 IMO Level-1 Previous Year Paper 2019',
            short_code: 'IMO - 2019',
            subject_code: 'IMO',
            subject_name: 'IMO (Mathematics Olympiad)',
            class_name: 'Class 6',
            paper_category: 'previous_year',
            exam_year: '2019',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#d97706',
            accent_color: '#d97706',
            sections: ['Logical Reasoning', 'Mathematical Reasoning', 'Everyday Mathematics', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Mathematical Reasoning',
                q: 'Find the value of: (-15) + (-20) - (-35) + 12',
                options: ['12', '0', '-12', '24'],
                correct: 0,
                marks: 1,
                explanation: '-15 - 20 + 35 + 12 = -35 + 35 + 12 = 12.'
              },
              {
                id: 2,
                section: 'Logical Reasoning',
                q: 'If CAT is coded as 24 and DOG is coded as 26, how is RAT coded?',
                options: ['39', '41', '36', '43'],
                correct: 0,
                marks: 1,
                explanation: 'Sum of alphabetical positions: R(18) + A(1) + T(20) = 39.'
              },
              {
                id: 3,
                section: 'Achievers Section',
                q: 'A rectangular garden of length 24 m and breadth 18 m has a 2 m wide path running all around inside it. Find the area of the path.',
                options: ['152 sq m', '168 sq m', '144 sq m', '160 sq m'],
                correct: 0,
                marks: 2,
                explanation: 'Outer area = 24 x 18 = 432 sq m. Inner length = 20 m, inner breadth = 14 m. Inner area = 280 sq m. Path area = 432 - 280 = 152 sq m.'
              }
            ]
          },
          {
            id: 1005,
            title: 'Class 6 ISO Level-1 Previous Year Paper 2019',
            short_code: 'ISO - 2019',
            subject_code: 'ISO',
            subject_name: 'ISO (Science Olympiad)',
            class_name: 'Class 6',
            paper_category: 'previous_year',
            exam_year: '2019',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#059669',
            accent_color: '#059669',
            sections: ['Science & Experiments', 'Applied Science', 'Achievers Scientific HOTS'],
            questions: [
              {
                id: 1,
                section: 'Science & Experiments',
                q: 'Which vitamin is essential for blood clotting in the human body?',
                options: ['Vitamin K', 'Vitamin A', 'Vitamin C', 'Vitamin D'],
                correct: 0,
                marks: 1,
                explanation: 'Vitamin K plays a key role in synthesizing prothrombin, required for blood coagulation.'
              },
              {
                id: 2,
                section: 'Applied Science',
                q: 'Which among the following is a physical and reversible change?',
                options: ['Melting of ice into water', 'Rusting of iron nail', 'Burning of magnesium ribbon', 'Digestion of food'],
                correct: 0,
                marks: 1,
                explanation: 'Melting of ice involves change in physical state without forming new chemical substances.'
              },
              {
                id: 3,
                section: 'Achievers Scientific HOTS',
                q: 'Which component of a pinhole camera causes the image of the object formed on the screen to be inverted?',
                options: ['Rectilinear propagation of light in straight lines', 'Total internal reflection', 'Dispersion of white light', 'Diffraction around sharp edges'],
                correct: 0,
                marks: 2,
                explanation: 'Light travels in straight lines; light rays crossing through the tiny pinhole invert top and bottom of the image.'
              }
            ]
          },
          {
            id: 1006,
            title: 'Class 6 ISSO Reasoning & Social Studies 2019',
            short_code: 'ISSO - 2019',
            subject_code: 'ISSO',
            subject_name: 'ISSO (Social Studies & Reasoning)',
            class_name: 'Class 6',
            paper_category: 'previous_year',
            exam_year: '2019',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#7c3aed',
            accent_color: '#7c3aed',
            sections: ['Social Studies', 'Aptitude & Reasoning', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Social Studies',
                q: 'Which ancient Harappan city had a famous artificial tidal dockyard?',
                options: ['Lothal', 'Mohenjo-daro', 'Kalibangan', 'Harappa'],
                correct: 0,
                marks: 1,
                explanation: 'Lothal in Gujarat was a prominent port city with a brick basin dockyard.'
              },
              {
                id: 2,
                section: 'Aptitude & Reasoning',
                q: 'If South-East becomes North, and North-East becomes West, what will West become?',
                options: ['South-East', 'North-West', 'South-West', 'North-East'],
                correct: 0,
                marks: 1,
                explanation: 'Directions are rotated by 135 degrees anti-clockwise. West rotated 135 deg anti-clockwise becomes South-East.'
              },
              {
                id: 3,
                section: 'Achievers Section',
                q: 'The Prime Meridian passes through the Royal Astronomical Observatory located at:',
                options: ['Greenwich, London', 'Paris, France', 'Rome, Italy', 'New York, USA'],
                correct: 0,
                marks: 2,
                explanation: 'Greenwich, London is the standard reference 0 degree longitude Prime Meridian.'
              }
            ]
          },
          // SAMPLE PAPERS
          {
            id: 2001,
            title: 'Class 6 IGKO Official Sample Paper 2026',
            short_code: 'IGKO - Sample',
            subject_code: 'IGKO',
            subject_name: 'IGKO (General Knowledge)',
            class_name: 'Class 6',
            paper_category: 'sample_paper',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#e7b84b',
            accent_color: '#d97706',
            sections: ['General Awareness', 'Current Affairs', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'General Awareness',
                q: 'Which is the largest freshwater lake in India by surface area?',
                options: ['Wular Lake', 'Chilika Lake', 'Dal Lake', 'Loktak Lake'],
                correct: 0,
                marks: 1,
                explanation: 'Wular Lake in Jammu and Kashmir is the largest freshwater lake in India.'
              },
              {
                id: 2,
                section: 'Current Affairs',
                q: 'Which Indian space mission successfully landed near the lunar South Pole in 2023?',
                options: ['Chandrayaan-3', 'Mangalyaan-2', 'Aditya-L1', 'Gaganyaan-1'],
                correct: 0,
                marks: 1,
                explanation: 'Chandrayaan-3 made a historic soft landing on the Moon on August 23, 2023.'
              }
            ]
          },
          {
            id: 2002,
            title: 'Class 6 IMO Official Sample Paper 2026',
            short_code: 'IMO - Sample',
            subject_code: 'IMO',
            subject_name: 'IMO (Mathematics Olympiad)',
            class_name: 'Class 6',
            paper_category: 'sample_paper',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#d97706',
            accent_color: '#d97706',
            sections: ['Logical Reasoning', 'Mathematical Reasoning', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Mathematical Reasoning',
                q: 'What is the LCM of 12, 18, and 24?',
                options: ['72', '36', '144', '48'],
                correct: 0,
                marks: 1,
                explanation: 'Prime factorizations: 12=2^2*3, 18=2*3^2, 24=2^3*3. LCM = 2^3 * 3^2 = 8 * 9 = 72.'
              }
            ]
          },
          {
            id: 2003,
            title: 'Class 6 ISO Official Sample Paper 2026',
            short_code: 'ISO - Sample',
            subject_code: 'ISO',
            subject_name: 'ISO (Science Olympiad)',
            class_name: 'Class 6',
            paper_category: 'sample_paper',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#059669',
            accent_color: '#059669',
            sections: ['Physics', 'Chemistry', 'Biology', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Biology',
                q: 'Which green pigment in plant chloroplasts traps sunlight for photosynthesis?',
                options: ['Chlorophyll', 'Carotene', 'Anthocyanin', 'Xanthophyll'],
                correct: 0,
                marks: 1,
                explanation: 'Chlorophyll is the green pigment responsible for light absorption during photosynthesis.'
              }
            ]
          },
          {
            id: 2004,
            title: 'Class 6 ICSO Official Sample Paper 2026',
            short_code: 'ICSO - Sample',
            subject_code: 'ICSO',
            subject_name: 'ICSO (Cyber & AI Olympiad)',
            class_name: 'Class 6',
            paper_category: 'sample_paper',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            status: 'published',
            header_color: '#0284c7',
            accent_color: '#0284c7',
            sections: ['Computer & IT', 'Cyber Safety', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Computer & IT',
                q: 'What is the full form of URL in web browsing?',
                options: ['Uniform Resource Locator', 'Universal Record Link', 'Unified Resource Line', 'Universal Routing Locator'],
                correct: 0,
                marks: 1,
                explanation: 'URL stands for Uniform Resource Locator, used to address web pages.'
              }
            ]
          },
          // FULL MOCK TEST SERIES (With Subject Covers & Tests 1, 2, 3...)
          // IMO Mock Test Series
          {
            id: 3001,
            title: 'IMO Level-1 Mock Test 1 Class 6',
            short_code: 'IMO - Mock 1',
            series_title: 'Class 6 - All India IMO Mock Test Series',
            subject_code: 'IMO',
            subject_name: 'IMO (Mathematics Olympiad)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 42,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['Logical Reasoning', 'Mathematical Reasoning', 'Everyday Mathematics', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Mathematical Reasoning',
                q: 'If 3x + 15 = 45, what is the value of 2x - 5?',
                options: ['15', '10', '20', '25'],
                correct: 0,
                marks: 1,
                explanation: '3x = 45 - 15 = 30 => x = 10. Then 2(10) - 5 = 20 - 5 = 15.'
              },
              {
                id: 2,
                section: 'Logical Reasoning',
                q: 'Which of the following fractions is the largest: 3/5, 7/10, 4/7, 5/8?',
                options: ['7/10', '3/5', '4/7', '5/8'],
                correct: 0,
                marks: 1,
                explanation: '7/10 = 0.70, 5/8 = 0.625, 3/5 = 0.60, 4/7 = 0.571. Thus 7/10 is largest.'
              }
            ]
          },
          {
            id: 3002,
            title: 'IMO Level-1 Mock Test 2 Class 6',
            short_code: 'IMO - Mock 2',
            series_title: 'Class 6 - All India IMO Mock Test Series',
            subject_code: 'IMO',
            subject_name: 'IMO (Mathematics Olympiad)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 44,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['Logical Reasoning', 'Mathematical Reasoning', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Mathematical Reasoning',
                q: 'The sum of three consecutive integers is 72. Find the largest integer.',
                options: ['25', '24', '23', '26'],
                correct: 0,
                marks: 1,
                explanation: 'Let integers be n-1, n, n+1. Sum = 3n = 72 => n = 24. Largest is n+1 = 25.'
              }
            ]
          },
          {
            id: 3003,
            title: 'IMO Level-1 Mock Test 3 Class 6',
            short_code: 'IMO - Mock 3',
            series_title: 'Class 6 - All India IMO Mock Test Series',
            subject_code: 'IMO',
            subject_name: 'IMO (Mathematics Olympiad)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 40,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['Logical Reasoning', 'Mathematical Reasoning', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Mathematical Reasoning',
                q: 'The perimeter of a regular hexagon is 48 cm. Find its side length.',
                options: ['8 cm', '6 cm', '12 cm', '16 cm'],
                correct: 0,
                marks: 1,
                explanation: 'Hexagon has 6 equal sides. Side = 48 / 6 = 8 cm.'
              }
            ]
          },
          // IGKO Mock Test Series
          {
            id: 3004,
            title: 'IGKO Level-1 Mock Test 1 Class 6',
            short_code: 'IGKO - Mock 1',
            series_title: 'Class 6 - All India IGKO Mock Test Series',
            subject_code: 'IGKO',
            subject_name: 'IGKO (General Knowledge)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 42,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['General Awareness', 'Current Affairs', 'Life Skills', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'General Awareness',
                q: 'Who was the first woman President of the United Nations General Assembly?',
                options: ['Vijaya Lakshmi Pandit', 'Sarojini Naidu', 'Indira Gandhi', 'Sucheta Kripalani'],
                correct: 0,
                marks: 1,
                explanation: 'Vijaya Lakshmi Pandit was elected the first female President of UN General Assembly in 1953.'
              },
              {
                id: 2,
                section: 'Life Skills',
                q: 'What should you check first when evaluating information seen on social media?',
                options: ['Verify source credibility and official facts', 'Share immediately with everyone', 'Believe without checking', 'Post comments without reading'],
                correct: 0,
                marks: 1,
                explanation: 'Always fact-check and verify source credibility before believing or sharing digital content.'
              }
            ]
          },
          {
            id: 3005,
            title: 'IGKO Level-1 Mock Test 2 Class 6',
            short_code: 'IGKO - Mock 2',
            series_title: 'Class 6 - All India IGKO Mock Test Series',
            subject_code: 'IGKO',
            subject_name: 'IGKO (General Knowledge)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 45,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['General Awareness', 'Current Affairs', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'General Awareness',
                q: 'Which strait separates Asia from North America?',
                options: ['Bering Strait', 'Gibraltar Strait', 'Malacca Strait', 'Palk Strait'],
                correct: 0,
                marks: 1,
                explanation: 'The Bering Strait lies between Russia (Asia) and Alaska (North America).'
              }
            ]
          },
          // ISO Science Mock Test Series
          {
            id: 3006,
            title: 'ISO Level-1 Mock Test 1 Class 6',
            short_code: 'ISO - Mock 1',
            series_title: 'Class 6 - All India ISO Mock Test Series',
            subject_code: 'ISO',
            subject_name: 'ISO (Science Olympiad)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 42,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['Science & Experiments', 'Applied Science', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Applied Science',
                q: 'Why do electric wires have plastic or rubber covering on their outer surface?',
                options: ['Plastic is an insulator of electricity and prevents electric shock', 'Plastic makes the wire heavier', 'Plastic conducts electricity faster', 'Plastic reduces copper cost'],
                correct: 0,
                marks: 1,
                explanation: 'Rubber and plastics are good electrical insulators that protect users from current.'
              }
            ]
          },
          {
            id: 3007,
            title: 'ISO Level-1 Mock Test 2 Class 6',
            short_code: 'ISO - Mock 2',
            series_title: 'Class 6 - All India ISO Mock Test Series',
            subject_code: 'ISO',
            subject_name: 'ISO (Science Olympiad)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 40,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['Science & Experiments', 'Applied Science'],
            questions: [
              {
                id: 1,
                section: 'Science & Experiments',
                q: 'Which component of blood is primarily responsible for fighting infections?',
                options: ['White Blood Cells (WBCs)', 'Red Blood Cells (RBCs)', 'Platelets', 'Plasma'],
                correct: 0,
                marks: 1,
                explanation: 'White blood cells (leukocytes) protect the immune system against foreign pathogens.'
              }
            ]
          },
          // ICSO Cyber Mock Test Series
          {
            id: 3008,
            title: 'ICSO Level-1 Mock Test 1 Class 6',
            short_code: 'ICSO - Mock 1',
            series_title: 'Class 6 - All India ICSO Mock Test Series',
            subject_code: 'ICSO',
            subject_name: 'ICSO (Cyber & AI Olympiad)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 42,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['Computer Fundamentals', 'Cyber Safety & AI', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Cyber Safety & AI',
                q: 'Which protocol is used for secure encrypted communication over the World Wide Web?',
                options: ['HTTPS', 'HTTP', 'FTP', 'SMTP'],
                correct: 0,
                marks: 1,
                explanation: 'HTTPS (HyperText Transfer Protocol Secure) encrypts communication using TLS/SSL.'
              }
            ]
          },
          // IEO English Mock Test Series
          {
            id: 3009,
            title: 'IEO Level-1 Mock Test 1 Class 6',
            short_code: 'IEO - Mock 1',
            series_title: 'Class 6 - All India IEO Mock Test Series',
            subject_code: 'IEO',
            subject_name: 'IEO (English Olympiad)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 42,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['Word & Structure Knowledge', 'Reading Comprehension', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Word & Structure Knowledge',
                q: 'Choose the correct spelling:',
                options: ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'],
                correct: 0,
                marks: 1,
                explanation: 'The correct spelling is ACCOMMODATE with double c and double m.'
              }
            ]
          },
          // ISSO Reasoning Mock Test Series
          {
            id: 3010,
            title: 'ISSO Level-1 Mock Test 1 Class 6',
            short_code: 'ISSO - Mock 1',
            series_title: 'Class 6 - All India ISSO Mock Test Series',
            subject_code: 'ISSO',
            subject_name: 'ISSO (Social Studies & Reasoning)',
            class_name: 'Class 6',
            paper_category: 'mock_test',
            exam_year: '2026',
            duration_minutes: 60,
            total_marks: 60,
            cutoff_marks: 42,
            status: 'published',
            header_color: '#809926',
            accent_color: '#809926',
            sections: ['Social Science', 'Logical Reasoning', 'Achievers Section'],
            questions: [
              {
                id: 1,
                section: 'Logical Reasoning',
                q: 'Find the odd one out: 27, 64, 125, 144, 216',
                options: ['144', '27', '64', '125'],
                correct: 0,
                marks: 1,
                explanation: '27=3^3, 64=4^3, 125=5^3, 216=6^3 are perfect cubes. 144 is 12^2 (square, not a cube).'
              }
            ]
          }
        ];
        saveDb('exam_papers', papers);
      }

      if (method === 'GET') {
        const queryParams = params || {};
        const classFilter = queryParams.class || (endpoint.includes('class=') ? decodeURIComponent(endpoint.split('class=')[1].split('&')[0]) : '');
        const subjectFilter = queryParams.subject || (endpoint.includes('subject=') ? decodeURIComponent(endpoint.split('subject=')[1].split('&')[0]) : '');
        const categoryFilter = queryParams.category || queryParams.paper_category || (endpoint.includes('category=') ? decodeURIComponent(endpoint.split('category=')[1].split('&')[0]) : '');

        let filtered = [...papers];
        if (classFilter && classFilter !== 'All') {
          filtered = filtered.filter((p) => {
            const pCls = p.class_name || p.class || '';
            const match1 = pCls.match(/\d+/);
            const match2 = classFilter.match(/\d+/);
            return match1 && match2 ? match1[0] === match2[0] : pCls === classFilter;
          });
        }
        if (subjectFilter && subjectFilter !== 'ALL' && subjectFilter !== 'All') {
          filtered = filtered.filter((p) => {
            const sc = (p.subject_code || p.subject || '').toUpperCase();
            return sc.includes(subjectFilter.toUpperCase()) || subjectFilter.toUpperCase().includes(sc);
          });
        }
        if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'All') {
          filtered = filtered.filter((p) => (p.paper_category || 'previous_year') === categoryFilter || categoryFilter === 'all_papers');
        }
        return { success: true, data: filtered };
      }

      if (method === 'POST') {
        const newPaper = {
          id: Date.now(),
          title: body.title || 'New Model Test Paper',
          short_code: body.short_code || `${body.subject_code || 'EXAM'} - ${body.exam_year || '2026'}`,
          subject_code: body.subject_code || 'IMO',
          subject_name: body.subject_name || 'Mathematics Olympiad',
          class_name: body.class_name || body.class || 'Class 6',
          paper_category: body.paper_category || 'previous_year',
          exam_year: body.exam_year || '2026',
          duration_minutes: Number(body.duration_minutes) || 60,
          total_marks: Number(body.total_marks) || 60,
          cutoff_marks: Number(body.cutoff_marks) || 42,
          status: 'published',
          header_color: body.header_color || '#d97706',
          accent_color: body.accent_color || '#d97706',
          sections: Array.isArray(body.sections) && body.sections.length > 0 ? body.sections : ['General Awareness', 'Current Affairs', 'Achievers Section'],
          questions: Array.isArray(body.questions) ? body.questions : []
        };
        papers.unshift(newPaper);
        saveDb('exam_papers', papers);
        return { success: true, message: 'Model Test Paper created successfully', data: newPaper };
      }

      if (method === 'PUT' && sub) {
        papers = papers.map((p) => (String(p.id) === String(sub) ? { ...p, ...body, cutoff_marks: body.cutoff_marks !== undefined ? Number(body.cutoff_marks) : (p.cutoff_marks || 42) } : p));
        saveDb('exam_papers', papers);
        return { success: true, message: 'Model Test Paper updated successfully' };
      }

      if (method === 'DELETE' && sub) {
        papers = papers.filter((p) => String(p.id) !== String(sub));
        saveDb('exam_papers', papers);
        return { success: true, message: 'Model Test Paper deleted successfully' };
      }
    }

    // EXAMS
    if (root === 'exams') {
      let exams = getDb('exams');
      if (method === 'GET' && sub) {
        const found = exams.find((e) => String(e.id) === String(sub));
        return { success: true, data: found || exams[0] };
      }
      if (method === 'GET') {
        return { success: true, data: exams };
      }
      if (method === 'POST') {
        const newExam = { id: Date.now(), ...body };
        exams.unshift(newExam);
        saveDb('exams', exams);
        return { success: true, message: 'Exam created', data: newExam };
      }
      if (method === 'DELETE' && sub) {
        exams = exams.filter((e) => String(e.id) !== String(sub));
        saveDb('exams', exams);
        return { success: true, message: 'Exam deleted' };
      }
    }

    // EXAM ENGINE
    if (root === 'exam-engine') {
      if (sub && cleanEndpoint.includes('/start')) {
        return {
          success: true,
          data: {
            attempt_id: Date.now(),
            exam: getDb('exams')[0] || initialStore.exams[0],
            questions: (getDb('exams')[0] || initialStore.exams[0]).questions || []
          }
        };
      }
      if (sub === 'save-answer' || sub === 'security-event') {
        return { success: true, message: 'Saved' };
      }
      if (sub === 'submit') {
        const results = getDb('results');
        const newRes = {
          id: Date.now(),
          user_id: 2,
          student_name: 'Aarav Sharma',
          exam_id: body.exam_id || 1,
          exam_title: body.exam_title || 'Olympiad Exam',
          subject: 'Mathematics',
          subject_code: 'IMO',
          score: 15,
          total_marks: 15,
          correct_count: 10,
          incorrect_count: 0,
          unattempted_count: 0,
          accuracy: 100,
          percentile: 99.2,
          rank: 1,
          time_taken_seconds: 1800,
          submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        results.unshift(newRes);
        saveDb('results', results);
        return { success: true, message: 'Exam submitted successfully', data: newRes };
      }
    }

    // RESULTS & LEADERBOARD
    if (root === 'results') {
      const results = getDb('results');
      if (sub && cleanEndpoint.includes('/solutions')) {
        return {
          success: true,
          data: {
            attempt: results[0] || initialStore.results[0],
            questions: (getDb('exams')[0] || initialStore.exams[0]).questions || []
          }
        };
      }
      if (sub) {
        const found = results.find((r) => String(r.id) === String(sub));
        return { success: true, data: found || results[0] };
      }
      return { success: true, data: results };
    }

    if (root === 'leaderboard') {
      return {
        success: true,
        data: [
          { rank: 1, student_name: 'Ananya Verma', school: 'DPS RK Puram', score: 98, percentile: 99.8 },
          { rank: 2, student_name: 'Kabir Patel', school: 'National Public School', score: 95, percentile: 99.1 },
          { rank: 3, student_name: 'Aarav Sharma', school: 'St. Xavier School', score: 94, percentile: 98.7 }
        ]
      };
    }

    // ACADEMIC
    if (root === 'academic') {
      if (sub === 'classes') return { success: true, data: getDb('academic_classes') };
      if (sub === 'subjects') return { success: true, data: getDb('academic_subjects') };
      if (sub === 'chapters') return { success: true, data: [] };
      if (sub === 'topics') return { success: true, data: [] };
      if (sub === 'subject-class-content') return { success: true, data: {} };
    }

    // USERS (STUDENTS & TEACHERS)
    if (root === 'users') {
      let users = getDb('users');
      if (sub === 'students') {
        return { success: true, data: users.filter((u) => u.role === 'student') };
      }
      if (sub === 'teachers') {
        return { success: true, data: users.filter((u) => u.role === 'teacher') };
      }
      return { success: true, data: users };
    }

    // PAYMENT & SETTINGS
    if (root === 'payment') {
      if (sub === 'bank-settings') {
        return { success: true, data: getDb('bank_settings') };
      }
      if (sub === 'orders') {
        return { success: true, data: getDb('orders') };
      }
      if (sub === 'checkout') {
        return { success: true, message: 'Order created', order_id: 'ORD_' + Date.now() };
      }
    }

    if (root === 'settings') {
      return { success: true, data: getDb('settings') };
    }

    // ANALYTICS
    if (root === 'analytics') {
      return {
        success: true,
        data: {
          total_students: 1250,
          total_exams: 48,
          total_quizzes: 24,
          total_revenue: 148500,
          active_tests: 12,
          average_score: 82.4
        }
      };
    }

    // DEFAULT FALLBACK
    return { success: true, data: [], message: 'Success (Client Engine)' };
  }
};

export default mockEngine;
