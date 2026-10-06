import React, { useState, useRef } from 'react';
import { apiClient } from '../../api/client';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';
import {
  User,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Award,
  Camera,
  Upload,
  X,
  School,
  Building2,
  MapPin,
  Map,
  Home,
  Lock,
  Gift,
  Smartphone,
  GraduationCap,
  Check,
  Cake,
  Eye,
  EyeOff,
  AlertCircle,
  PlayCircle
} from 'lucide-react';

const AVATAR_OPTIONS = [
  { id: 'girl-1', label: 'Student Girl', emoji: '👧', color: '#f4ebf4' },
  { id: 'boy-1', label: 'Student Boy', emoji: '👦', color: '#faf4e0' },
  { id: 'scholar-girl', label: 'Scholar Girl', emoji: '👩‍🎓', color: '#f4ebf4' },
  { id: 'scholar-boy', label: 'Scholar Boy', emoji: '👨‍🎓', color: '#faf4e0' },
  { id: 'quiz-kid', label: 'Science Star', emoji: '🧒', color: '#f4ebf4' },
  { id: 'math-wizard', label: 'Math Wizard', emoji: '🧑‍💻', color: '#faf4e0' },
  { id: 'brainy', label: 'Quiz Master', emoji: '🧠', color: '#f4ebf4' },
  { id: 'champion', label: 'Gold Champion', emoji: '🏆', color: '#faf4e0' }
];

const COUNTRIES = [
  'India (+91)',
  'United States (+1)',
  'United Kingdom (+44)',
  'United Arab Emirates (+971)',
  'Singapore (+65)',
  'Australia (+61)',
  'Canada (+1)',
  'Albania (+355)',
  'Germany (+49)',
  'France (+33)',
  'Japan (+81)',
  'Malaysia (+60)',
  'New Zealand (+64)',
  'Saudi Arabia (+966)',
  'South Africa (+27)'
];

export const StudentRegistrationPage = ({ onNavigatePublic, onOpenLogin }) => {
  const [step, setStep] = useState(1);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    candidateName: '',
    className: 'Class 1',
    email: '',
    parentPhone: '',
    candidatePhone: '',
    country: 'India (+91)',
    schoolName: '',
    sameCountryAsCandidate: true,
    agreedToTerms: true,

    // Step 2: Location & Password
    state: '',
    city: '',
    pincode: '',
    postalAddress: '',
    sameCityAsHome: true,
    schoolPincode: '',
    password: '',
    confirmPassword: '',

    // Step 3: Complete Profile
    parentName: '',
    dob: '',
    referralCode: '',
    profilePhoto: null,
    profilePhotoPreview: '',
    selectedAvatar: 'girl-1',

    // Step 4 & 5: Olympiad selection & payment
    selectedOlympiads: ['math'],
    selectedLevel: 'Level 1 (All Students)',
    paymentMethod: 'card'
  });

  const [generatedRegId, setGeneratedRegId] = useState('');

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12'
  ];

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: file,
          profilePhotoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      profilePhoto: null,
      profilePhotoPreview: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleOlympiad = (id) => {
    setFormData((prev) => {
      const exists = prev.selectedOlympiads.includes(id);
      if (exists) {
        if (prev.selectedOlympiads.length === 1) return prev;
        return { ...prev, selectedOlympiads: prev.selectedOlympiads.filter((x) => x !== id) };
      } else {
        return { ...prev, selectedOlympiads: [...prev.selectedOlympiads, id] };
      }
    });
  };

  const handleInputChange = (field, val) => {
    let sanitizedVal = val;
    if (field === 'parentPhone' || field === 'candidatePhone') {
      sanitizedVal = val.replace(/\D/g, '').slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [field]: sanitizedVal }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Validation Logic
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.candidateName.trim()) {
      newErrors.candidateName = 'Candidate Name is required';
    }
    if (!formData.className) {
      newErrors.className = 'Please select a class';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent WhatsApp/Mobile number is required';
    } else if (formData.parentPhone.trim().replace(/\D/g, '').length < 10) {
      newErrors.parentPhone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School Name is required';
    }
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms of Use and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (formData.pincode.trim().length < 4) {
      newErrors.pincode = 'Please enter a valid pincode';
    }
    if (!formData.postalAddress.trim()) {
      newErrors.postalAddress = 'Full Postal Address is required';
    }
    if (!formData.schoolPincode.trim()) {
      newErrors.schoolPincode = 'School Pincode is required';
    } else if (formData.schoolPincode.trim().length < 4) {
      newErrors.schoolPincode = 'Please enter a valid school pincode';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required (min 6 characters)';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent/Guardian Name is required';
    }
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep3 = () => {
    if (validateStep3()) {
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTakeFreeTrial = async () => {
    if (validateStep3()) {
      try {
        const payload = {
          fullName: formData.candidateName,
          email: formData.email,
          phone: formData.parentPhone,
          password: formData.password,
          className: formData.className,
          gender: 'Other',
          dob: formData.dob,
          parentName: formData.parentName,
          schoolName: formData.schoolName,
          postalAddress: formData.postalAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          schoolPincode: formData.schoolPincode,
          selectedAvatar: formData.selectedAvatar,
          selectedOlympiads: ['math', 'science', 'english'],
          totalAmount: 0
        };

        await apiClient.post('/auth/register-student', payload);
      } catch (err) {
        console.error('Free trial registration error:', err);
      }
      onNavigatePublic('free-trial');
    }
  };

  // Pricing calculations
  const feePerOlympiad = 250;
  const count = formData.selectedOlympiads.length;
  const baseTotal = count * feePerOlympiad;
  const discount = count >= 3 ? Math.round(baseTotal * 0.15) : 0;
  const tax = Math.round((baseTotal - discount) * 0.18);
  const finalTotal = baseTotal - discount + tax;

  const handleCompleteRegistration = async () => {
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        className: formData.className,
        gender: formData.gender,
        dob: formData.dob,
        parentName: formData.parentName,
        schoolName: formData.schoolName,
        postalAddress: formData.postalAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        schoolPincode: formData.schoolPincode,
        selectedAvatar: formData.selectedAvatar,
        selectedOlympiads: formData.selectedOlympiads,
        totalAmount: finalTotal
      };

      const res = await apiClient.post('/auth/register-student', payload);
      const regNum = res?.data?.registration_number || ('SR-STU-2026-' + Math.floor(100000 + Math.random() * 900000));
      setGeneratedRegId(regNum);
      setStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Registration API:', err);
      const regNum = 'SR-STU-2026-' + Math.floor(100000 + Math.random() * 900000);
      setGeneratedRegId(regNum);
      setStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentAvatarObj = AVATAR_OPTIONS.find((a) => a.id === formData.selectedAvatar) || AVATAR_OPTIONS[0];

  return (
    <div className="bg-[#fff9f2] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Main Card Container */}
        <div className="bg-white rounded-md border border-[#edd6ed] shadow-xl overflow-hidden">
          
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-[#5c3158] via-[#6d3a68] to-[#8c4e8b] text-white py-8 px-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Register to Take Free Trial
            </h1>
            <p className="text-xs sm:text-sm text-[#deb8de] mt-1.5 font-medium">
              Create your account in 3 simple steps — takes about 2 minutes
            </p>
          </div>

          {/* 3-Step Stepper (Steps 1, 2, 3) */}
          <div className="bg-[#faf5fa] border-b border-[#edd6ed] px-4 py-4 sm:px-8">
            <div className="flex items-center justify-between max-w-lg mx-auto relative">
              
              {/* Step 1 Item */}
              <div className="flex items-center gap-2 relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step >= 1
                      ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-sm'
                      : 'bg-white border border-[#edd6ed] text-slate-400'
                  }`}
                >
                  {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span
                  className={`text-xs font-bold hidden sm:inline ${
                    step === 1 ? 'text-[#4e2a4a]' : 'text-slate-500'
                  }`}
                >
                  Basic Info
                </span>
              </div>

              {/* Connecting Line 1 */}
              <div
                className={`flex-1 h-0.5 mx-2 transition-all ${
                  step >= 2 ? 'bg-[#6d3a68]' : 'bg-[#edd6ed]'
                }`}
              />

              {/* Step 2 Item */}
              <div className="flex items-center gap-2 relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step >= 2
                      ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-sm'
                      : 'bg-white border border-[#edd6ed] text-slate-400'
                  }`}
                >
                  {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <span
                  className={`text-xs font-bold hidden sm:inline ${
                    step === 2 ? 'text-[#4e2a4a]' : 'text-slate-500'
                  }`}
                >
                  Location &amp; Password
                </span>
              </div>

              {/* Connecting Line 2 */}
              <div
                className={`flex-1 h-0.5 mx-2 transition-all ${
                  step >= 3 ? 'bg-[#6d3a68]' : 'bg-[#edd6ed]'
                }`}
              />

              {/* Step 3 Item */}
              <div className="flex items-center gap-2 relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step >= 3
                      ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-sm'
                      : 'bg-white border border-[#edd6ed] text-slate-400'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-xs font-bold hidden sm:inline ${
                    step === 3 ? 'text-[#4e2a4a]' : 'text-slate-500'
                  }`}
                >
                  Complete Profile
                </span>
              </div>
            </div>
          </div>

          {/* Form Content Body */}
          <div className="p-6 sm:p-10">
            
            {/* ======================================================== */}
            {/* STEP 1: BASIC INFORMATION (Image 3)                      */}
            {/* ======================================================== */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#edd6ed] pb-3">
                  <h2 className="text-base sm:text-lg font-black text-[#4e2a4a]">
                    Step 1: Basic Information
                  </h2>
                </div>

                {/* Validation Error Banner */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Kripya sabhi zaroori fields (*) ko sahi se bharein aage badhne ke liye.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  
                  {/* Candidate Name * */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      Candidate Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className={`w-4 h-4 absolute left-3 ${errors.candidateName ? 'text-red-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        placeholder="e.g. TANISHA"
                        value={formData.candidateName}
                        onChange={(e) => handleInputChange('candidateName', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.candidateName
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                            : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                        }`}
                      />
                    </div>
                    {errors.candidateName && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{errors.candidateName}</p>
                    )}
                  </div>

                  {/* Class (2026-2027) * */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      Class (2026-2027) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <GraduationCap className={`w-4 h-4 absolute left-3 ${errors.className ? 'text-red-500' : 'text-slate-400'}`} />
                      <select
                        value={formData.className}
                        onChange={(e) => handleInputChange('className', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.className
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                            : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                        }`}
                      >
                        {classes.map((cls) => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    {errors.className && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{errors.className}</p>
                    )}
                  </div>

                  {/* Email * */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className={`w-4 h-4 absolute left-3 ${errors.email ? 'text-red-500' : 'text-slate-400'}`} />
                      <input
                        type="email"
                        placeholder="tanishha@gmail.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                            : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Parent WhatsApp/Mobile * */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      Parent WhatsApp/Mobile <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone className={`w-4 h-4 absolute left-3 ${errors.parentPhone ? 'text-red-500' : 'text-slate-400'}`} />
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="8766483975"
                        value={formData.parentPhone}
                        onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.parentPhone
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                            : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                        }`}
                      />
                    </div>
                    {errors.parentPhone && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{errors.parentPhone}</p>
                    )}
                  </div>

                  {/* Candidate WhatsApp/Mobile (Optional) */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      Candidate WhatsApp/Mobile (Optional)
                    </label>
                    <div className="relative flex items-center">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="5674893754"
                        value={formData.candidatePhone}
                        onChange={(e) => handleInputChange('candidatePhone', e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-md border border-[#edd6ed] bg-[#faf5fa] text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                      />
                    </div>
                  </div>

                  {/* Candidate's Country * */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      Candidate's Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className={`w-4 h-4 absolute left-3 ${errors.country ? 'text-red-500' : 'text-slate-400'}`} />
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.country
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                            : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                        }`}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    {errors.country && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{errors.country}</p>
                    )}
                  </div>

                  {/* School Name * (Span 2) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Building2 className={`w-4 h-4 absolute left-3 ${errors.schoolName ? 'text-red-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        placeholder="e.g. Global High School"
                        value={formData.schoolName}
                        onChange={(e) => handleInputChange('schoolName', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.schoolName
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                            : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                        }`}
                      />
                    </div>
                    {errors.schoolName && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{errors.schoolName}</p>
                    )}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="p-3 rounded-md bg-[#faf5fa] border border-[#edd6ed] flex items-center gap-3 cursor-pointer hover:bg-[#f4ebf4] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.sameCountryAsCandidate}
                      onChange={(e) => handleInputChange('sameCountryAsCandidate', e.target.checked)}
                      className="w-4 h-4 text-[#6d3a68] rounded-sm focus:ring-[#6d3a68] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#4e2a4a]">
                      School is in the same country as candidate
                    </span>
                  </label>

                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer px-1">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                        className={`w-4 h-4 mt-0.5 rounded-sm focus:ring-[#6d3a68] cursor-pointer ${
                          errors.agreedToTerms ? 'border-red-500 text-red-500' : 'text-[#6d3a68]'
                        }`}
                      />
                      <span className="text-[11px] text-slate-600 leading-relaxed">
                        I agree to the <strong className="text-[#6d3a68] underline">Privacy Policy</strong>, <strong className="text-[#6d3a68] underline">Terms of Use</strong>, and to receive SMS/RCS updates.
                      </span>
                    </label>
                    {errors.agreedToTerms && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 pl-6">{errors.agreedToTerms}</p>
                    )}
                  </div>
                </div>

                {/* Submit & Links */}
                <div className="pt-4 flex flex-col items-center gap-4">
                  <div className="w-full flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextFromStep1}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-md text-xs font-black flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center space-y-1.5 pt-2 border-t border-[#f4ebf4] w-full">
                    <p className="text-xs text-slate-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={onOpenLogin}
                        className="font-bold text-[#6d3a68] underline hover:text-[#4e2a4a] cursor-pointer"
                      >
                        Login here
                      </button>
                    </p>
                    <p className="text-xs text-slate-500">
                      Not ready to register?{' '}
                      <button
                        type="button"
                        onClick={() => onNavigatePublic('practice-hub')}
                        className="font-bold text-[#d9775b] underline hover:text-[#c85e42] cursor-pointer"
                      >
                        Try a Free Practice Test first
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: LOCATION & PASSWORD (Image 2)                    */}
            {/* ======================================================== */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#edd6ed] pb-3">
                  <h2 className="text-base sm:text-lg font-black text-[#4e2a4a]">
                    Step 2: Location &amp; Password
                  </h2>
                </div>

                {/* Validation Error Banner */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Kripya sabhi location aur password fields ko fill karein.</span>
                  </div>
                )}

                {/* 1. Home Address (for Award Dispatch) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#f4ebf4] border border-[#edd6ed] text-xs font-black text-[#4e2a4a]">
                    <Home className="w-4 h-4 text-[#6d3a68]" />
                    <span>Home Address (for Award Dispatch)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Map className={`w-4 h-4 absolute left-3 ${errors.state ? 'text-red-500' : 'text-slate-400'}`} />
                        <input
                          type="text"
                          placeholder="e.g. Madhya Pradesh"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                            errors.state
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                              : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                          }`}
                        />
                      </div>
                      {errors.state && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Building2 className={`w-4 h-4 absolute left-3 ${errors.city ? 'text-red-500' : 'text-slate-400'}`} />
                        <input
                          type="text"
                          placeholder="e.g. Gwalior"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                            errors.city
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                              : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                          }`}
                        />
                      </div>
                      {errors.city && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                        Pincode/Zipcode <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <MapPin className={`w-4 h-4 absolute left-3 ${errors.pincode ? 'text-red-500' : 'text-slate-400'}`} />
                        <input
                          type="text"
                          placeholder="474001"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                            errors.pincode
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                              : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                          }`}
                        />
                      </div>
                      {errors.pincode && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{errors.pincode}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                        Full Postal Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Home className={`w-4 h-4 absolute left-3 ${errors.postalAddress ? 'text-red-500' : 'text-slate-400'}`} />
                        <input
                          type="text"
                          placeholder="Kampoo, House No. 12"
                          value={formData.postalAddress}
                          onChange={(e) => handleInputChange('postalAddress', e.target.value)}
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                            errors.postalAddress
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                              : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                          }`}
                        />
                      </div>
                      {errors.postalAddress && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{errors.postalAddress}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. School Location */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#faf4e0] border border-[#e7b84b]/40 text-xs font-black text-[#4e2a4a]">
                    <School className="w-4 h-4 text-[#8c4e8b]" />
                    <span>School Location</span>
                  </div>

                  <label className="p-3 rounded-md bg-[#faf5fa] border border-[#edd6ed] flex items-center gap-3 cursor-pointer hover:bg-[#f4ebf4] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.sameCityAsHome}
                      onChange={(e) => handleInputChange('sameCityAsHome', e.target.checked)}
                      className="w-4 h-4 text-[#6d3a68] rounded-sm focus:ring-[#6d3a68] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#4e2a4a]">
                      School is in the same city/state as home (pincode may differ)
                    </span>
                  </label>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      School Pincode <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center max-w-sm">
                      <MapPin className={`w-4 h-4 absolute left-3 ${errors.schoolPincode ? 'text-red-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        placeholder="5674"
                        value={formData.schoolPincode}
                        onChange={(e) => handleInputChange('schoolPincode', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.schoolPincode
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                            : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                        }`}
                      />
                    </div>
                    {errors.schoolPincode && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{errors.schoolPincode}</p>
                    )}
                  </div>
                </div>

                {/* 3. Create Password */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#f4ebf4] border border-[#edd6ed] text-xs font-black text-[#4e2a4a]">
                    <Lock className="w-4 h-4 text-[#6d3a68]" />
                    <span>Create Password</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Lock className={`w-4 h-4 absolute left-3 ${errors.password ? 'text-red-500' : 'text-slate-400'}`} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full pl-9 pr-10 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                            errors.password
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                              : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{errors.password}</p>
                      )}
                      {/* Strength indicator */}
                      <div className="mt-1.5 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            formData.password.length >= 6
                              ? 'w-full bg-[#6d3a68]'
                              : formData.password.length > 3
                              ? 'w-1/2 bg-[#e7b84b]'
                              : 'w-1/4 bg-red-400'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Lock className={`w-4 h-4 absolute left-3 ${errors.confirmPassword ? 'text-red-500' : 'text-slate-400'}`} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                            errors.confirmPassword
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                              : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                          }`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Back / Continue Buttons */}
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setStep(1);
                    }}
                    className="px-5 py-2.5 bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#f4ebf4]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFromStep2}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-md text-xs font-black flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 3: COMPLETE YOUR PROFILE (Image 1)                  */}
            {/* ======================================================== */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#edd6ed] pb-3">
                  <h2 className="text-base sm:text-lg font-black text-[#4e2a4a]">
                    Step 3: Complete Your Profile
                  </h2>
                </div>

                {/* Validation Error Banner */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Kripya Parent/Guardian Name aur Date of Birth fill karein.</span>
                  </div>
                )}

                {/* Logged in notification banner */}
                <div className="p-3.5 rounded-md bg-[#f4ebf4] border border-[#edd6ed] flex items-center gap-2 text-xs text-[#4e2a4a] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#6d3a68] shrink-0" />
                  <span>
                    Account created! You are logged in as <strong>{formData.email || 'tanishha@gmail.com'}</strong>
                  </span>
                </div>

                {/* Parent Name, DOB, Referral */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      Parent/Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className={`w-4 h-4 absolute left-3 ${errors.parentName ? 'text-red-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        placeholder="e.g. Dr. Rajesh Sharma"
                        value={formData.parentName}
                        onChange={(e) => handleInputChange('parentName', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.parentName
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                            : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                        }`}
                      />
                    </div>
                    {errors.parentName && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{errors.parentName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Cake className={`w-4 h-4 absolute left-3 ${errors.dob ? 'text-red-500' : 'text-slate-400'}`} />
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-md border text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.dob
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                            : 'border-[#edd6ed] bg-[#faf5fa] focus:ring-[#6d3a68]'
                        }`}
                      />
                    </div>
                    {errors.dob && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{errors.dob}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#6d3a68] mb-1">
                      Referral Code (Optional)
                    </label>
                    <div className="relative flex items-center">
                      <Gift className="w-4 h-4 text-slate-400 absolute left-3" />
                      <input
                        type="text"
                        placeholder="e.g. OHUB2026"
                        value={formData.referralCode}
                        onChange={(e) => handleInputChange('referralCode', e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-md border border-[#edd6ed] bg-[#faf5fa] text-xs font-semibold text-[#4e2a4a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Picture Section (2 Cards) */}
                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-2">
                    Profile Picture <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* 1. Upload Photo Card */}
                    <div className="border border-[#edd6ed] rounded-md p-5 bg-white hover:bg-[#faf5fa] transition-all flex flex-col items-center justify-center text-center relative group">
                      {formData.profilePhotoPreview ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#6d3a68] mb-2">
                          <img
                            src={formData.profilePhotoPreview}
                            alt="Student Profile"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#f4ebf4] flex items-center justify-center text-[#6d3a68] mb-2">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                        className="hidden"
                        id="profile-photo-step3"
                      />
                      <label
                        htmlFor="profile-photo-step3"
                        className="text-xs font-bold text-[#4e2a4a] hover:text-[#6d3a68] cursor-pointer"
                      >
                        {formData.profilePhotoPreview ? 'Change Photo' : 'Upload Photo'}
                      </label>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Max 50KB)</span>
                    </div>

                    {/* 2. Choose Avatar Card */}
                    <div
                      onClick={() => setShowAvatarModal(true)}
                      className="border border-[#6d3a68] rounded-md p-5 bg-[#f4ebf4] hover:bg-[#edd6ed]/60 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs"
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-[#edd6ed] flex items-center justify-center text-2xl mb-2 shadow-xs">
                        {currentAvatarObj.emoji}
                      </div>
                      <span className="text-xs font-black text-[#4e2a4a]">Choose Avatar</span>
                      <span className="text-[10px] text-[#6d3a68] font-bold underline mt-0.5">Click to change</span>
                    </div>
                  </div>
                </div>

                {/* Avatar Picker Modal */}
                {showAvatarModal && (
                  <div className="p-4 rounded-md bg-[#faf5fa] border border-[#edd6ed] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#4e2a4a]">Select an Avatar:</span>
                      <button
                        type="button"
                        onClick={() => setShowAvatarModal(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        Close
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            handleInputChange('selectedAvatar', av.id);
                            setShowAvatarModal(false);
                          }}
                          className={`p-2 rounded-md flex flex-col items-center justify-center transition-all cursor-pointer ${
                            formData.selectedAvatar === av.id
                              ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white ring-2 ring-[#6d3a68]'
                              : 'bg-white border border-[#edd6ed] hover:bg-[#f4ebf4]'
                          }`}
                        >
                          <span className="text-xl">{av.emoji}</span>
                          <span className="text-[9px] font-bold mt-1 truncate max-w-full">{av.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setStep(2);
                    }}
                    className="px-5 py-2 bg-[#0e3b52] hover:bg-[#082838] text-white rounded-xs text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                {/* Choose how you'd like to proceed */}
                <div className="pt-4 border-t border-[#edd6ed] space-y-3 text-center">
                  <p className="text-xs font-bold text-slate-700">
                    Choose how you'd like to proceed:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 max-w-lg mx-auto">
                    
                    {/* Option 1: TAKE FREE TRIAL */}
                    <button
                      type="button"
                      onClick={handleTakeFreeTrial}
                      className="p-5 rounded-md bg-gradient-to-r from-[#99e2e6] to-[#73d7db] hover:from-[#88d8dc] hover:to-[#5fc4c8] text-[#0d4b58] border border-[#6ec2c6] shadow-sm flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 group"
                    >
                      <PlayCircle className="w-8 h-8 text-[#0d4b58] mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs sm:text-sm font-black tracking-wide text-[#0d4b58]">
                        TAKE FREE TRIAL
                      </span>
                      <span className="text-[10px] font-bold text-[#0d4b58]/80 mt-0.5 tracking-tight uppercase">
                        TRY PRACTICE TESTS FOR FREE
                      </span>
                    </button>

                    {/* Option 2: ENROLL FOR EXAMS */}
                    <button
                      type="button"
                      onClick={handleNextFromStep3}
                      className="p-5 rounded-md bg-gradient-to-r from-[#175d7e] to-[#0f445d] hover:from-[#134e6b] hover:to-[#0b3346] text-white shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 group"
                    >
                      <GraduationCap className="w-8 h-8 text-white mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs sm:text-sm font-black tracking-wide text-white">
                        ENROLL FOR EXAMS
                      </span>
                      <span className="text-[10px] font-semibold text-sky-100 mt-0.5 tracking-tight uppercase">
                        REGISTER FOR OLYMPIAD EXAMS
                      </span>
                    </button>

                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 4: OLYMPIAD SELECTION                               */}
            {/* ======================================================== */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#f4ebf4] pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#4e2a4a]">Step 4: Select Olympiad Subjects</h3>
                    <p className="text-xs text-slate-500 mt-1">Select one or multiple Olympiads for {formData.className}.</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-sm bg-[#faf4e0] text-[#8c4e8b]">
                    {formData.selectedOlympiads.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {OLYMPIAD_CATEGORIES.map((cat) => {
                    const isChecked = formData.selectedOlympiads.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleOlympiad(cat.id)}
                        className={`p-4 rounded-md border cursor-pointer transition-all flex flex-col justify-between ${
                          isChecked
                            ? 'bg-[#f4ebf4] border-[#6d3a68] shadow-sm ring-1 ring-[#6d3a68]'
                            : 'bg-[#faf5fa] border-[#edd6ed] hover:border-[#8c4e8b]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-black text-[#4e2a4a]">{cat.shortName}</h4>
                          <div
                            className={`w-5 h-5 rounded-sm flex items-center justify-center text-xs ${
                              isChecked ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white' : 'border border-[#edd6ed] bg-white'
                            }`}
                          >
                            {isChecked && '✓'}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">{cat.name}</p>
                        <p className="text-xs font-black text-[#d9775b] mt-3">₹{cat.fee}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setStep(3);
                    }}
                    className="px-5 py-2.5 bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#f4ebf4]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-md text-xs font-black flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 5: REVIEW & PAYMENT                                 */}
            {/* ======================================================== */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#f4ebf4] pb-4">
                  <h3 className="text-lg font-black text-[#4e2a4a]">Step 5: Review &amp; Payment Checkout</h3>
                  <p className="text-xs text-slate-500 mt-1">Review summary and complete registration.</p>
                </div>

                {/* Order Summary Box */}
                <div className="bg-[#faf5fa] p-5 rounded-md border border-[#edd6ed] space-y-2.5 text-xs">
                  <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider mb-2">Order Summary</h4>
                  <div className="flex justify-between text-slate-600">
                    <span>Candidate: <strong>{formData.candidateName || 'Candidate'}</strong> ({formData.className})</span>
                    <span>{formData.schoolName || 'School'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Email &amp; Mobile:</span>
                    <span className="font-semibold text-[#4e2a4a]">{formData.email} | {formData.parentPhone}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Olympiads ({count} subject{count > 1 ? 's' : ''}):</span>
                    <span className="font-bold text-[#4e2a4a]">₹{baseTotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#d9775b]">
                      <span>Multi-subject 15% Discount:</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>GST (18%):</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="pt-2.5 border-t border-[#edd6ed] flex justify-between text-sm font-black text-[#4e2a4a]">
                    <span>Total Payable:</span>
                    <span className="text-lg text-[#6d3a68]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Credit / Debit Card', 'UPI / QR Code', 'Net Banking'].map((m, idx) => (
                      <label
                        key={idx}
                        className="p-3 rounded-md border border-[#edd6ed] bg-[#faf5fa] hover:bg-[#f4ebf4] cursor-pointer text-center text-xs font-bold text-[#4e2a4a] flex items-center justify-center gap-2"
                      >
                        <input type="radio" name="pay_method" defaultChecked={idx === 0} className="text-[#6d3a68]" />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setStep(4);
                    }}
                    className="px-5 py-2.5 bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#f4ebf4]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteRegistration}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-md text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg shadow-[#d9775b]/30 active:scale-95"
                  >
                    <span>Pay ₹{finalTotal} &amp; Complete Registration</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 6: CONFIRMATION RECEIPT                             */}
            {/* ======================================================== */}
            {step === 6 && (
              <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-md bg-[#faf4e0] text-[#e7b84b] flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-8 h-8 text-[#d9775b]" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-sm bg-[#f4ebf4] text-[#6d3a68] text-xs font-black uppercase tracking-wider">
                    Registration Successful
                  </span>
                  <h2 className="text-2xl font-black text-[#4e2a4a] mt-2">
                    Welcome to SkillRise Olympiad, {formData.candidateName || 'Student'}!
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Your registration is confirmed. Confirmation receipt and credentials sent to <strong>{formData.email || 'your email'}</strong>.
                  </p>
                </div>

                <div className="bg-[#faf5fa] p-5 rounded-md border border-[#edd6ed] max-w-md mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#edd6ed]">
                    <span className="text-slate-500">Registration ID:</span>
                    <strong className="text-[#6d3a68] font-black">{generatedRegId}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#edd6ed]">
                    <span className="text-slate-500">Class:</span>
                    <span className="font-bold text-[#4e2a4a]">{formData.className}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#edd6ed]">
                    <span className="text-slate-500">Registered Disciplines:</span>
                    <span className="font-bold text-[#d9775b]">{formData.selectedOlympiads.length} Olympiads</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-black text-[#4e2a4a]">₹{finalTotal}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="px-6 py-3 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-md text-xs font-black shadow-md cursor-pointer"
                  >
                    Log In to Student Dashboard →
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigatePublic('home')}
                    className="px-5 py-3 bg-[#faf5fa] text-slate-700 hover:bg-[#f4ebf4] border border-[#edd6ed] rounded-md text-xs font-bold cursor-pointer"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
