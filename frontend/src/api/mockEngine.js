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
    { id: 1, name: 'Class 1', code: 'C1', order_num: 1 },
    { id: 2, name: 'Class 2', code: 'C2', order_num: 2 },
    { id: 3, name: 'Class 3', code: 'C3', order_num: 3 },
    { id: 4, name: 'Class 4', code: 'C4', order_num: 4 },
    { id: 5, name: 'Class 5', code: 'C5', order_num: 5 },
    { id: 6, name: 'Class 6', code: 'C6', order_num: 6 },
    { id: 7, name: 'Class 7', code: 'C7', order_num: 7 },
    { id: 8, name: 'Class 8', code: 'C8', order_num: 8 },
    { id: 9, name: 'Class 9', code: 'C9', order_num: 9 },
    { id: 10, name: 'Class 10', code: 'C10', order_num: 10 },
    { id: 11, name: 'Class 11', code: 'C11', order_num: 11 },
    { id: 12, name: 'Class 12', code: 'C12', order_num: 12 }
  ],
  academic_subjects: [
    { id: 1, name: 'Mathematics', code: 'IMO', icon: 'Calculator' },
    { id: 2, name: 'Science', code: 'NSO', icon: 'Atom' },
    { id: 3, name: 'English', code: 'IEO', icon: 'BookOpen' },
    { id: 4, name: 'Cyber & Computer', code: 'NCO', icon: 'Cpu' },
    { id: 5, name: 'General Knowledge', code: 'IGKO', icon: 'Globe' },
    { id: 6, name: 'Logical Reasoning', code: 'RAO', icon: 'Brain' }
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
    return JSON.parse(raw);
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
