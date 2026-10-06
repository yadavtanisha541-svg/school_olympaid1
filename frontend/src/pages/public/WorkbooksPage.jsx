import React, { useState, useMemo } from 'react';
import { apiClient } from '../../api/client';
import {
  BookOpen,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  FileText,
  Download,
  ShoppingBag,
  CreditCard,
  Sparkles,
  ChevronDown,
  Info,
  Check,
  AlertCircle,
  Eye,
  X,
  ExternalLink,
  Truck,
  ShieldCheck
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi (NCR)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

const STUDENT_CLASSES = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

const TEACHER_STAGES = [
  'Primary Stage (Class 1-5)',
  'Middle Stage (Class 6-8)',
  'Secondary Stage (Class 9-10)',
  'Senior Secondary Stage (Class 11-12)',
  'Senior Faculty (All Tiers)'
];

export const WorkbooksPage = ({ onNavigatePublic, onOpenRegister }) => {
  // Form State
  const [userType, setUserType] = useState('student'); // 'student' | 'teacher'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    country: 'India (+91)',
    state: 'Madhya Pradesh',
    whatsapp: '',
    classLevel: 'Class 5',
    teacherStage: 'Primary Stage (Class 1-5)'
  });

  // Workbook Format: 'digital' | 'physical'
  const [workbookFormat, setWorkbookFormat] = useState('digital');

  // Selected Workbook item IDs
  const [selectedBookIds, setSelectedBookIds] = useState([]);

  // Delivery Address Form (for Physical)
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    mobileNumber: '',
    email: ''
  });

  // Modal State for Index Preview & Order Receipt
  const [previewBookIndex, setPreviewBookIndex] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  // Dynamic Workbooks Generation based on Grade/Role
  const currentClass = userType === 'student' ? formData.classLevel : formData.teacherStage;

  const availableWorkbooks = useMemo(() => {
    const isEarly = ['Nursery', 'LKG', 'UKG'].includes(formData.classLevel) && userType === 'student';

    if (userType === 'teacher') {
      return [
        {
          id: 'tch-math',
          subject: 'Mathematics',
          title: `SkillRise Teacher Mathematics Olympiad - ${formData.teacherStage}`,
          coverBg: 'from-[#4e2a4a] to-[#6d3a68]',
          price: workbookFormat === 'digital' ? 250 : 300,
          chapters: ['Advanced Pedagogy', 'Competitive HOTS Blueprint', 'Solved Question Bank 500+', 'Answer Explanations']
        },
        {
          id: 'tch-sci',
          subject: 'Science',
          title: `SkillRise Teacher Science Olympiad - ${formData.teacherStage}`,
          coverBg: 'from-[#d9775b] to-[#c85e42]',
          price: workbookFormat === 'digital' ? 250 : 300,
          chapters: ['Investigative Lab Experiments', 'Physics & Chemistry Concept Models', 'Life Sciences & Ecology', 'Mock Papers']
        },
        {
          id: 'tch-digital',
          subject: 'Digital Literacy',
          title: `SkillRise Teacher Digital Literacy Olympiad - ${formData.teacherStage}`,
          coverBg: 'from-[#0284c7] to-[#0369a1]',
          price: workbookFormat === 'digital' ? 250 : 300,
          chapters: ['Computational Logic Pedagogy', 'Cyber Security Frameworks', 'AI & Digital Tools Integration', 'Master Assessments']
        },
        {
          id: 'tch-eng',
          subject: 'English',
          title: `SkillRise Teacher English Olympiad - ${formData.teacherStage}`,
          coverBg: 'from-[#6d3a68] to-[#8c4e8b]',
          price: workbookFormat === 'digital' ? 250 : 300,
          chapters: ['Syntactical Mastery', 'Lexical Depth & Etymology', 'Comprehension Pedagogy', 'Diagnostic Rubrics']
        },
        {
          id: 'tch-gk',
          subject: 'General Knowledge',
          title: `SkillRise Teacher GK Olympiad - ${formData.teacherStage}`,
          coverBg: 'from-[#e7b84b] to-[#d9775b]',
          price: workbookFormat === 'digital' ? 250 : 300,
          chapters: ['Global Affairs & Heritage', 'Scientific Milestones', 'Civics & Environmental Dynamics', 'Master Quizzes']
        },
        {
          id: 'tch-hindi',
          subject: 'Hindi',
          title: `SkillRise Teacher Hindi Olympiad - ${formData.teacherStage}`,
          coverBg: 'from-[#dc2626] to-[#991b1b]',
          price: workbookFormat === 'digital' ? 250 : 300,
          chapters: ['हिंदी व्याकरण शिक्षण', 'साहित्य एवं भाषा बोध', 'वर्तनी एवं वाक्य विश्लेषण', 'अभ्यास प्रश्न पत्र']
        }
      ];
    }

    if (isEarly) {
      return [
        {
          id: 'early-math',
          subject: 'Mathematics',
          title: `SkillRise Mathematics Olympiad Workbook - ${formData.classLevel}`,
          coverBg: 'from-[#4e2a4a] to-[#6d3a68]',
          price: workbookFormat === 'digital' ? 200 : 250,
          chapters: ['Pre-Number Concepts & Shapes', 'Object Counting 1 to 50', 'Picture Addition & Subtraction', 'Patterns & Time Intuition']
        },
        {
          id: 'early-sci',
          subject: 'Science',
          title: `SkillRise Science Olympiad Workbook - ${formData.classLevel}`,
          coverBg: 'from-[#d9775b] to-[#c85e42]',
          price: workbookFormat === 'digital' ? 200 : 250,
          chapters: ['Living & Non-Living Things', 'Our Natural Environment', 'Good Habits & Safety Rules', 'Animals, Birds & Homes']
        },
        {
          id: 'early-digital',
          subject: 'Digital Literacy',
          title: `SkillRise Digital Literacy Workbook - ${formData.classLevel}`,
          coverBg: 'from-[#0284c7] to-[#0369a1]',
          price: workbookFormat === 'digital' ? 200 : 250,
          chapters: ['Computer Parts & Screen Interaction', 'Keyboard & Mouse Basics', 'Safe Internet Habits', 'Fun Tech Activity Puzzles']
        },
        {
          id: 'early-eng',
          subject: 'English',
          title: `SkillRise English Olympiad Workbook - ${formData.classLevel}`,
          coverBg: 'from-[#6d3a68] to-[#8c4e8b]',
          price: workbookFormat === 'digital' ? 200 : 250,
          chapters: ['Alphabet & Phonic Sounds', 'Picture Vocabulary & Everyday Items', 'Rhyming Words & Sound Patterns', 'Opposites & Story Sequences']
        },
        {
          id: 'early-gk',
          subject: 'General Knowledge',
          title: `SkillRise GK Olympiad Workbook - ${formData.classLevel}`,
          coverBg: 'from-[#e7b84b] to-[#d9775b]',
          price: workbookFormat === 'digital' ? 200 : 250,
          chapters: ['Our Body & Senses', 'Incredible India & Festivals', 'Animals & Plants Around Us', 'Good Manners & Safety']
        },
        {
          id: 'early-hindi',
          subject: 'Hindi',
          title: `SkillRise Hindi Olympiad Workbook - ${formData.classLevel}`,
          coverBg: 'from-[#dc2626] to-[#991b1b]',
          price: workbookFormat === 'digital' ? 200 : 250,
          chapters: ['स्वर एवं व्यंजन पहचान', 'सरल शब्द एवं चित्र मिलान', 'कविता एवं बाल कहानियाँ', 'सरल अभ्यास']
        }
      ];
    }

    return [
      {
        id: 'std-math',
        subject: 'Mathematics',
        title: `SkillRise Mathematics Olympiad Workbook - ${formData.classLevel}`,
        coverBg: 'from-[#4e2a4a] to-[#6d3a68]',
        price: workbookFormat === 'digital' ? 250 : 300,
        chapters: ['Number Sense & Operations', 'Fractions, Decimals & Unitary Method', 'Geometry, Perimeter & Area', 'Algebra & Data Handling', 'Achievers HOTS Section']
      },
      {
        id: 'std-sci',
        subject: 'Science',
        title: `SkillRise Science Olympiad Workbook - ${formData.classLevel}`,
        coverBg: 'from-[#d9775b] to-[#c85e42]',
        price: workbookFormat === 'digital' ? 250 : 300,
        chapters: ['Plants & Animals Kingdom', 'Human Body Systems & Nutrition', 'Matter, Force & Simple Machines', 'Environment & Pollution', 'Achievers Science Hotspot']
      },
      {
        id: 'std-digital',
        subject: 'Digital Literacy',
        title: `SkillRise Digital Literacy Olympiad Workbook - ${formData.classLevel}`,
        coverBg: 'from-[#0284c7] to-[#0369a1]',
        price: workbookFormat === 'digital' ? 250 : 300,
        chapters: ['Computer Hardware & OS Fundamentals', 'Software, Cloud & Office Tools', 'Cyber Safety & Digital Etiquette', 'AI Literacy & Coding Concepts']
      },
      {
        id: 'std-eng',
        subject: 'English',
        title: `SkillRise English Olympiad Workbook - ${formData.classLevel}`,
        coverBg: 'from-[#6d3a68] to-[#8c4e8b]',
        price: workbookFormat === 'digital' ? 250 : 300,
        chapters: ['Word and Structure Knowledge (Grammar)', 'Reading Comprehension & Critical Inference', 'Lexical Depth & Synonyms/Antonyms', 'Achievers Verbal Aptitude']
      },
      {
        id: 'std-gk',
        subject: 'General Knowledge',
        title: `SkillRise General Knowledge Workbook - ${formData.classLevel}`,
        coverBg: 'from-[#e7b84b] to-[#d9775b]',
        price: workbookFormat === 'digital' ? 250 : 300,
        chapters: ['India & The World Geography', 'Science, Discovery & Space', 'Current Affairs & Global Summits', 'Sports, Awards & Civics']
      },
      {
        id: 'std-hindi',
        subject: 'Hindi',
        title: `SkillRise Hindi Olympiad Workbook - ${formData.classLevel}`,
        coverBg: 'from-[#dc2626] to-[#991b1b]',
        price: workbookFormat === 'digital' ? 250 : 300,
        chapters: ['वर्ण विचार एवं वर्तनी शुद्धि', 'शब्द विचार एवं व्याकरण', 'पर्यायवाची, विलोम एवं मुहावरे', 'अपठित गद्यांश एवं भाषा बोध']
      }
    ];
  }, [userType, formData.classLevel, formData.teacherStage, workbookFormat]);

  // Handle Toggle Select Book
  const handleToggleBook = (bookId) => {
    if (selectedBookIds.includes(bookId)) {
      setSelectedBookIds(selectedBookIds.filter(id => id !== bookId));
    } else {
      setSelectedBookIds([...selectedBookIds, bookId]);
    }
  };

  // Calculations
  const selectedBooksList = availableWorkbooks.filter(b => selectedBookIds.includes(b.id));
  const subtotal = selectedBooksList.reduce((acc, b) => acc + b.price, 0);
  const deliveryCharge = workbookFormat === 'physical' ? (selectedBooksList.length >= 3 ? 0 : (selectedBooksList.length > 0 ? 100 : 0)) : 0;
  const grandTotal = subtotal + deliveryCharge;

  // Handle Checkout / Pay
  const handleCheckout = (e) => {
    e.preventDefault();
    const newErrs = {};

    if (!formData.name.trim()) newErrs.name = 'Please enter full name';
    if (!formData.email.trim()) newErrs.email = 'Please enter email';
    if (formData.email && formData.confirmEmail && formData.email !== formData.confirmEmail) {
      newErrs.confirmEmail = 'Email addresses do not match';
    }
    if (!formData.whatsapp.trim()) newErrs.whatsapp = 'Please enter WhatsApp mobile number';
    if (formData.whatsapp && formData.whatsapp.replace(/\D/g, '').length < 10) {
      newErrs.whatsapp = 'Please enter a valid 10-digit mobile number';
    }
    if (selectedBookIds.length === 0) {
      newErrs.books = 'Please select at least 1 workbook from the table';
    }

    if (workbookFormat === 'physical') {
      if (!deliveryAddress.addressLine1.trim()) newErrs.addressLine1 = 'Address Line 1 is required';
      if (!deliveryAddress.city.trim()) newErrs.city = 'City is required';
      if (!deliveryAddress.pincode.trim()) newErrs.pincode = 'Pincode is required';
      if (!deliveryAddress.mobileNumber.trim()) newErrs.mobileNumber = 'Mobile number is required';
    }

    if (Object.keys(newErrs).length > 0) {
      setErrors(newErrs);
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setErrors({});
    const orderId = `SKL-WB-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderPayload = {
      orderId,
      userType,
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      format: workbookFormat,
      classLevel: currentClass,
      books: selectedBooksList,
      subtotal,
      deliveryCharge,
      grandTotal,
      address: workbookFormat === 'physical' ? deliveryAddress : null
    };

    // Save automatically to MySQL database
    apiClient.post('/workbooks/order', orderPayload).catch((err) => {
      console.warn('Auto-save order notice:', err);
    });

    setOrderSuccess(orderPayload);
  };

  const scrollToAnchor = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f2] font-sans text-[#2a1b29] pb-24">
      
      {/* Top Banner Notice */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4 space-y-3">
        <p className="text-xs sm:text-sm text-[#4e2a4a] leading-relaxed">
          Looking for additional practice? Go for <strong>SkillRise Olympiad Workbook(s)</strong> available for <strong>Classes 1 to 12</strong> in <strong>Mathematics, Science, English, Spell Bee / Vocabulary, Mental Maths and Reasoning</strong>.
        </p>

        <div className="flex items-center gap-4 text-xs font-semibold text-[#0d9488] flex-wrap">
          <button
            type="button"
            onClick={() => scrollToAnchor('how-to-buy-physical')}
            className="hover:underline cursor-pointer flex items-center gap-1"
          >
            How to buy physical SkillRise Olympiad Workbook(s)?
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => scrollToAnchor('how-to-buy-digital')}
            className="hover:underline cursor-pointer flex items-center gap-1"
          >
            How to buy digital SkillRise Olympiad Workbook(s)?
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN FORM CARD (Exact match to screenshots 1, 2, 3)
         ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* User Type: Student or Teacher? */}
          <div className="pb-4 border-b border-slate-100 flex items-center gap-6">
            <span className="text-xs font-bold text-slate-700">Are you a Student or a Teacher?</span>
            <label className="inline-flex items-center gap-2 text-xs font-bold text-[#4e2a4a] cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="student"
                checked={userType === 'student'}
                onChange={() => {
                  setUserType('student');
                  setSelectedBookIds([]);
                }}
                className="w-4 h-4 accent-[#0d9488]"
              />
              <span>Student</span>
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-bold text-[#4e2a4a] cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="teacher"
                checked={userType === 'teacher'}
                onChange={() => {
                  setUserType('teacher');
                  setSelectedBookIds([]);
                }}
                className="w-4 h-4 accent-[#0d9488]"
              />
              <span>Teacher</span>
            </label>
          </div>

          {/* User Information Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 bg-white border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]`}
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (!deliveryAddress.email) {
                      setDeliveryAddress(prev => ({ ...prev, email: e.target.value }));
                    }
                  }}
                  className={`w-full pl-9 pr-3 py-2.5 bg-white border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.email}</p>}
            </div>

            {/* Confirm Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Re-enter email"
                  value={formData.confirmEmail}
                  onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 bg-white border ${errors.confirmEmail ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]`}
                />
              </div>
              {errors.confirmEmail && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.confirmEmail}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Country</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0d9488] appearance-none"
                >
                  <option value="India (+91)">India (+91)</option>
                  <option value="United States (+1)">United States (+1)</option>
                  <option value="United Kingdom (+44)">United Kingdom (+44)</option>
                  <option value="United Arab Emirates (+971)">United Arab Emirates (+971)</option>
                  <option value="Singapore (+65)">Singapore (+65)</option>
                  <option value="Canada (+1)">Canada (+1)</option>
                  <option value="Australia (+61)">Australia (+61)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">State</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0d9488] appearance-none"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* WhatsApp Number (Enforced 10 digits) */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={formData.whatsapp}
                  onChange={(e) => {
                    const cleanNum = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, whatsapp: cleanNum });
                    if (!deliveryAddress.mobileNumber) {
                      setDeliveryAddress(prev => ({ ...prev, mobileNumber: cleanNum }));
                    }
                  }}
                  className={`w-full pl-9 pr-3 py-2.5 bg-white border ${errors.whatsapp ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]`}
                />
              </div>
              {errors.whatsapp && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.whatsapp}</p>}
            </div>

            {/* Class / Teacher Stage */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                {userType === 'student' ? 'Class / Grade' : 'Teaching Level Stage'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={userType === 'student' ? formData.classLevel : formData.teacherStage}
                  onChange={(e) => {
                    if (userType === 'student') {
                      setFormData({ ...formData, classLevel: e.target.value });
                    } else {
                      setFormData({ ...formData, teacherStage: e.target.value });
                    }
                    setSelectedBookIds([]);
                  }}
                  className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0d9488] appearance-none"
                >
                  {userType === 'student'
                    ? STUDENT_CLASSES.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))
                    : TEACHER_STAGES.map((stg) => (
                        <option key={stg} value={stg}>{stg}</option>
                      ))
                  }
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* WORKBOOKS FORMAT SELECTION */}
          <div className="pt-2 space-y-2">
            <label className="block text-[11px] font-black uppercase text-slate-700 tracking-wider">
              Workbooks Format
            </label>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-[#4e2a4a] cursor-pointer">
                <input
                  type="radio"
                  name="workbookFormat"
                  value="digital"
                  checked={workbookFormat === 'digital'}
                  onChange={() => setWorkbookFormat('digital')}
                  className="w-4 h-4 accent-[#0d9488]"
                />
                <span>Digital (Coloured PDF)</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-bold text-[#4e2a4a] cursor-pointer">
                <input
                  type="radio"
                  name="workbookFormat"
                  value="physical"
                  checked={workbookFormat === 'physical'}
                  onChange={() => setWorkbookFormat('physical')}
                  className="w-4 h-4 accent-[#0d9488]"
                />
                <span>Physical (Black &amp; White Printed Book)</span>
              </label>
            </div>
          </div>

          {/* AVAILABLE WORKBOOKS TABLE (Exact Match to screenshot 1 & 3) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-black uppercase text-slate-700 tracking-wider">
                Available Workbooks for {currentClass}
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {selectedBookIds.length} item(s) selected
              </span>
            </div>

            {errors.books && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.books}</span>
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#004d66] text-white font-bold">
                    <th className="py-2.5 px-3 w-12 text-center">Select</th>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3 w-20 text-center">Cover</th>
                    <th className="py-2.5 px-3 w-20 text-center">Index</th>
                    <th className="py-2.5 px-3 w-24 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {availableWorkbooks.map((book) => {
                    const isChecked = selectedBookIds.includes(book.id);
                    return (
                      <tr
                        key={book.id}
                        onClick={() => handleToggleBook(book.id)}
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                          isChecked ? 'bg-[#f0fdfa]' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleBook(book.id)}
                            className="w-4 h-4 accent-[#0d9488] rounded cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {book.title}
                        </td>
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className={`w-8 h-10 mx-auto rounded bg-gradient-to-br ${book.coverBg} flex items-center justify-center text-white shadow-2xs`}>
                            <BookOpen className="w-4 h-4" />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setPreviewBookIndex(book)}
                            className="p-1.5 text-[#0d9488] hover:bg-[#0d9488]/10 rounded-md transition-colors cursor-pointer"
                            title="Preview Table of Contents"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-[#4e2a4a]">
                          INR {book.price}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Price Total Summary Box */}
            {selectedBookIds.length > 0 && (
              <div className="flex justify-end pt-2">
                <div className="w-64 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold">₹{subtotal}</span>
                  </div>
                  {workbookFormat === 'physical' && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Delivery Charges:</span>
                      <span className="font-bold">
                        {deliveryCharge === 0 ? <span className="text-emerald-600 font-black">FREE (3+ items)</span> : `₹${deliveryCharge}`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between font-black text-sm text-[#4e2a4a] pt-1 border-t border-slate-200">
                    <span>Total:</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              DELIVERY ADDRESS SECTION (Appears when Physical format is selected - Exact Match to Screenshot 2)
             ========================================================================= */}
          {workbookFormat === 'physical' && (
            <div className="pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-bold text-slate-800">Delivery Address</h3>
                <span className="text-[11px] text-[#0d9488] bg-[#0d9488]/10 px-2.5 py-0.5 rounded-full font-semibold">
                  Please ensure your address is complete and accurate for timely delivery.
                </span>
              </div>

              {/* Free delivery notice bar */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Purchase 3 or more Workbooks to waive off the delivery charges of INR 100</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Recipient name"
                    value={deliveryAddress.fullName || formData.name}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, fullName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0d9488]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Address Line 1 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="House / Flat No., Building Name, Street"
                    value={deliveryAddress.addressLine1}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, addressLine1: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-slate-50/50 border ${errors.addressLine1 ? 'border-red-500' : 'border-slate-200'} rounded-lg text-xs focus:outline-none focus:border-[#0d9488]`}
                  />
                  {errors.addressLine1 && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.addressLine1}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    placeholder="Area, Colony, Sector"
                    value={deliveryAddress.addressLine2}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, addressLine2: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0d9488]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    placeholder="Near park, school, hospital, etc."
                    value={deliveryAddress.landmark}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0d9488]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="City name"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-slate-50/50 border ${errors.city ? 'border-red-500' : 'border-slate-200'} rounded-lg text-xs focus:outline-none focus:border-[#0d9488]`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">State <span className="text-red-500">*</span></label>
                  <select
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0d9488]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="6-digit pincode"
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className={`w-full px-3 py-2.5 bg-slate-50/50 border ${errors.pincode ? 'border-red-500' : 'border-slate-200'} rounded-lg text-xs focus:outline-none focus:border-[#0d9488]`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="10-digit delivery contact number"
                    value={deliveryAddress.mobileNumber || formData.whatsapp}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className={`w-full px-3 py-2.5 bg-slate-50/50 border ${errors.mobileNumber ? 'border-red-500' : 'border-slate-200'} rounded-lg text-xs focus:outline-none focus:border-[#0d9488]`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTON (PAY & DOWNLOAD or PAY FOR WORKBOOKS) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3 bg-[#004d66] hover:bg-[#003d52] text-white rounded-lg text-xs sm:text-sm font-black tracking-wider uppercase shadow-md transition-all cursor-pointer text-center active:scale-[0.99]"
            >
              {workbookFormat === 'digital' ? 'PAY & DOWNLOAD' : 'PAY FOR WORKBOOK(S)'}
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          INFORMATIONAL CONTENT & FAQ TOPICS (Exact Match to Screenshots 1 & 4)
         ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-10 text-xs sm:text-sm text-[#4e2a4a] leading-relaxed">
        
        {/* Topic 1: How to Purchase Physical Workbooks */}
        <section id="how-to-buy-physical" className="space-y-3 pb-8 border-b border-slate-200">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            How to Purchase Physical SkillRise Olympiad Workbooks (Black &amp; White)?
          </h2>
          <div className="space-y-1.5 text-slate-700">
            <p><strong>Step 1:</strong> Fill in the given form with the correct details on this page.</p>
            <p><strong>Step 2:</strong> Select the option <strong>"Physical"</strong> in the Workbooks field to buy a physical workbook.</p>
            <p><strong>Step 3:</strong> Select the Workbook(s) you want to purchase and fill in the complete postal address for delivery of the book.</p>
            <p><strong>Step 4:</strong> Click on the <strong>Pay for Workbook(s)</strong> button.</p>
          </div>
          <p className="text-slate-600 pt-1">
            Once you've successfully completed the above steps, you've successfully purchased the workbook.
          </p>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            <p><strong>Important note to consider in the case of Physical Workbook(s):</strong></p>
            <p>The workbook(s) are generally delivered to the postal address within 5-7 working days after the successful purchase of the workbook.</p>
          </div>
        </section>

        {/* Topic 2: How to Purchase Digital Workbooks */}
        <section id="how-to-buy-digital" className="space-y-3 pb-8 border-b border-slate-200">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            How to Purchase Digital SkillRise Olympiad Workbooks (Coloured)?
          </h2>
          <div className="space-y-1.5 text-slate-700">
            <p><strong>Step 1:</strong> Fill in the given form with the correct details on this page.</p>
            <p><strong>Step 2:</strong> Select the option <strong>"Digital"</strong> in the Workbooks field to buy a digital workbook.</p>
            <p><strong>Step 3:</strong> Select the Workbook(s) you want to purchase and then click on the <strong>Pay and Download</strong> button.</p>
            <p><strong>Step 4:</strong> Once the payment is done, you will be redirected to the download page from where you can download the Workbook(s).</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            <p><strong>Important note to consider in the case of Digital Workbook(s):</strong></p>
            <p>The Workbook(s) can be downloaded once or saved to your candidate dashboard library for continuous reference. Hence, after downloading the Workbook(s), make sure to save it safely.</p>
          </div>
        </section>

        {/* Topic 3: About Olympiad Books */}
        <section className="space-y-3 pb-8 border-b border-slate-200">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            About Olympiad Books
          </h2>
          <p>
            Are you preparing for the Olympiad exams and searching for the best Olympiad books to crack these exams? If yes, then continue reading as here more information is provided about Olympiad books.
          </p>
          <p>
            Olympiads are generally conducted for students in classes (Classes 1 to 12) at national and international levels. Olympiad exams are positively beneficial to students because these exams foster a spirit of competition among them. Also help to enhance students' intellectual, problem-solving abilities and many other skills.
          </p>
          <p>
            Children who are taking Olympiad examinations must study diligently to bag a rank. During the preparation phase, Olympiad books play an important role. Students generally go for Olympiad books as these provide in-depth knowledge on topics and help students to be ahead of their peers.
          </p>
          <p><strong>About SkillRise Olympiad Workbooks:</strong></p>
          <p>
            Olympiad examinations are nothing to be scared of. Selection of the right study resource is the key to performing well in Olympiad exams. With the right guidance and direction led by Olympiad workbooks, students will not just prepare well but they will also prepare strategically.
          </p>
          <div className="space-y-1 pl-3 text-slate-700">
            <p>a. SkillRise Mathematics Workbooks (Available for Classes 1 to 12)</p>
            <p>b. SkillRise Science Workbooks (Available for Classes 1 to 12)</p>
            <p>c. SkillRise English Workbooks (Available for Classes 1 to 12)</p>
            <p>d. SkillRise Mental Maths Workbooks (Available for Classes 1 to 12)</p>
            <p>e. SkillRise Reasoning Workbooks (Available for Classes 1 to 12)</p>
            <p>f. SkillRise Spell Bee / Vocabulary Workbooks (Available for Classes 1 to 12)</p>
          </div>
        </section>

        {/* Topic 4: What Do SkillRise Olympiad Workbooks Cover? */}
        <section className="space-y-3 pb-8 border-b border-slate-200">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            What Do SkillRise Olympiad Workbooks Cover?
          </h2>
          <p>
            Now while it may sound really appealing, acing in Olympiad exams is not as simple as one would expect it to be. But with the launch of SkillRise Olympiad workbooks, students can add flying colors to their preparation for SkillRise Olympiads exams and other International and National competitions.
          </p>
          <div className="space-y-1.5 pl-3 text-slate-700">
            <p><strong>a.</strong> The books give students fascinating content through the use of illustrations and examples which helps to boost their preparation. The chapter-wise reading material is presented in a systematic manner covering the whole concept.</p>
            <p><strong>b.</strong> The workbooks include practice exercises for each chapter as well as the answer key at the end of the book.</p>
            <p><strong>c.</strong> The books also contain SkillRise Olympiads previous year papers for practice which gives students an idea about the SkillRise Olympiads exam format.</p>
          </div>
        </section>

        {/* Topic 5: FAQs on Olympiad Books */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Frequently Asked Questions On Olympiad Books
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">1. Which books are best for the Olympiad exams preparation?</h4>
              <p className="text-slate-600">
                SkillRise Olympiads has created a series of books for the preparation of various Olympiad exams. These books are available in Mathematics, Science, English, Spell Bee, and Reasoning for Classes 1 to 12. The workbooks offer in-depth reading material and for topics and a range of questions for practice are added. The books provide clear explanations of the topics with examples.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">2. What is an Olympiad Reasoning book?</h4>
              <p className="text-slate-600">
                Generally, students are afraid of the Reasoning section in almost every competitive exam. Students refer to the Reasoning Olympiad books to prepare for Reasoning Olympiad exams and similar competitions. The Olympiad Reasoning book includes reading material and practice questions about the topics that come in various Reasoning Olympiad exams.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">3. What books should I read for the Olympiad exams?</h4>
              <p className="text-slate-600">
                Students can begin their preparation by reading the books recommended by their school board (CBSE, ICSE, or State board). In addition, students can use SkillRise Olympiads books (available for Classes 1 to 12 in subjects of Maths, Science, English &amp; Reasoning) to improve their national rank.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">4. How do I prepare my child for the Olympiad exams?</h4>
              <p className="text-slate-600">
                Proper preparation is especially important when a student is planning to take a competitive exam, such as the Olympiad. One of the best ways to achieve good results in the Olympiad exams is to create a structured study schedule based on the curriculum and stick to it regularly.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">5. How to download/purchase Olympiad books PDF?</h4>
              <p className="text-slate-600">
                SkillRise Olympiad books are available in both digital pdf format (coloured) &amp; as physical books (black &amp; white). Students can purchase these Olympiad books from the SkillRise Olympiads website directly.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">6. Whom do I contact if I have any questions?</h4>
              <p className="text-slate-600">
                For queries, kindly write to us at <strong>support@skillrise.org</strong> or call/WhatsApp at <strong>+91 11 4988 2000</strong>.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* =========================================================================
          INDEX / CHAPTER PREVIEW MODAL
         ========================================================================= */}
      {previewBookIndex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0d9488]" />
                <h3 className="text-sm font-black text-[#4e2a4a]">Table of Contents / Index</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewBookIndex(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#d9775b]">{previewBookIndex.title}</h4>
              <p className="text-[11px] text-slate-500">Comprehensive curriculum chapters included in this publication:</p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {previewBookIndex.chapters.map((ch, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-700">Chapter {idx + 1}: {ch}</span>
                  <span className="text-[10px] font-bold text-[#0d9488]">Included ✓</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewBookIndex(null)}
                className="px-5 py-2 bg-[#004d66] hover:bg-[#003d52] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ORDER SUCCESS RECEIPT MODAL
         ========================================================================= */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="text-center space-y-2 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {orderSuccess.format === 'digital' ? 'Order Confirmed & Ready to Download!' : 'Physical Order Placed Successfully!'}
              </h3>
              <p className="text-xs text-slate-500">
                Order ID: <strong className="font-mono text-slate-800">{orderSuccess.orderId}</strong>
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between"><span>Candidate Name:</span><strong>{orderSuccess.name}</strong></div>
              <div className="flex justify-between"><span>Email &amp; WhatsApp:</span><strong>{orderSuccess.email} • {orderSuccess.whatsapp}</strong></div>
              <div className="flex justify-between"><span>Format:</span><strong className="capitalize">{orderSuccess.format} Workbook</strong></div>
              <div className="flex justify-between"><span>Total Paid:</span><strong className="text-emerald-700 text-sm">₹{orderSuccess.grandTotal}</strong></div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-800">Purchased Workbooks ({orderSuccess.books.length}):</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {orderSuccess.books.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs">
                    <span className="truncate pr-2">{b.title}</span>
                    {orderSuccess.format === 'digital' ? (
                      <button
                        type="button"
                        onClick={() => alert(`Downloading ${b.title}... PDF download started!`)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download PDF</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-[#0d9488]">Dispatching ✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {orderSuccess.address && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-0.5">
                <p><strong>Shipping to:</strong></p>
                <p>{orderSuccess.address.fullName || orderSuccess.name}, {orderSuccess.address.addressLine1}, {orderSuccess.address.city}, {orderSuccess.address.state} - {orderSuccess.address.pincode}</p>
                <p className="text-[10px] text-amber-700">Estimated delivery: 5-7 working days via tracked speed courier.</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setOrderSuccess(null)}
                className="w-full py-2.5 bg-[#004d66] hover:bg-[#003d52] text-white rounded-xl text-xs font-bold cursor-pointer text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
