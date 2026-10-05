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
      login_id: 'STU-2026-0100',
      full_name: 'Aarav Sharma',
      name: 'Aarav Sharma',
      email: 'student@olympiadhub.com',
      phone: '9876543210',
      password: 'Student@123',
      role: 'student',
      status: 'active',
      school: 'Delhi Public School',
      school_name: 'Delhi Public School',
      class: 'Class 6',
      class_name: 'Class 6',
      class_id: 6,
      section: 'A',
      roll_number: '12',
      academic_year: '2026-2027',
      dob: '2013-04-10',
      gender: 'Male',
      father_name: 'Rajesh Sharma',
      mother_name: 'Pooja Sharma',
      parent_name: 'Rajesh Sharma',
      parent_phone: '9876543210',
      parent_email: 'parent@gmail.com',
      emergency_contact: '9876543210',
      olympiad_category: 'Junior Olympiad',
      subject: 'Mathematics',
      registration_status: 'Registered',
      registered_olympiads: ['Mathematics Olympiad', 'Science Olympiad'],
      address: '42, Civil Lines',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110054',
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
      title: 'Sum of Prime Numbers Challenge',
      question_text: 'Find the sum of all prime numbers between 20 and 35.',
      subject: 'Mathematics (IMO)',
      subject_name: 'Mathematics',
      subject_code: 'IMO',
      class: 'Class 6',
      class_name: 'Class 6',
      options: ['83', '87', '79', '89'],
      option_a: '83',
      option_b: '87',
      option_c: '79',
      option_d: '89',
      correct_option: 'A',
      correct_answer: 'Option A: 83',
      explanation: 'The prime numbers between 20 and 35 are 23, 29, and 31. Therefore, Sum = 23 + 29 + 31 = 83.',
      tags: 'Tricky Question',
      difficulty: 'Intermediate',
      status: 'active'
    },
    {
      id: 2,
      title: 'Photosynthesis Byproduct & Stomata Role',
      question_text: 'Which gas is predominantly released by green plants during the process of photosynthesis in daytime?',
      subject: 'Science (NSO)',
      subject_name: 'Science',
      subject_code: 'NSO',
      class: 'Class 6',
      class_name: 'Class 6',
      options: ['Oxygen (O2)', 'Carbon Dioxide (CO2)', 'Nitrogen (N2)', 'Methane (CH4)'],
      option_a: 'Oxygen (O2)',
      option_b: 'Carbon Dioxide (CO2)',
      option_c: 'Nitrogen (N2)',
      option_d: 'Methane (CH4)',
      correct_option: 'A',
      correct_answer: 'Option A: Oxygen (O2)',
      explanation: 'During daytime photosynthesis, chlorophyll absorbs sunlight and converts carbon dioxide and water into glucose, releasing oxygen gas into the atmosphere.',
      tags: 'Concept Revision',
      difficulty: 'Easy',
      status: 'active'
    },
    {
      id: 3,
      title: 'Roman Numeral Decoding Rule',
      question_text: 'What is the value of Roman numeral CLXVIII in the standard Hindu-Arabic numeral system?',
      subject: 'Mathematics (IMO)',
      subject_name: 'Mathematics',
      subject_code: 'IMO',
      class: 'Class 6',
      class_name: 'Class 6',
      options: ['168', '148', '178', '158'],
      option_a: '168',
      option_b: '148',
      option_c: '178',
      option_d: '158',
      correct_option: 'A',
      correct_answer: 'Option A: 168',
      explanation: 'C = 100, L = 50, X = 10, VIII = 8. Adding all together: 100 + 50 + 10 + 8 = 168.',
      tags: 'Formula / Rules',
      difficulty: 'Intermediate',
      status: 'active'
    },
    {
      id: 4,
      title: 'Vocabulary & Idiomatic Expressions',
      question_text: 'Choose the correct meaning of the idiom: "A piece of cake".',
      subject: 'English (IEO)',
      subject_name: 'English',
      subject_code: 'IEO',
      class: 'Class 6',
      class_name: 'Class 6',
      options: ['Something very easy to do', 'A sweet dessert', 'A difficult challenge', 'A birthday celebration'],
      option_a: 'Something very easy to do',
      option_b: 'A sweet dessert',
      option_c: 'A difficult challenge',
      option_d: 'A birthday celebration',
      correct_option: 'A',
      correct_answer: 'Option A: Something very easy to do',
      explanation: '"A piece of cake" is an English colloquial idiom meaning a very simple task or accomplishment.',
      tags: 'Vocabulary Sprint',
      difficulty: 'Easy',
      status: 'active'
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
    if (table === 'users' && (!parsed.some(u => u.school_name || u.school))) {
      localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(initialStore.users));
      return initialStore.users;
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
        const rawLoginId = (body.login_id || body.email || body.username || '').trim();
        const loginId = rawLoginId.toLowerCase();
        const isSuperAdmin = loginId.includes('admin') || loginId === 'superadmin' || loginId === 'admin@olympiadhub.com';
        
        let foundUser = null;
        const allUsers = getDb('users') || [];
        foundUser = allUsers.find(
          (u) =>
            (u.login_id && u.login_id.toLowerCase() === loginId) ||
            (u.email && u.email.toLowerCase() === loginId) ||
            (u.student_id && u.student_id.toLowerCase() === loginId) ||
            (u.name && u.name.toLowerCase() === loginId) ||
            (u.full_name && u.full_name.toLowerCase() === loginId)
        );

        let user = null;
        if (isSuperAdmin) {
          user = {
            id: 1,
            name: 'Super Administrator',
            full_name: 'Super Administrator',
            email: 'admin@olympiadhub.com',
            login_id: 'admin',
            role: 'superadmin',
            status: 'active',
            permissions: ['all']
          };
        } else if (foundUser) {
          const uName = foundUser.full_name || foundUser.name || rawLoginId;
          user = {
            ...foundUser,
            name: uName,
            full_name: uName,
            login_id: foundUser.login_id || rawLoginId,
            student_id: foundUser.login_id || foundUser.student_id || rawLoginId,
            role: foundUser.role || 'student',
            class: foundUser.class_name || foundUser.class || foundUser.grade || 'Class 6',
            class_name: foundUser.class_name || foundUser.class || foundUser.grade || 'Class 6',
            school: foundUser.school_name || foundUser.school || 'Independent Candidate',
            email: foundUser.email || (rawLoginId.includes('@') ? rawLoginId : `${rawLoginId || 'student'}@olympiadhub.com`)
          };
        } else {
          // Capitalize loginId for proper display name (e.g., "sandeep" -> "Sandeep")
          const cleanName = rawLoginId
            ? rawLoginId.split(/[@._\s]+/).filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
            : 'Candidate Student';

          user = {
            id: Date.now(),
            name: body.name || body.full_name || cleanName,
            full_name: body.name || body.full_name || cleanName,
            login_id: rawLoginId || `STU-${Date.now().toString().slice(-4)}`,
            student_id: rawLoginId || `STU-${Date.now().toString().slice(-4)}`,
            email: rawLoginId.includes('@') ? rawLoginId : `${rawLoginId || 'student'}@olympiadhub.com`,
            role: 'student',
            status: 'active',
            class: body.class || 'Class 6',
            class_name: body.class || 'Class 6',
            grade: body.class || 'Class 6',
            school: 'Independent Candidate',
            permissions: []
          };
        }

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
        const savedUserRaw = sessionStorage.getItem('olympiadhub_user') || localStorage.getItem('olympiadhub_user');
        let user = savedUserRaw ? JSON.parse(savedUserRaw) : null;
        if (user && user.role !== 'superadmin') {
          // If the user's name is mismatched or missing, normalize it
          if (!user.full_name || !user.name) {
            const cleanName = (user.login_id || user.email || 'Student')
              .split(/[@._\s]+/)
              .filter(Boolean)
              .map(p => p.charAt(0).toUpperCase() + p.slice(1))
              .join(' ');
            user.name = cleanName;
            user.full_name = cleanName;
          }
        }
        return { success: true, data: user || initialStore.users[0] };
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
      if (!Array.isArray(vault) || vault.length === 0 || !vault[0]?.question_text) {
        vault = initialStore.revision_vault;
        saveDb('revision_vault', vault);
      }

      if (method === 'POST' && sub === 'seed') {
        saveDb('revision_vault', initialStore.revision_vault);
        return { success: true, message: 'Reset to sample revision questions', data: initialStore.revision_vault };
      }

      if (method === 'GET') {
        const queryParams = params || {};
        const classFilter = queryParams.class || (endpoint.includes('class=') ? decodeURIComponent(endpoint.split('class=')[1].split('&')[0]) : '');
        const subjectFilter = queryParams.subject || (endpoint.includes('subject=') ? decodeURIComponent(endpoint.split('subject=')[1].split('&')[0]) : '');
        const searchFilter = (queryParams.search || (endpoint.includes('search=') ? decodeURIComponent(endpoint.split('search=')[1].split('&')[0]) : '')).toLowerCase();

        let filtered = [...vault];
        if (classFilter && classFilter !== 'All') {
          filtered = filtered.filter((v) => {
            const vCls = v.class_name || v.class || '';
            const match1 = vCls.match(/\d+/);
            const match2 = classFilter.match(/\d+/);
            return match1 && match2 ? match1[0] === match2[0] : vCls.includes(classFilter);
          });
        }
        if (subjectFilter && subjectFilter !== 'All' && subjectFilter !== 'ALL') {
          filtered = filtered.filter((v) => {
            const vSub = (v.subject || v.subject_name || v.subject_code || '').toUpperCase();
            return vSub.includes(subjectFilter.toUpperCase());
          });
        }
        if (searchFilter) {
          filtered = filtered.filter((v) =>
            (v.question_text || '').toLowerCase().includes(searchFilter) ||
            (v.subject || '').toLowerCase().includes(searchFilter) ||
            (v.explanation || '').toLowerCase().includes(searchFilter)
          );
        }

        return { success: true, data: filtered };
      }

      if (method === 'POST') {
        const rawOpts = Array.isArray(body.options) && body.options.length >= 2
          ? body.options
          : [body.option_a || 'Option A', body.option_b || 'Option B', body.option_c || 'Option C', body.option_d || 'Option D'];
        
        const corrOption = (body.correct_option || 'A').toUpperCase();
        let corrAnswer = body.correct_answer || '';
        if (!corrAnswer && body[`option_${corrOption.toLowerCase()}`]) {
          corrAnswer = `Option ${corrOption}: ${body[`option_${corrOption.toLowerCase()}`]}`;
        } else if (!corrAnswer) {
          corrAnswer = `Option ${corrOption}`;
        }

        const newItem = {
          id: Date.now(),
          title: body.title || body.question_text?.substring(0, 40) || 'Revision Question',
          question_text: body.question_text || 'Question Statement',
          subject: body.subject || 'Mathematics (IMO)',
          subject_name: body.subject_name || body.subject || 'Mathematics',
          subject_code: body.subject_code || 'IMO',
          class: body.class_name || body.class || 'Class 6',
          class_name: body.class_name || body.class || 'Class 6',
          options: rawOpts,
          option_a: rawOpts[0] || body.option_a || '',
          option_b: rawOpts[1] || body.option_b || '',
          option_c: rawOpts[2] || body.option_c || '',
          option_d: rawOpts[3] || body.option_d || '',
          correct_option: corrOption,
          correct_answer: corrAnswer,
          explanation: body.explanation || '',
          tags: body.tags || 'Tricky Question',
          difficulty: body.difficulty || 'Intermediate',
          status: body.status || 'active',
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        vault.unshift(newItem);
        saveDb('revision_vault', vault);
        return { success: true, message: 'Revision question created successfully', data: newItem };
      }

      if (method === 'PUT' && sub) {
        vault = vault.map((v) => {
          if (String(v.id) === String(sub)) {
            const rawOpts = Array.isArray(body.options) && body.options.length >= 2
              ? body.options
              : (body.option_a ? [body.option_a, body.option_b, body.option_c, body.option_d] : (v.options || []));
            return {
              ...v,
              ...body,
              options: rawOpts,
              option_a: rawOpts[0] || body.option_a || v.option_a,
              option_b: rawOpts[1] || body.option_b || v.option_b,
              option_c: rawOpts[2] || body.option_c || v.option_c,
              option_d: rawOpts[3] || body.option_d || v.option_d
            };
          }
          return v;
        });
        saveDb('revision_vault', vault);
        return { success: true, message: 'Revision question updated successfully' };
      }

      if (method === 'DELETE' && sub) {
        vault = vault.filter((v) => String(v.id) !== String(sub));
        saveDb('revision_vault', vault);
        return { success: true, message: 'Revision question deleted successfully' };
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
        const rawQs = Array.isArray(body.questions) ? body.questions : [];
        const normQuestions = rawQs.map((q, idx) => {
          const qText = q.question_text || q.q || q.question || q.title || `Question ${idx + 1}`;
          const opts = Array.isArray(q.options) && q.options.length >= 2
            ? q.options
            : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'];
          let corr = 0;
          if (typeof q.correct === 'number') corr = q.correct;
          else if (q.correct_option === 'B' || q.correct === 'B') corr = 1;
          else if (q.correct_option === 'C' || q.correct === 'C') corr = 2;
          else if (q.correct_option === 'D' || q.correct === 'D') corr = 3;
          const corrOpt = ['A', 'B', 'C', 'D'][corr] || 'A';
          return {
            id: q.id || idx + 1,
            section: q.section || 'General Section',
            q: qText,
            question_text: qText,
            question: qText,
            options: opts,
            option_a: opts[0] || 'Option A',
            option_b: opts[1] || 'Option B',
            option_c: opts[2] || 'Option C',
            option_d: opts[3] || 'Option D',
            correct: corr,
            correct_option: corrOpt,
            marks: Number(q.marks) || 1,
            negative_marks: Number(q.negative_marks) || 0,
            explanation: q.explanation || q.solution || ''
          };
        });

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
          total_marks: Number(body.total_marks) || (normQuestions.length > 0 ? normQuestions.reduce((a, b) => a + (b.marks || 1), 0) : 60),
          cutoff_marks: Number(body.cutoff_marks) || 42,
          status: 'published',
          header_color: body.header_color || '#d97706',
          accent_color: body.accent_color || '#d97706',
          sections: Array.isArray(body.sections) && body.sections.length > 0 ? body.sections : ['General Awareness', 'Current Affairs', 'Achievers Section'],
          questions: normQuestions
        };
        papers.unshift(newPaper);
        saveDb('exam_papers', papers);
        return { success: true, message: 'Model Test Paper created successfully', data: newPaper };
      }

      if (method === 'PUT' && sub) {
        papers = papers.map((p) => {
          if (String(p.id) === String(sub)) {
            const rawQs = Array.isArray(body.questions) ? body.questions : (p.questions || []);
            const normQuestions = rawQs.map((q, idx) => {
              const qText = q.question_text || q.q || q.question || q.title || `Question ${idx + 1}`;
              const opts = Array.isArray(q.options) && q.options.length >= 2
                ? q.options
                : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'];
              let corr = 0;
              if (typeof q.correct === 'number') corr = q.correct;
              else if (q.correct_option === 'B' || q.correct === 'B') corr = 1;
              else if (q.correct_option === 'C' || q.correct === 'C') corr = 2;
              else if (q.correct_option === 'D' || q.correct === 'D') corr = 3;
              const corrOpt = ['A', 'B', 'C', 'D'][corr] || 'A';
              return {
                id: q.id || idx + 1,
                section: q.section || 'General Section',
                q: qText,
                question_text: qText,
                question: qText,
                options: opts,
                option_a: opts[0] || 'Option A',
                option_b: opts[1] || 'Option B',
                option_c: opts[2] || 'Option C',
                option_d: opts[3] || 'Option D',
                correct: corr,
                correct_option: corrOpt,
                marks: Number(q.marks) || 1,
                negative_marks: Number(q.negative_marks) || 0,
                explanation: q.explanation || q.solution || ''
              };
            });
            return {
              ...p,
              ...body,
              cutoff_marks: body.cutoff_marks !== undefined ? Number(body.cutoff_marks) : (p.cutoff_marks || 42),
              questions: normQuestions
            };
          }
          return p;
        });
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
        const allPapers = getDb('exam_papers');
        const allExams = getDb('exams');
        let localGenPapers = [];
        try {
          localGenPapers = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
        } catch (e) {}

        let foundPaper = allPapers.find((p) => String(p.id) === String(sub) || p.short_code === sub);
        if (!foundPaper) {
          foundPaper = localGenPapers.find((lp) => String(lp.id) === String(sub) || lp.short_code === sub);
        }
        const foundExam = allExams.find((e) => String(e.id) === String(sub));

        // If it's a mock test code like 'mock_igko_1'
        let targetSubCode = 'IMO';
        if (typeof sub === 'string' && sub.startsWith('mock_')) {
          const parts = sub.split('_');
          if (parts[1]) targetSubCode = parts[1].toUpperCase();
          if (!foundPaper) {
            foundPaper = allPapers.find((p) => (p.subject_code || '').toUpperCase() === targetSubCode);
          }
        }

        const rawQuestions = (foundPaper && Array.isArray(foundPaper.questions) && foundPaper.questions.length > 0)
          ? foundPaper.questions
          : (foundExam && Array.isArray(foundExam.questions) && foundExam.questions.length > 0)
          ? foundExam.questions
          : (allExams[0]?.questions || initialStore.exams[0]?.questions || []);

        const normalizedQuestions = rawQuestions.map((q, idx) => {
          const qText = q.question_text || q.q || q.question || q.title || `Question ${idx + 1}`;
          const opts = Array.isArray(q.options) && q.options.length >= 2
            ? q.options
            : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'];
          let corr = 0;
          if (typeof q.correct === 'number') corr = q.correct;
          else if (q.correct_option === 'B' || q.correct === 'B') corr = 1;
          else if (q.correct_option === 'C' || q.correct === 'C') corr = 2;
          else if (q.correct_option === 'D' || q.correct === 'D') corr = 3;
          const corrOpt = ['A', 'B', 'C', 'D'][corr] || 'A';
          return {
            id: q.id || idx + 1,
            section: q.section || 'General Section',
            q: qText,
            question_text: qText,
            question: qText,
            options: opts,
            option_a: opts[0] || 'Option A',
            option_b: opts[1] || 'Option B',
            option_c: opts[2] || 'Option C',
            option_d: opts[3] || 'Option D',
            correct: corr,
            correct_option: corrOpt,
            marks: Number(q.marks) || 1,
            negative_marks: Number(q.negative_marks) || 0,
            explanation: q.explanation || q.solution || ''
          };
        });

        const activeExamObj = foundPaper
          ? {
              id: foundPaper.id,
              title: foundPaper.title,
              subject_code: foundPaper.subject_code || targetSubCode,
              subject: foundPaper.subject_name || foundPaper.subject || targetSubCode,
              class: foundPaper.class_name || 'Class 6',
              duration_minutes: foundPaper.duration_minutes || 60,
              total_marks: foundPaper.total_marks || (normalizedQuestions.length * 1),
              total_questions: normalizedQuestions.length,
              passing_percentage: 40,
              questions: normalizedQuestions
            }
          : (foundExam || {
              id: sub,
              title: `${targetSubCode} National Mock Examination`,
              subject_code: targetSubCode,
              subject: `${targetSubCode} Olympiad`,
              class: 'Class 6',
              duration_minutes: 60,
              total_marks: normalizedQuestions.length * 1,
              total_questions: normalizedQuestions.length,
              passing_percentage: 40,
              questions: normalizedQuestions
            });

        return {
          success: true,
          data: {
            attempt_id: Date.now(),
            exam: activeExamObj,
            questions: normalizedQuestions
          }
        };
      }
      if (sub === 'save-answer' || sub === 'security-event') {
        return { success: true, message: 'Saved' };
      }
      if (sub === 'submit') {
        const results = getDb('results');
        const allPapers = getDb('exam_papers');
        const foundPaper = allPapers.find((p) => String(p.id) === String(body.exam_id));
        const activeUser = JSON.parse(sessionStorage.getItem('olympiadhub_user') || localStorage.getItem('olympiadhub_user') || '{}');
        const totalMarks = Number(body.total_marks) || (foundPaper ? foundPaper.total_marks : 60);
        const score = Number(body.score !== undefined ? body.score : Math.round(totalMarks * 0.85));
        const correctCount = Number(body.correct_count !== undefined ? body.correct_count : Math.round(score / (totalMarks / 10 || 1)));
        const percentage = Number(body.percentage !== undefined ? body.percentage : (totalMarks > 0 ? (score / totalMarks) * 100 : 80));

        const newRes = {
          id: Date.now(),
          attempt_id: Date.now(),
          user_id: activeUser?.id || body.student_id || 2,
          student_id: activeUser?.id || body.student_id || 2,
          student_name: activeUser?.full_name || activeUser?.name || body.student_name || 'Candidate',
          student_login_id: activeUser?.login_id || body.student_login_id || 'STU-001',
          student_email: activeUser?.email || body.student_email || '',
          exam_id: body.exam_id || 1,
          exam_title: body.exam_title || (foundPaper ? foundPaper.title : 'Olympiad Exam'),
          subject: foundPaper ? (foundPaper.subject_name || foundPaper.subject_code) : (body.subject || 'General Knowledge'),
          subject_name: foundPaper ? (foundPaper.subject_name || foundPaper.subject_code) : (body.subject || 'General Knowledge'),
          subject_code: foundPaper ? foundPaper.subject_code : (body.subject_code || 'IGKO'),
          score: score,
          total_marks: totalMarks,
          total_questions: Number(body.total_questions) || totalMarks,
          correct_count: correctCount,
          incorrect_count: Number(body.incorrect_count !== undefined ? body.incorrect_count : Math.max(0, totalMarks - correctCount)),
          unattempted_count: Number(body.unanswered_count || 0),
          percentage: percentage,
          accuracy: Number(body.accuracy !== undefined ? body.accuracy : Math.round(percentage)),
          passed: percentage >= 40,
          percentile: 98.4,
          rank: 1,
          time_taken_seconds: Number(body.time_taken_seconds || 1800),
          submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        results.unshift(newRes);
        saveDb('results', results);
        return { success: true, message: 'Exam submitted successfully', data: newRes };
      }
    }

    // RESULTS & LEADERBOARD
    if (root === 'results') {
      const results = getDb('results') || [];
      if (sub && cleanEndpoint.includes('/solutions')) {
        const attemptId = String(sub).replace('/solutions', '');
        let targetAttempt = null;

        // Check local storage for the matching attempt
        const localKeys = [
          'olympiadhub_last_submitted_exam',
          'olympiadhub_student_attempts',
          'olympiadhub_db_results',
          'test_generator_attempts',
          'student_test_attempts'
        ];

        for (const k of localKeys) {
          try {
            const raw = localStorage.getItem(k);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                targetAttempt = parsed.find(a => String(a.id || a.attempt_id) === String(attemptId));
                if (!targetAttempt && !attemptId) targetAttempt = parsed[0];
              } else if (parsed && typeof parsed === 'object') {
                if (String(parsed.id || parsed.attempt_id) === String(attemptId) || !attemptId) {
                  targetAttempt = parsed;
                }
              }
            }
            if (targetAttempt && Array.isArray(targetAttempt.questions) && targetAttempt.questions.length > 0) break;
          } catch (e) {}
        }

        if (!targetAttempt) {
          targetAttempt = results.find(r => String(r.id || r.attempt_id) === String(attemptId)) || results[0];
        }

        let questionsList = [];
        if (targetAttempt && Array.isArray(targetAttempt.questions) && targetAttempt.questions.length > 0) {
          questionsList = targetAttempt.questions;
        } else if (targetAttempt?.exam_id) {
          const allPapers = getDb('exam_papers') || [];
          const matchedPaper = allPapers.find(p => String(p.id) === String(targetAttempt.exam_id));
          if (matchedPaper && Array.isArray(matchedPaper.questions)) {
            questionsList = matchedPaper.questions;
          }
        }

        const totalQ = questionsList.length;
        const correctCount = targetAttempt?.correct_count !== undefined
          ? targetAttempt.correct_count
          : questionsList.filter(q => q.is_correct || (q.userSelected !== undefined && q.userSelected === q.correct)).length;
        const totalMarks = targetAttempt?.total_marks || totalQ || 10;
        const score = targetAttempt?.score !== undefined ? targetAttempt.score : correctCount;

        const attemptMeta = {
          id: targetAttempt?.id || attemptId,
          attempt_id: targetAttempt?.attempt_id || attemptId,
          exam_id: targetAttempt?.exam_id || 1,
          exam_title: targetAttempt?.exam_title || targetAttempt?.title || 'Olympiad Exam',
          title: targetAttempt?.exam_title || targetAttempt?.title || 'Olympiad Exam',
          total_questions: totalQ,
          total_marks: totalMarks,
          score: score,
          cutoff_marks: targetAttempt?.cutoff_marks || Math.round(totalMarks * 0.4),
          correct_count: correctCount,
          wrong_count: targetAttempt?.wrong_count !== undefined ? targetAttempt.wrong_count : Math.max(0, totalQ - correctCount),
          unanswered_count: targetAttempt?.unanswered_count || 0,
          time_spent_seconds: targetAttempt?.time_spent_seconds || targetAttempt?.time_taken_seconds || 1800,
          time_taken_seconds: targetAttempt?.time_taken_seconds || targetAttempt?.time_spent_seconds || 1800,
          duration_minutes: targetAttempt?.duration_minutes || 60,
          submitted_at: targetAttempt?.submitted_at || new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        return {
          success: true,
          data: {
            attempt: attemptMeta,
            solutions: questionsList,
            questions: questionsList
          }
        };
      }
      if (cleanEndpoint.includes('/history') || sub === 'history') {
        const user = JSON.parse(sessionStorage.getItem('olympiadhub_user') || localStorage.getItem('olympiadhub_user') || '{}');
        const localKeys = [
          'olympiadhub_last_submitted_exam',
          'olympiadhub_student_attempts',
          'olympiadhub_db_results',
          'test_generator_attempts',
          'student_test_attempts'
        ];
        let allAtts = [];
        localKeys.forEach(k => {
          try {
            const raw = localStorage.getItem(k);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) allAtts.push(...parsed);
              else if (parsed && typeof parsed === 'object') allAtts.push(parsed);
            }
          } catch (e) {}
        });
        getDb('results')?.forEach(r => allAtts.push(r));

        const matched = allAtts.filter(a => {
          if (!user || (!user.id && !user.login_id && !user.email)) return true;
          return (user.id && (String(a.student_id) === String(user.id) || String(a.user_id) === String(user.id))) ||
                 (user.login_id && ((a.student_login_id && a.student_login_id.toLowerCase() === user.login_id.toLowerCase()) || (a.login_id && a.login_id.toLowerCase() === user.login_id.toLowerCase()))) ||
                 (user.email && a.student_email && a.student_email.toLowerCase() === user.email.toLowerCase()) ||
                 (user.full_name && a.student_name && a.student_name.toLowerCase() === user.full_name.toLowerCase());
        });
        return { success: true, data: matched.length > 0 ? matched : allAtts };
      }
      if (sub && sub !== 'all') {
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

      // GET queries
      if (method === 'GET') {
        if (sub === 'students') {
          return { success: true, data: users.filter((u) => u.role === 'student') };
        }
        if (sub === 'teachers') {
          return { success: true, data: users.filter((u) => u.role === 'teacher') };
        }
        if (sub) {
          const user = users.find((u) => String(u.id) === String(sub) || u.login_id === sub);
          return { success: true, data: user || null };
        }
        return { success: true, data: users };
      }

      // Reset password (POST /users/:id/reset-password or POST /users/reset-password)
      if (method === 'POST' && (sub === 'reset-password' || subId === 'reset-password')) {
        const targetId = subId === 'reset-password' ? sub : body.user_id || body.id;
        const newPass = body.new_password || body.password || 'Student@123';
        users = users.map((u) =>
          String(u.id) === String(targetId) || u.login_id === String(targetId)
            ? { ...u, password: newPass, confirm_password: newPass }
            : u
        );
        saveDb('users', users);
        return { success: true, message: 'Password reset successfully', new_password: newPass };
      }

      // Toggle status (POST /users/:id/toggle-status)
      if (method === 'POST' && subId === 'toggle-status') {
        users = users.map((u) => {
          if (String(u.id) === String(sub)) {
            const nextStatus = u.status === 'active' ? 'inactive' : 'active';
            return { ...u, status: nextStatus };
          }
          return u;
        });
        saveDb('users', users);
        return { success: true, message: 'Status updated successfully' };
      }

      // Bulk delete (POST /users/bulk-delete)
      if (method === 'POST' && sub === 'bulk-delete') {
        const idsToDelete = Array.isArray(body.ids) ? body.ids.map(String) : [];
        users = users.filter((u) => !idsToDelete.includes(String(u.id)));
        saveDb('users', users);
        return { success: true, message: `${idsToDelete.length} user(s) deleted successfully` };
      }

      // Create new user (POST /users)
      if (method === 'POST') {
        const classes = getDb('academic_classes');
        const assignedClass = classes.find((c) => String(c.id) === String(body.class_id)) || {};
        const newId = Date.now();
        const autoLoginId = body.login_id || `STU-${new Date().getFullYear()}-${String(users.length + 1).padStart(4, '0')}`;

        const newUser = {
          id: newId,
          role: body.role || 'student',
          login_id: autoLoginId,
          student_id: autoLoginId,
          full_name: body.full_name || 'New Student',
          name: body.full_name || 'New Student',
          email: body.email || '',
          phone: body.phone || '',
          password: body.password || 'Student@123',
          confirm_password: body.password || 'Student@123',
          status: body.status || 'active',
          avatar: body.avatar || body.profile_photo || '',
          profile_photo: body.avatar || body.profile_photo || '',

          // School & Academic Details
          school_name: body.school_name || 'Independent Candidate',
          school: body.school_name || 'Independent Candidate',
          school_address: body.school_address || '',
          class_id: body.class_id || 6,
          class_name: body.class_name || assignedClass.name || 'Class 6',
          class: body.class_name || assignedClass.name || 'Class 6',
          grade: body.class_name || assignedClass.name || 'Class 6',
          section: body.section || 'A',
          roll_number: body.roll_number || '1',
          academic_year: body.academic_year || '2026-2027',
          registration_status: body.registration_status || 'Registered',

          // Personal & Parent Details
          dob: body.dob || '2012-05-15',
          gender: body.gender || 'Male',
          father_name: body.father_name || '',
          mother_name: body.mother_name || '',
          guardian_name: body.guardian_name || body.father_name || '',
          parent_name: body.parent_name || body.father_name || '',
          parent_phone: body.parent_phone || body.phone || '',
          parent_email: body.parent_email || body.email || '',
          emergency_contact: body.emergency_contact || body.parent_phone || body.phone || '',

          // Address
          address: body.address || '',
          city: body.city || '',
          state: body.state || '',
          pincode: body.pincode || '',

          // Olympiad & Document Info
          registered_olympiads: body.registered_olympiads || ['Mathematics Olympiad', 'Science Olympiad'],
          created_at: new Date().toISOString()
        };

        users.unshift(newUser);
        saveDb('users', users);
        return { success: true, message: 'User created successfully', data: newUser };
      }

      // Update user (PUT /users/:id)
      if (method === 'PUT' && sub) {
        let updatedUser = null;
        users = users.map((u) => {
          if (String(u.id) === String(sub) || u.login_id === String(sub)) {
            const updated = {
              ...u,
              ...body,
              school_name: body.school_name !== undefined ? body.school_name : (u.school_name || u.school),
              school: body.school_name !== undefined ? body.school_name : (u.school || u.school_name),
              student_id: body.login_id || u.student_id || u.login_id,
              login_id: body.login_id || u.login_id || u.student_id,
              password: body.password || u.password,
              confirm_password: body.password || u.confirm_password || u.password
            };
            updatedUser = updated;
            return updated;
          }
          return u;
        });

        saveDb('users', users);
        return { success: true, message: 'User updated successfully', data: updatedUser };
      }

      // Delete user (DELETE /users/:id)
      if (method === 'DELETE' && sub) {
        users = users.filter((u) => String(u.id) !== String(sub) && u.login_id !== String(sub));
        saveDb('users', users);
        return { success: true, message: 'User deleted successfully' };
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
      if (sub === 'student') {
        const results = getDb('results') || [];
        const user = JSON.parse(sessionStorage.getItem('olympiadhub_user') || localStorage.getItem('olympiadhub_user') || '{}');
        
        // Filter results strictly for active student
        const studentResults = results.filter((r) => {
          if (!user || (!user.id && !user.login_id && !user.email)) return false;
          return (r.student_id && (r.student_id === user.id || String(r.student_id) === String(user.id))) ||
                 (r.student_login_id && (r.student_login_id === user.login_id || r.login_id === user.login_id)) ||
                 (r.student_email && user.email && r.student_email.toLowerCase() === user.email.toLowerCase()) ||
                 (r.user_id && (r.user_id === user.id || String(r.user_id) === String(user.id)));
        });

        const totalAttempts = studentResults.length;
        const passedCount = studentResults.filter(r => !!r.passed || parseFloat(r.percentage || 0) >= 40).length;
        const totalPct = studentResults.reduce((acc, r) => acc + parseFloat(r.percentage || 0), 0);
        const avgScore = totalAttempts > 0 ? Math.round(totalPct / totalAttempts) : 0;
        const bestScore = studentResults.length > 0 ? Math.round(Math.max(...studentResults.map(r => parseFloat(r.percentage || 0)))) : 0;
        
        // Subject breakdown
        const subjectMap = {};
        studentResults.forEach(r => {
          const subName = r.subject_name || r.subject || r.exam_title || 'General Olympiad';
          if (!subjectMap[subName]) {
            subjectMap[subName] = { subject_name: subName, total_answered: 0, correct_count: 0, total_pct: 0, count: 0 };
          }
          subjectMap[subName].count += 1;
          const qCount = parseInt(r.total_questions || r.total_marks || 10);
          const cCount = parseInt(r.correct_count || r.score || 0);
          subjectMap[subName].total_answered += qCount;
          subjectMap[subName].correct_count += cCount;
          subjectMap[subName].total_pct += parseFloat(r.percentage || (qCount > 0 ? (cCount / qCount) * 100 : 0));
        });

        const subjectProgress = Object.values(subjectMap).map(s => ({
          subject_name: s.subject_name,
          accuracy: s.total_answered > 0 ? Math.round((s.correct_count / s.total_answered) * 100) : Math.round(s.total_pct / s.count),
          total_answered: s.total_answered,
          correct_count: s.correct_count
        }));

        const scoreTrend = studentResults.slice(0, 10).reverse().map((r, idx) => ({
          label: `Test ${idx + 1}`,
          percentage: parseFloat(r.percentage || 0),
          score: r.score,
          exam_title: r.exam_title || r.title
        }));

        return {
          success: true,
          data: {
            metrics: {
              total_attempts: totalAttempts,
              total_passed: passedCount,
              avg_score: avgScore,
              best_score: bestScore,
              best_rank: totalAttempts > 0 ? 1 : null
            },
            recent_attempts: studentResults,
            subject_progress: subjectProgress,
            score_trend: scoreTrend
          }
        };
      }

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
