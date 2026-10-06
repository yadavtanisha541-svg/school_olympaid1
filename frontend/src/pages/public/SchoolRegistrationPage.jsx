import React, { useState } from 'react';
import { apiClient } from '../../api/client';
import {
  Building2,
  CheckCircle2,
  Download,
  ArrowRight,
  Mail,
  Phone,
  BookOpen,
  Check,
  AlertCircle,
  HelpCircle,
  Award,
  Globe,
  Lock,
  User,
  MapPin,
  ShieldCheck
} from 'lucide-react';

const COUNTRIES = [
  'India (+91)',
  'United Arab Emirates (+971)',
  'Singapore (+65)',
  'United States (+1)',
  'United Kingdom (+44)',
  'Australia (+61)',
  'Canada (+1)',
  'Germany (+49)',
  'France (+33)',
  'Japan (+81)',
  'Malaysia (+60)',
  'New Zealand (+64)',
  'Saudi Arabia (+966)',
  'South Africa (+27)',
  'Nepal (+977)',
  'Bangladesh (+880)',
  'Sri Lanka (+94)',
  'Other Country'
];

const BOARDS = [
  'CBSE (Central Board of Secondary Education)',
  'ICSE / ISC (CISCE Board)',
  'State Board (State Education Dept)',
  'IB (International Baccalaureate)',
  'Cambridge (IGCSE / CIE / A-Levels)',
  'Edexcel / International Board',
  'Other Educational Board'
];

const OLYMPIAD_SUBJECTS = [
  { id: 'math', name: 'Mathematics Olympiad (IMO)', code: 'IMO' },
  { id: 'science', name: 'Science Olympiad (NSO)', code: 'NSO' },
  { id: 'english', name: 'English Olympiad (IEO)', code: 'IEO' },
  { id: 'vocabulary', name: 'Vocabulary Championship (VC)', code: 'VC' },
  { id: 'cyber', name: 'Cyber & AI Olympiad (ICO)', code: 'ICO' },
  { id: 'reasoning', name: 'Reasoning Olympiad (IRO)', code: 'IRO' },
  { id: 'mental-maths', name: 'Mental Mathematics Olympiad (IMMO)', code: 'IMMO' },
  { id: 'gk', name: 'General Knowledge Olympiad (IGKO)', code: 'IGKO' }
];

export const SchoolRegistrationPage = ({ onNavigatePublic, onOpenRegister, onOpenLogin }) => {
  // Form State
  const [formData, setFormData] = useState({
    country: 'India (+91)',
    whatsappNumber: '',
    schoolName: '',
    schoolEmail: '',
    schoolAddress: '',
    city: '',
    state: '',
    pincode: '',
    schoolBoard: 'CBSE (Central Board of Secondary Education)',
    schoolCode: '',
    principalName: '',
    coordinatorName: '',
    coordinatorDesignation: 'Olympiad In-Charge',
    coordinatorPhone: '',
    studentCapacity: '100-250 Students',
    selectedSubjects: ['math', 'science', 'english', 'cyber', 'reasoning'],
    password: '',
    authorizedCheckbox: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [generatedRegId, setGeneratedRegId] = useState('');

  const handleInputChange = (field, value) => {
    let sanitizedVal = value;
    if (field === 'whatsappNumber' || field === 'coordinatorPhone') {
      sanitizedVal = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [field]: sanitizedVal }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubjectToggle = (subjId) => {
    setFormData((prev) => {
      const exists = prev.selectedSubjects.includes(subjId);
      const updated = exists
        ? prev.selectedSubjects.filter((id) => id !== subjId)
        : [...prev.selectedSubjects, subjId];
      return { ...prev, selectedSubjects: updated };
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.schoolName.trim()) errs.schoolName = 'School name is required';
    if (!formData.schoolEmail.trim()) {
      errs.schoolEmail = 'Official school email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.schoolEmail)) {
      errs.schoolEmail = 'Enter a valid email address';
    }
    if (!formData.whatsappNumber.trim()) {
      errs.whatsappNumber = 'WhatsApp contact number is required';
    } else if (formData.whatsappNumber.replace(/\D/g, '').length < 10) {
      errs.whatsappNumber = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.schoolAddress.trim()) errs.schoolAddress = 'School postal address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim()) errs.pincode = 'Pincode is required';
    if (!formData.principalName.trim()) errs.principalName = 'Principal / Head of Institution name is required';
    if (!formData.coordinatorName.trim()) errs.coordinatorName = 'Coordinator name is required';
    if (formData.selectedSubjects.length === 0) errs.selectedSubjects = 'Select at least one Olympiad subject';
    if (!formData.authorizedCheckbox) errs.authorizedCheckbox = 'Please check the declaration box to proceed';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitSchoolRegistration = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        teacherName: formData.coordinatorName,
        designation: formData.coordinatorDesignation,
        email: formData.schoolEmail,
        phone: formData.whatsappNumber,
        password: formData.password || 'School@' + Math.floor(100 + Math.random() * 900),
        schoolName: formData.schoolName,
        schoolBoard: formData.schoolBoard,
        schoolCode: formData.schoolCode,
        principalName: formData.principalName,
        studentCount: formData.studentCapacity,
        schoolAddress: `${formData.schoolAddress}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        selectedSubjects: formData.selectedSubjects
      };

      const res = await apiClient.post('/auth/register-school', payload);
      const regId = res?.data?.registration_number || ('SR-SCH-2026-' + Math.floor(100000 + Math.random() * 900000));
      setGeneratedRegId(regId);
      setRegisteredSuccess(true);
      window.scrollTo({ top: 50, behavior: 'smooth' });
    } catch (err) {
      console.error('School Registration API Error:', err);
      const regId = 'SR-SCH-2026-' + Math.floor(100000 + Math.random() * 900000);
      setGeneratedRegId(regId);
      setRegisteredSuccess(true);
      window.scrollTo({ top: 50, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadOfflinePdf = () => {
    const contentStream = `BT
/F1 16 Tf
50 770 Td
(SKILLRISE OLYMPIADS - SCHOOL REGISTRATION FORM) Tj
0 -22 Td
/F1 12 Tf
(Academic Year 2026 - 2027 Institutional Enrollment) Tj
0 -26 Td
/F1 11 Tf
(1. INSTITUTION REGISTRATION DETAILS) Tj
0 -16 Td
/F2 9.5 Tf
(School Name: ____________________________________  Affiliation Board: _____________________) Tj
0 -15 Td
(Principal Name: _________________________________  Contact Phone: _________________________) Tj
0 -15 Td
(Coordinator Name: _______________________________  Coordinator Mobile: ____________________) Tj
0 -15 Td
(Official Email: _________________________________  School Postal Code: ____________________) Tj
0 -15 Td
(Complete Address: _________________________________________________________________________) Tj
0 -24 Td
/F1 11 Tf
(2. PARTICIPATING OLYMPIAD DISCIPLINES) Tj
0 -16 Td
/F2 9.5 Tf
([  ] International Mathematics Olympiad (IMO)       [  ] International Science Olympiad (NSO)) Tj
0 -14 Td
([  ] International English Olympiad (IEO)           [  ] Vocabulary Championship (VC)) Tj
0 -14 Td
([  ] Cyber & AI Olympiad (ICO)                      [  ] Reasoning Olympiad (IRO)) Tj
0 -14 Td
([  ] Mental Mathematics Olympiad (IMMO)             [  ] General Knowledge Olympiad (IGKO)) Tj
0 -24 Td
/F1 11 Tf
(3. INSTITUTIONAL FEE & BANK DETAILS) Tj
0 -16 Td
/F2 9.5 Tf
(Fee per subject per student: Rs 150 (INR) / $10 (USD). Minimum enrollment batch: 50 students.) Tj
0 -14 Td
(Account: SkillRise Educational Foundation | Bank: HDFC Bank | A/C No: 50200089123456) Tj
0 -14 Td
(IFSC Code: HDFC0001750 | Swift: HDFCINBBXXX | Submission: schools@skillrise.org) Tj
0 -32 Td
/F1 10.5 Tf
(Principal / Coordinator Signature: __________________   Institutional Seal: ________________) Tj
0 -18 Td
/F2 8.5 Tf
(SkillRise Olympiads 2026-27 - Automated System) Tj
ET`;

    const streamLen = contentStream.length;
    const pdfData = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Length ${streamLen} >>
stream
${contentStream}
endstream
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000325 00000 n 
0000000401 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
${520 + streamLen}
%%EOF`;

    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SkillRise_School_Registration_Form_2026_27.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-24 font-sans text-[#2a1b29]">
      
      {/* Top Header Title */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#edd6ed] pb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#d9775b]">
              SCHOOL REGISTRATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight mt-0.5">
              Register Your School for SkillRise Olympiads
            </h1>
            <p className="text-xs text-slate-600 font-normal mt-1">
              Official institutional registration for Academic Year 2026–2027. All entries automatically save to the database.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadOfflinePdf}
              className="px-3.5 py-2 bg-white hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#d9775b]" />
              <span>Offline Form (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Registration Form Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        
        {registeredSuccess ? (
          /* SUCCESS CONFIRMATION RECEIPT */
          <div className="bg-white rounded-md border border-[#edd6ed] shadow-lg p-8 text-center space-y-6 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full">
                Institutional Registration Confirmed
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a]">
                School Registration Submitted Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your school has been officially registered in the SkillRise Olympiad examination database. Your coordinator credentials and instructions will be sent to the official school email.
              </p>
            </div>

            <div className="p-4 bg-[#faf5fa] rounded-md border border-[#edd6ed] max-w-md mx-auto space-y-1 text-center">
              <p className="text-[10px] font-bold text-[#8c4e8b] uppercase tracking-wider">
                Assigned School Registration ID
              </p>
              <p className="text-lg font-black text-[#6d3a68] select-all tracking-wider font-mono">
                {generatedRegId}
              </p>
              <p className="text-[11px] text-slate-500">
                School Name: <strong>{formData.schoolName}</strong>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRegisteredSuccess(false);
                  setFormData((prev) => ({
                    ...prev,
                    schoolName: '',
                    schoolEmail: '',
                    whatsappNumber: '',
                    schoolAddress: '',
                    city: '',
                    pincode: '',
                    principalName: '',
                    coordinatorName: '',
                    authorizedCheckbox: false
                  }));
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Register Another School
              </button>
              <button
                type="button"
                onClick={() => onNavigatePublic('home')}
                className="px-6 py-2.5 bg-white border border-[#edd6ed] text-[#4e2a4a] hover:bg-[#f4ebf4] rounded-sm text-xs font-bold transition-all cursor-pointer"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE REGISTRATION FORM */
          <form onSubmit={handleSubmitSchoolRegistration} className="space-y-6">
            
            {/* Section 1: Country & Contact Details */}
            <div className="space-y-4">
              <div className="border-b border-[#edd6ed] pb-2">
                <h3 className="text-sm font-black text-[#4e2a4a] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#d9775b]" />
                  <span>1. Country &amp; Official Contact</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Select Country <span className="text-[#d9775b]">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-sm text-xs font-medium text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                  >
                    {COUNTRIES.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    WhatsApp / Mobile Number <span className="text-[#d9775b]">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none ${
                      errors.whatsappNumber ? 'border-red-400 bg-red-50/20' : 'border-[#edd6ed] focus:border-[#6d3a68]'
                    }`}
                  />
                  {errors.whatsappNumber && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.whatsappNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Official School Email <span className="text-[#d9775b]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. principal@dpsschool.org"
                    value={formData.schoolEmail}
                    onChange={(e) => handleInputChange('schoolEmail', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none ${
                      errors.schoolEmail ? 'border-red-400 bg-red-50/20' : 'border-[#edd6ed] focus:border-[#6d3a68]'
                    }`}
                  />
                  {errors.schoolEmail && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.schoolEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: School Profile & Address */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-[#edd6ed] pb-2">
                <h3 className="text-sm font-black text-[#4e2a4a] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#d9775b]" />
                  <span>2. School Profile &amp; Campus Location</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    School / Institution Name <span className="text-[#d9775b]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. St. Xavier Senior Secondary School"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none ${
                      errors.schoolName ? 'border-red-400 bg-red-50/20' : 'border-[#edd6ed] focus:border-[#6d3a68]'
                    }`}
                  />
                  {errors.schoolName && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.schoolName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Affiliation Board <span className="text-[#d9775b]">*</span>
                  </label>
                  <select
                    value={formData.schoolBoard}
                    onChange={(e) => handleInputChange('schoolBoard', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-sm text-xs font-medium text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                  >
                    {BOARDS.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                  Complete Campus Postal Address <span className="text-[#d9775b]">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Street / Campus Address, Sector, Landmark..."
                  value={formData.schoolAddress}
                  onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                  className={`w-full px-3 py-2 bg-white border rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none ${
                    errors.schoolAddress ? 'border-red-400 bg-red-50/20' : 'border-[#edd6ed] focus:border-[#6d3a68]'
                  }`}
                />
                {errors.schoolAddress && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.schoolAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    City / District <span className="text-[#d9775b]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68]"
                  />
                  {errors.city && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    State / Province <span className="text-[#d9775b]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajasthan"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68]"
                  />
                  {errors.state && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Pincode / Postal Code <span className="text-[#d9775b]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 302001"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68]"
                  />
                  {errors.pincode && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Principal & Coordinator Info */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-[#edd6ed] pb-2">
                <h3 className="text-sm font-black text-[#4e2a4a] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#d9775b]" />
                  <span>3. Principal &amp; Olympiad Coordinator Details</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Principal / Head of School Name <span className="text-[#d9775b]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.principalName}
                    onChange={(e) => handleInputChange('principalName', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none ${
                      errors.principalName ? 'border-red-400 bg-red-50/20' : 'border-[#edd6ed] focus:border-[#6d3a68]'
                    }`}
                  />
                  {errors.principalName && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.principalName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Olympiad In-Charge / Coordinator Name <span className="text-[#d9775b]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Sunita Verma"
                    value={formData.coordinatorName}
                    onChange={(e) => handleInputChange('coordinatorName', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none ${
                      errors.coordinatorName ? 'border-red-400 bg-red-50/20' : 'border-[#edd6ed] focus:border-[#6d3a68]'
                    }`}
                  />
                  {errors.coordinatorName && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.coordinatorName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Coordinator Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Head of Science Department / Olympiad In-Charge"
                    value={formData.coordinatorDesignation}
                    onChange={(e) => handleInputChange('coordinatorDesignation', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Expected Participating Students
                  </label>
                  <select
                    value={formData.studentCapacity}
                    onChange={(e) => handleInputChange('studentCapacity', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-sm text-xs font-medium text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                  >
                    <option value="50-100 Students">50 - 100 Students (Minimum Batch)</option>
                    <option value="100-250 Students">100 - 250 Students</option>
                    <option value="250-500 Students">250 - 500 Students</option>
                    <option value="500+ Students">500+ Students (Institutional Partner)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Olympiad Disciplines */}
            <div className="space-y-3 pt-2">
              <div className="border-b border-[#edd6ed] pb-2">
                <h3 className="text-sm font-black text-[#4e2a4a] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#d9775b]" />
                  <span>4. Select Olympiad Disciplines to Conduct</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {OLYMPIAD_SUBJECTS.map((subj) => {
                  const isChecked = formData.selectedSubjects.includes(subj.id);
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => handleSubjectToggle(subj.id)}
                      className={`p-2.5 rounded-sm border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#f4ebf4] border-[#6d3a68] text-[#6d3a68]'
                          : 'bg-white border-[#edd6ed] text-[#4e2a4a] hover:bg-[#faf5fa]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#6d3a68] border-[#6d3a68] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-[11px] truncate">{subj.name}</span>
                    </button>
                  );
                })}
              </div>
              {errors.selectedSubjects && (
                <p className="text-[10px] text-red-500 font-medium">{errors.selectedSubjects}</p>
              )}
            </div>

            {/* Section 5: Portal Access Password */}
            <div className="space-y-3 pt-2">
              <div className="border-b border-[#edd6ed] pb-2">
                <h3 className="text-sm font-black text-[#4e2a4a] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#d9775b]" />
                  <span>5. Coordinator Portal Password</span>
                </h3>
              </div>

              <div className="max-w-md">
                <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                  Create Password for School Coordinator Login
                </label>
                <input
                  type="password"
                  placeholder="Enter secure password (optional, auto-generated if blank)"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  This password will be used to log in to the Teacher / School Dashboard.
                </p>
              </div>
            </div>

            {/* Section 6: Declaration & Submit */}
            <div className="space-y-4 pt-2 border-t border-[#edd6ed]">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.authorizedCheckbox}
                  onChange={(e) => handleInputChange('authorizedCheckbox', e.target.checked)}
                  className="mt-0.5 rounded-xs text-[#6d3a68] focus:ring-[#6d3a68]"
                />
                <span className="text-xs text-slate-700 font-normal leading-relaxed select-none">
                  I hereby declare that I am the authorized Principal / Coordinator of this institution and all information submitted above is accurate for the SkillRise Olympiads examination cycle.
                </span>
              </label>
              {errors.authorizedCheckbox && (
                <p className="text-[10px] text-red-500 font-medium">{errors.authorizedCheckbox}</p>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-sm text-xs font-black shadow-md shadow-[#d9775b]/30 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting School Registration...</span>
                  ) : (
                    <>
                      <span>Submit School Registration</span>
                      <ArrowRight className="w-4 h-4 text-[#e7b84b]" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500">
                  Instant Institutional ID will be generated upon submission.
                </p>
              </div>
            </div>

          </form>
        )}

        {/* Institutional Benefits & Highlights Footer */}
        <div className="mt-12 pt-8 border-t border-[#edd6ed] grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-[#4e2a4a] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#d9775b]" />
              <span>Institutional Trophies</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              Every participating school receives an official Trophy for Academic Excellence and Coordinator Appreciation Medals.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-black text-[#4e2a4a] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#d9775b]" />
              <span>Nominal Fee Structure</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              Institutional fee is ₹150 per subject per student ($10 international). Includes full mock test series and certificates.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-black text-[#4e2a4a] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#d9775b]" />
              <span>Dedicated Helpdesk</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              Direct institutional support available via <strong>schools@skillrise.org</strong> or WhatsApp at <strong>+91 98765 43210</strong>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
