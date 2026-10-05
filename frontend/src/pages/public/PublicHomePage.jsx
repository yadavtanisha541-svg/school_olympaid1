import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Calculator,
  Atom,
  BookOpen,
  Brain,
  Cpu,
  Zap,
  Globe,
  Palette,
  CheckCircle2,
  Trophy,
  Award,
  ShieldCheck,
  Clock,
  Download,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Play,
  Users,
  Building,
  Check,
  HelpCircle,
  TrendingUp,
  Star,
  Heart,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  MessageCircle,
  Laptop
} from 'lucide-react';
import {
  OLYMPIAD_CATEGORIES,
  TRUST_STATS,
  AWARDS_STRUCTURE,
  SAMPLE_PAPERS_CATALOG,
  TESTIMONIALS,
  FAQS_LIST
} from '../../data/olympiadHubData';
import studentScholarImg from '../../assets/student_scholar_new.png';
import stepRegisterChildImg from '../../assets/step_register_child.jpg';
import stepStudyChildImg from '../../assets/step_study_child.jpg';
import stepExamChildImg from '../../assets/step_exam_child.jpg';
import stepAwardChildImg from '../../assets/step_award_child.jpg';
import { OlympiadCard } from '../../components/public/OlympiadCard';
import { PrepResourceGraphic } from '../../components/public/PrepResourceGraphic';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Official Community',
    tagBg: 'bg-[#faf4e0] text-[#8c4e8b] border-[#e7b84b]/40',
    title: 'Join SkillRise Olympiad WhatsApp Community',
    subtitle: 'Get daily practice questions, syllabus blueprints, exam schedules & instant result notifications directly on WhatsApp.',
    highlight: 'Regular Exam Updates & Alerts',
    contactInfo: 'support@skillrise.org • +91 98110 45220',
    ctaText: 'Join WhatsApp Channel',
    badge: '45,000+ Active Members',
    themeGradient: 'from-[#4e2a4a] via-[#6d3a68] to-[#8c4e8b]',
    accentColor: '#e7b84b',
    illustrationType: 'community'
  },
  {
    id: 2,
    tag: 'Session 2026-27 Open',
    tagBg: 'bg-[#fdf6f4] text-[#d9775b] border-[#f7d7cc]',
    title: 'National & International Olympiad Exams',
    subtitle: 'Registrations are now open for Mathematics, Science, English, Cyber & AI, Reasoning, and Mental Maths for Classes 1 to 12.',
    highlight: 'Level 1 & Level 2 Proctored Exams',
    contactInfo: 'Online Slots • Flexible Dates',
    ctaText: 'Explore All 9 Disciplines',
    badge: 'National Rank #1 Trophy',
    themeGradient: 'from-[#6d3a68] via-[#a868a7] to-[#d9775b]',
    accentColor: '#d9775b',
    illustrationType: 'olympiad'
  },
  {
    id: 3,
    tag: 'Merit & Scholarships',
    tagBg: 'bg-[#faf4e0] text-[#8c4e8b] border-[#e7b84b]/40',
    title: 'Win Gold Medals, Scholarships & Global Ranks',
    subtitle: 'Top 5% qualify for the Grand Finale. Certified digital & physical certificates with QR blockchain verification.',
    highlight: '₹25,00,000+ Total Scholarship Pool',
    contactInfo: 'School & Zonal Trophies Included',
    ctaText: 'View Leaderboard & Awards',
    badge: 'Gold, Silver & Bronze Medals',
    themeGradient: 'from-[#5c3158] via-[#8c4e8b] to-[#d9775b]',
    accentColor: '#e7b84b',
    illustrationType: 'awards'
  },
  {
    id: 4,
    tag: 'Free Prep Resources',
    tagBg: 'bg-[#f4ebf4] text-[#6d3a68] border-[#edd6ed]',
    title: 'Free 2026 Sample Papers & Mock Tests',
    subtitle: 'Practice with previous year question sets (2022-2026) and simulated online exams with live timer and instant scorecards.',
    highlight: 'Full Answer Keys & HOTS Explanations',
    contactInfo: 'Instant Online Practice Simulator',
    ctaText: 'Take Free Practice Test',
    badge: '100% Free Practice Hub',
    themeGradient: 'from-[#4e2a4a] via-[#6d3a68] to-[#a868a7]',
    accentColor: '#e7b84b',
    illustrationType: 'prep'
  }
];

export const PublicHomePage = ({
  onNavigatePublic,
  onOpenRegister,
  onOpenLogin
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [activeFaq, setActiveFaq] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Hero Form State
  const [formTab, setFormTab] = useState('applicant'); // 'applicant' | 'school'
  const [applicantData, setApplicantData] = useState({
    country: 'India',
    candidateName: '',
    className: 'Class 5',
    schoolName: '',
    email: '',
    mobile: ''
  });
  const [schoolData, setSchoolData] = useState({
    country: 'India',
    schoolName: '',
    coordinatorName: '',
    email: '',
    phone: '',
    studentsCount: '100 - 500 Students'
  });

  // Auto slide interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleApplicantSubmit = (e) => {
    e.preventDefault();
    onOpenRegister();
  };

  const handleSchoolSubmit = (e) => {
    e.preventDefault();
    onNavigatePublic('schools');
  };

  const getIcon = (name) => {
    switch (name) {
      case 'Calculator': return Calculator;
      case 'Atom': return Atom;
      case 'BookOpen': return BookOpen;
      case 'Brain': return Brain;
      case 'Cpu': return Cpu;
      case 'Zap': return Zap;
      case 'Sparkles': return Sparkles;
      case 'Globe': return Globe;
      case 'Palette': return Palette;
      default: return Trophy;
    }
  };

  const filteredCategories = selectedClassFilter === 'all'
    ? OLYMPIAD_CATEGORIES
    : OLYMPIAD_CATEGORIES.filter((c) => c.classesList.includes(`Class ${selectedClassFilter}`));

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="space-y-16 pb-20 font-sans text-[#4e2a4a]">
      {/* 1. HERO SECTION WITH AUTO SLIDER (LEFT) & REGISTRATION FORM (RIGHT) */}
      <section className="relative pt-4 sm:pt-6 overflow-hidden">
        {/* Ambient Warm Gradient Backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#faf4e0]/40 via-[#faf5fa]/50 to-transparent -z-10 pointer-events-none rounded-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* LEFT SIDE: AUTO-SLIDING BANNER (7 COLS) - SQUARE BOX */}
            <div
              className="lg:col-span-7 relative flex flex-col justify-between"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slider Main Viewport - Simple Square Box */}
              <div className="relative w-full h-[460px] sm:h-[480px] rounded-md overflow-hidden shadow-md border border-[#2b3875] bg-gradient-to-br from-[#101e4a] via-[#1c2468] to-[#55359e] text-white flex flex-col justify-between p-6 sm:p-10 transition-all duration-500">
                
                {/* Background Pattern Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#5b3da8]/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#16327a]/30 rounded-full blur-2xl pointer-events-none" />

                {/* Slide Header Tag */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <span className={`px-3 py-1 rounded-sm text-[11px] font-black uppercase tracking-wider border ${slide.tagBg}`}>
                    ★ {slide.tag}
                  </span>
                  <span className="text-[11px] font-bold text-[#faf4e0] bg-white/15 px-3 py-1 rounded-sm border border-white/20 backdrop-blur-xs">
                    {slide.badge}
                  </span>
                </div>

                {/* Slide Center Content & Graphic Showcase */}
                <div className="relative z-10 my-auto space-y-4 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-black">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slide.highlight}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                    {slide.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#f4ebf4] font-normal leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Slide-specific graphic badge */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (slide.id === 1) onNavigatePublic('faqs');
                        else if (slide.id === 2) onNavigatePublic('olympiads');
                        else if (slide.id === 3) onNavigatePublic('rankings');
                        else onNavigatePublic('practice-hub');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#16327a] via-[#322378] to-[#5b3da8] hover:from-[#122459] hover:to-[#4d3291] text-white rounded-md text-xs font-black shadow-md shadow-[#16327a]/30 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-[#deb8de] font-semibold hidden sm:inline">
                      {slide.contactInfo}
                    </span>
                  </div>
                </div>

                {/* Slide Footer Info Bar */}
                <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-[#deb8de]">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#e7b84b]" />
                    <span>WhatsApp / Helpdesk: <strong>+91 98110 45220</strong></span>
                  </div>
                  <span className="font-bold text-white">SkillRise Olympiad 2026-27</span>
                </div>

                {/* Slider Left / Right Navigation Controls */}
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous Slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer z-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next Slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer z-20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Slider Pagination Indicator Dots */}
              <div className="flex items-center justify-center gap-2 pt-3">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2 rounded-xs transition-all cursor-pointer ${
                      currentSlide === idx
                        ? 'w-7 bg-[#6d3a68]'
                        : 'w-2.5 bg-[#edd6ed] hover:bg-[#b9a7d8]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: REGISTRATION / APPLICANT FORM (5 COLS) - SIMPLE SQUARE BOX */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-white rounded-md border border-[#c7d2fe] shadow-md p-6 sm:p-7 flex flex-col justify-between flex-1 relative">
                
                {/* Form Header */}
                <div>
                  <div className="border-b border-[#e0e7ff] pb-2.5 mb-5 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#16327a]">
                      New Applicant Registration
                    </span>
                    <span className="text-[10px] font-bold text-white bg-gradient-to-r from-[#16327a] to-[#5b3da8] px-2 py-0.5 rounded-sm shadow-xs">
                      Online 2026-27
                    </span>
                  </div>

                  {/* 1. NEW APPLICANT FORM */}
                  <form onSubmit={handleApplicantSubmit} className="space-y-3.5">
                      {/* Country Field */}
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <select
                          value={applicantData.country}
                          onChange={(e) => setApplicantData({ ...applicantData, country: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
                        >
                          <option value="India">Select Country (India)</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Singapore">Singapore</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Other">Other Country</option>
                        </select>
                      </div>

                      {/* Candidate Name */}
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="Candidate Name *"
                          value={applicantData.candidateName}
                          onChange={(e) => setApplicantData({ ...applicantData, candidateName: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-semibold text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
                        />
                      </div>

                      {/* Select Class */}
                      <div className="relative">
                        <Star className="w-4 h-4 text-[#fbbf24] absolute left-3.5 top-3 pointer-events-none" />
                        <select
                          value={applicantData.className}
                          onChange={(e) => setApplicantData({ ...applicantData, className: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
                        >
                          {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
                            <option key={cls} value={cls}>Select Class ({cls})</option>
                          ))}
                        </select>
                      </div>

                      {/* School Name */}
                      <div className="relative">
                        <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="School Name (Optional)"
                          value={applicantData.schoolName}
                          onChange={(e) => setApplicantData({ ...applicantData, schoolName: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-semibold text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="Email Address (Login ID) *"
                          value={applicantData.email}
                          onChange={(e) => setApplicantData({ ...applicantData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-semibold text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
                        />
                      </div>

                      {/* WhatsApp / Mobile */}
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          required
                          placeholder="WhatsApp / Mobile Number *"
                          value={applicantData.mobile}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setApplicantData({ ...applicantData, mobile: val });
                          }}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-semibold text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
                        />
                      </div>

                      {/* Submit CTA */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-[#16327a] via-[#322378] to-[#5b3da8] hover:from-[#122459] hover:to-[#4d3291] text-white rounded-md text-xs font-black shadow-md shadow-[#16327a]/25 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>Proceed to Register Student</span>
                        <ArrowRight className="w-4 h-4 text-[#fbbf24]" />
                      </button>
                    </form>
                </div>

                {/* Bottom Already Registered Link */}
                <div className="pt-3 mt-3 border-t border-slate-100 text-center text-[11px] text-slate-500">
                  <span>Already enrolled? </span>
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="font-extrabold text-[#16327a] hover:text-[#5b3da8] underline cursor-pointer"
                  >
                    Log In to Dashboard
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHERE LEARNING MEETS COMPETITION SECTION (DIRECTLY ON BACKGROUND WITHOUT BOXES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: Clean Typography Directly on Background */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2.5">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#4e2a4a] tracking-tight leading-snug">
                Where Learning Meets Competition
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl">
                SkillRise Olympiad brings learning, practice and competition together in one modern platform — helping students build stronger concepts, sharper thinking and greater confidence. Here's what sets us apart:
              </p>
            </div>

            {/* Clean Checklist Directly on Background */}
            <div className="space-y-3 pt-1">
              {[
                {
                  title: 'Think Beyond Textbooks',
                  desc: 'Conceptual questions that develop logic, reasoning and problem-solving skills — the foundation for future competitive excellence.'
                },
                {
                  title: 'Explore More Olympiads',
                  desc: 'Unique formats across Mathematics, Science, English, Cyber & AI, Reasoning, Mental Maths and Environmental Champions.'
                },
                {
                  title: 'Prepare With Confidence',
                  desc: 'Fully online exams with flexible slot booking, free model papers, topic worksheets and structured study resources.'
                },
                {
                  title: 'Measure Your Growth',
                  desc: 'Detailed section scorecards, topic-wise analytics, national percentiles and personalized performance insights.'
                },
                {
                  title: 'Celebrate Your Achievement',
                  desc: 'Earn certified medals, scholarship trophies and verified recognition for your hard work.'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#d9775b] font-medium text-sm mt-0.5 shrink-0 select-none">
                    ✓
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    <span className="font-semibold text-slate-700">{item.title}</span>
                    <span className="text-slate-400 mx-1.5">—</span>
                    <span>{item.desc}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* 4 Feature Highlights Cards - Compact Single Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-2.5 pb-1">
              {[
                {
                  title: 'Skill-Based Challenges',
                  desc: 'Questions to encourage logical thinking and problem-solving.',
                  icon: Brain,
                  iconBg: 'bg-[#f4ebf4] text-[#6d3a68] border-[#edd6ed]'
                },
                {
                  title: 'Smart Practice',
                  desc: 'Mock tests & papers to help students prepare confidently.',
                  icon: BookOpen,
                  iconBg: 'bg-[#fde8e4] text-[#d9775b] border-[#f7d7cc]'
                },
                {
                  title: 'Online Experience',
                  desc: 'Participate easily through a simple online platform.',
                  icon: Laptop,
                  iconBg: 'bg-[#faf5fa] text-[#8c4e8b] border-[#edd6ed]'
                },
                {
                  title: 'Performance Insights',
                  desc: 'Understand scores, rankings & progress after every attempt.',
                  icon: TrendingUp,
                  iconBg: 'bg-[#fdf0ed] text-[#c85e42] border-[#fcdad2]'
                }
              ].map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-[#edd6ed] rounded-lg p-2.5 sm:p-3 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-start"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${feat.iconBg} mb-1.5 shrink-0`}>
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <h4 className="text-[11px] sm:text-xs font-black text-[#4e2a4a] mb-1 leading-tight">
                      {feat.title}
                    </h4>
                    <p className="text-[10px] text-[#5c3158] leading-tight">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Simple CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenRegister}
                className="px-6 py-3 bg-gradient-to-r from-[#d9775b] to-[#c85e42] hover:from-[#c85e42] hover:to-[#a74a32] text-white rounded-md text-xs font-black shadow-md shadow-[#d9775b]/30 cursor-pointer transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Register Student Now</span>
                <ArrowRight className="w-4 h-4 text-[#e7b84b]" />
              </button>
              <button
                type="button"
                onClick={() => onNavigatePublic('practice-hub')}
                className="px-5 py-3 bg-[#f4ebf4] hover:bg-[#edd6ed] text-[#6d3a68] border border-[#edd6ed] rounded-md text-xs font-bold transition-all cursor-pointer"
              >
                Explore Free Practice Hub
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Clean Student Illustration Directly On Background */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
            <img
              src={studentScholarImg}
              alt="Young Olympiad Scholar"
              className="w-full max-w-[400px] sm:max-w-[450px] h-auto object-contain select-none"
            />
          </div>
        </div>
      </section>

      {/* 3. OLYMPIAD CATEGORIES DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#4e2a4a] tracking-tight leading-snug">
            Discover Challenges That Turn Learning Into Achievement
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Online Olympiad Exams for Classes 1-12
          </p>
        </div>

        {/* Categories Cards Grid - Square Layout with Subject Graphic & 2-Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredCategories.map((cat) => (
            <OlympiadCard
              key={cat.id}
              cat={cat}
              onNavigatePublic={onNavigatePublic}
              onOpenRegister={onOpenRegister}
            />
          ))}
        </div>
      </section>

      {/* 4. FOUR-STEP PATHWAY SECTION */}
      <section className="bg-gradient-to-b from-[#faf5fa] via-[#fff9f2] to-[#FAF4E0]/40 py-16 border-y border-[#edd6ed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#4e2a4a] tracking-tight leading-snug">
              Challenge Yourself in 4 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-[#6c568d] font-semibold">
              From discovering subjects to receiving internationally verifiable merit awards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                step: '01',
                title: 'Discover & Register',
                desc: 'Select your preferred Olympiad disciplines and choose your suitable online test slot.',
                image: stepRegisterChildImg,
                badgeBg: 'bg-[#6d3a68] text-white',
                borderHover: 'hover:border-[#6d3a68]/60',
                action: () => onOpenRegister()
              },
              {
                step: '02',
                title: 'Prepare with Model Papers',
                desc: 'Access past question banks, chapter blueprints, and practice mock tests.',
                image: stepStudyChildImg,
                badgeBg: 'bg-[#d9775b] text-white',
                borderHover: 'hover:border-[#d9775b]/60',
                action: () => onNavigatePublic('sample-papers')
              },
              {
                step: '03',
                title: 'Live Online Testing',
                desc: 'Attempt proctored assessments from home or school on any browser.',
                image: stepExamChildImg,
                badgeBg: 'bg-[#b88014] text-white',
                borderHover: 'hover:border-[#e7b84b]/60',
                action: () => onNavigatePublic('practice-hub')
              },
              {
                step: '04',
                title: 'Results & Certification',
                desc: 'Receive comprehensive scorecards, national rank analysis, and merit medals.',
                image: stepAwardChildImg,
                badgeBg: 'bg-[#8c4e8b] text-white',
                borderHover: 'hover:border-[#8c4e8b]/60',
                action: () => onNavigatePublic('rankings')
              }
            ].map((st, sIdx) => (
              <div
                key={sIdx}
                onClick={st.action}
                className={`bg-white rounded-md border border-[#edd6ed] ${st.borderHover} shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer`}
              >
                {/* Top Realistic Photo Canvas with Number Badge */}
                <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-slate-100 border-b border-[#edd6ed]/60">
                  {/* Step Number Badge */}
                  <div className={`absolute top-2.5 left-2.5 w-6 h-6 rounded-full ${st.badgeBg} flex items-center justify-center text-[10px] font-black shadow-md z-10 font-mono ring-2 ring-white/80`}>
                    {st.step}
                  </div>

                  <img
                    src={st.image}
                    alt={st.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Content */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between space-y-2.5">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-[#4e2a4a] group-hover:text-[#6d3a68] transition-colors leading-snug">
                      {st.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed font-normal line-clamp-2">
                      {st.desc}
                    </p>
                  </div>

                  {/* Bottom Step Indicator */}
                  <div className="pt-1.5 border-t border-[#f4ebf4] flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#8c4e8b]">
                      Step {st.step}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHAT MAKES OLYMPIADHUB DIFFERENT? & VIDEO WALKTHROUGH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Clean Content & Value Pillars */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#4e2a4a] tracking-tight leading-snug">
                What Makes SkillRise Olympiad Different?
              </h2>
              
              <div className="space-y-3.5 text-xs sm:text-sm text-[#5c3158] leading-relaxed font-normal">
                <p>
                  SkillRise Olympiad brings learning and competition together through engaging online assessments designed to test knowledge, reasoning, problem-solving, creativity, and critical thinking. Students can explore multiple academic disciplines, practice with structured questions and mock tests, participate in exciting online Olympiads, and challenge themselves at their own level.
                </p>
                <p>
                  With a simple and student-friendly platform, SkillRise Olympiad makes it easy to discover competitions, prepare effectively, attempt exams, and track progress through detailed results, rankings, performance insights, and certificates. Our goal is to make every Olympiad experience meaningful, engaging, and focused on helping students build confidence while discovering their strengths.
                </p>
              </div>
            </div>

            {/* Value Feature Highlights */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {[
                { title: 'Interactive Online Exams', icon: '💻' },
                { title: 'Reasoning & Logic Focus', icon: '🧠' },
                { title: 'Instant Score & Rank Card', icon: '📊' },
                { title: 'Verified Merit Medals', icon: '🏆' }
              ].map((pill, pIdx) => (
                <div
                  key={pIdx}
                  className="flex items-center gap-2 p-2.5 rounded-md bg-[#faf5fa] border border-[#edd6ed] text-[11px] sm:text-xs font-bold text-[#4e2a4a]"
                >
                  <span className="text-sm">{pill.icon}</span>
                  <span className="truncate">{pill.title}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenRegister}
                className="px-6 py-2.5 bg-gradient-to-r from-[#16327a] via-[#322378] to-[#5b3da8] hover:from-[#122459] hover:to-[#4d3291] text-white rounded-md text-xs font-black shadow-md shadow-[#16327a]/30 cursor-pointer transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Register Student Now</span>
                <ArrowRight className="w-4 h-4 text-[#fbbf24]" />
              </button>
              <button
                type="button"
                onClick={() => onNavigatePublic('practice-hub')}
                className="px-5 py-2.5 bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#16327a] border border-[#c7d2fe] rounded-md text-xs font-bold transition-all cursor-pointer"
              >
                Explore Free Practice Hub
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Embedded YouTube Olympiad Guide Video */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative w-full rounded-md border border-[#edd6ed] shadow-md overflow-hidden bg-black aspect-video group">
              {/* YouTube Embed */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/EiITdgvwu1k?rel=0&modestbranding=1"
                title="Olympiad Online Examination Walkthrough & Portal Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Caption Badge */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="font-bold text-[#16327a] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>Video: How Online Olympiad Exams Work</span>
              </span>
              <span className="text-[10px] text-slate-400">Walkthrough &amp; Guidelines</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. OLYMPIADS EXAM PREPARATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16327a] tracking-tight leading-snug">
            Olympiads Exam Preparations
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] font-semibold">
            Comprehensive study materials, question banks, and learning resources to master every discipline.
          </p>
        </div>

        {/* 7 Preparation Cards Grid with Dark Royal Blue & Purple Theme */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 max-w-6xl mx-auto">
          {[
            {
              id: 'sample-paper',
              title: 'Sample Paper',
              type: 'sample-paper',
              bgGradient: 'bg-gradient-to-b from-[#101b44] via-[#16225a] to-[#2b1b56]',
              borderColor: 'border-[#303c78] hover:border-[#818cf8]',
              textColor: 'text-white',
              action: () => onNavigatePublic('sample-papers')
            },
            {
              id: 'previous-paper',
              title: 'Previous Paper',
              type: 'previous-paper',
              bgGradient: 'bg-gradient-to-b from-[#161440] via-[#1f1a52] to-[#341860]',
              borderColor: 'border-[#3f327a] hover:border-[#c084fc]',
              textColor: 'text-white',
              action: () => onNavigatePublic('sample-papers')
            },
            {
              id: 'test-generator',
              title: 'Test Generator',
              type: 'test-generator',
              bgGradient: 'bg-gradient-to-b from-[#0d1840] via-[#162054] to-[#281850]',
              borderColor: 'border-[#2d3a72] hover:border-[#fbbf24]',
              textColor: 'text-white',
              action: () => onNavigatePublic('practice-hub')
            },
            {
              id: 'mock-test',
              title: 'Mock Test',
              type: 'mock-test',
              bgGradient: 'bg-gradient-to-b from-[#14123e] via-[#1d1750] to-[#30165c]',
              borderColor: 'border-[#3a2d74] hover:border-[#818cf8]',
              textColor: 'text-white',
              action: () => onNavigatePublic('practice-hub')
            },
            {
              id: 'live-class',
              title: 'Live Online Class',
              type: 'live-class',
              bgGradient: 'bg-gradient-to-b from-[#0e163c] via-[#171e52] to-[#2a1754]',
              borderColor: 'border-[#333774] hover:border-[#c084fc]',
              textColor: 'text-white',
              action: () => onNavigatePublic('practice-hub')
            },
            {
              id: 'revision',
              title: 'Revision',
              type: 'revision',
              bgGradient: 'bg-gradient-to-b from-[#16153e] via-[#201b50] to-[#33175c]',
              borderColor: 'border-[#3c2f78] hover:border-[#fbbf24]',
              textColor: 'text-white',
              action: () => onNavigatePublic('workbooks')
            },
            {
              id: 'free-quiz',
              title: 'Free Quiz',
              type: 'free-quiz',
              bgGradient: 'bg-gradient-to-b from-[#0e173e] via-[#181f54] to-[#2d1858]',
              borderColor: 'border-[#353b78] hover:border-[#c084fc]',
              textColor: 'text-white',
              action: () => onNavigatePublic('free-trial')
            }
          ].map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className={`${item.bgGradient} rounded-md border-2 ${item.borderColor} shadow-md hover:shadow-xl transition-all duration-300 p-2 sm:p-2.5 flex flex-col justify-between items-center text-center cursor-pointer group select-none hover:-translate-y-1`}
            >
              {/* Card Title on Top */}
              <h3 className={`text-[11px] sm:text-xs font-black ${item.textColor} leading-snug h-7 flex items-center justify-center tracking-tight`}>
                {item.title}
              </h3>

              {/* Graphic Illustration */}
              <div className="w-full my-1 flex items-center justify-center">
                <PrepResourceGraphic type={item.type} className="w-full h-18 sm:h-20 group-hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. GLOBAL IMPACT & COMMUNITY REVIEWS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8 border-t border-[#edd6ed]">
        
        {/* Top Trust Stats Row - Clean Direct on Background (No Box Wrappers) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto py-2">
          {/* Stat 1: Countries */}
          <div className="flex items-center gap-3.5 sm:gap-4 justify-start md:justify-center">
            <div className="w-12 h-12 rounded-full bg-[#fde8e4] border border-[#f7d7cc] flex items-center justify-center shrink-0 text-[#d9775b]">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">45+</span>
                <span className="text-sm sm:text-base font-bold text-[#4e2a4a]">Countries</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 font-normal leading-tight mt-0.5">
                Participating from across the globe.
              </p>
            </div>
          </div>

          {/* Stat 2: Scholars */}
          <div className="flex items-center gap-3.5 sm:gap-4 justify-start md:justify-center">
            <div className="w-12 h-12 rounded-full bg-[#fde8e4] border border-[#f7d7cc] flex items-center justify-center shrink-0 text-[#d9775b]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">2.4M+</span>
                <span className="text-sm sm:text-base font-bold text-[#4e2a4a]">Scholars</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 font-normal leading-tight mt-0.5">
                Young minds, big dreams, one platform.
              </p>
            </div>
          </div>

          {/* Stat 3: Schools */}
          <div className="flex items-center gap-3.5 sm:gap-4 justify-start md:justify-center">
            <div className="w-12 h-12 rounded-full bg-[#fde8e4] border border-[#f7d7cc] flex items-center justify-center shrink-0 text-[#d9775b]">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">8,500+</span>
                <span className="text-sm sm:text-base font-bold text-[#4e2a4a]">Schools</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 font-normal leading-tight mt-0.5">
                Trusted by schools worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Review Slider */}
        <div className="relative pt-4">
          <div className="relative flex items-center">
            {/* Left Nav Arrow */}
            <button
              type="button"
              onClick={() => setReviewIndex((prev) => (prev - 1 + 5) % 5)}
              className="absolute -left-3 sm:-left-5 z-20 w-9 h-9 rounded-full bg-white border border-[#edd6ed] shadow-md flex items-center justify-center text-[#6d3a68] hover:bg-[#6d3a68] hover:text-white transition-all cursor-pointer active:scale-95"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Testimonial Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full px-2 sm:px-4">
              {[
                {
                  quote: 'Good to communicate with new technology.. The online examination system and analytical feedback helped our students achieve their personal best.',
                  author: 'Vividha Baranwal',
                  school: 'Gurucharan Kaur Public School',
                  badge: 'Class 5 Scholar'
                },
                {
                  quote: 'A very nice platform for all the students to prove themselves.. Questions challenge logical thinking, critical reasoning, and real problem solving.',
                  author: 'Gunjan Sharma',
                  school: 'Seth Tolaram Bafna Academy',
                  badge: 'Academic Head'
                },
                {
                  quote: 'One of the best Olympiad platforms!! Live proctored assessments, transparent slot booking, and instant detailed scorecards are truly commendable.',
                  author: 'Hemanth Rajarajan',
                  school: 'DAV Public School, Velachery, Chennai',
                  badge: 'Class 8 Ranker'
                },
                {
                  quote: 'The school coordinator portal with bulk uploads, student schedule assignment, and comparative performance analytics is top-notch.',
                  author: 'Sister Mary Joseph',
                  school: "St. Xavier's International Academy",
                  badge: 'Coordinator'
                },
                {
                  quote: 'My daughter participated in Mathematics & Science Olympiads and earned a National Gold Medal! Seamless learning and testing experience.',
                  author: 'Pooja Sharma',
                  school: 'Delhi Public School, R.K. Puram',
                  badge: 'Proud Parent'
                }
              ]
                .slice(reviewIndex, reviewIndex + 3)
                .concat(
                  [
                    {
                      quote: 'Good to communicate with new technology.. The online examination system and analytical feedback helped our students achieve their personal best.',
                      author: 'Vividha Baranwal',
                      school: 'Gurucharan Kaur Public School',
                      badge: 'Class 5 Scholar'
                    },
                    {
                      quote: 'A very nice platform for all the students to prove themselves.. Questions challenge logical thinking, critical reasoning, and real problem solving.',
                      author: 'Gunjan Sharma',
                      school: 'Seth Tolaram Bafna Academy',
                      badge: 'Academic Head'
                    },
                    {
                      quote: 'One of the best Olympiad platforms!! Live proctored assessments, transparent slot booking, and instant detailed scorecards are truly commendable.',
                      author: 'Hemanth Rajarajan',
                      school: 'DAV Public School, Velachery, Chennai',
                      badge: 'Class 8 Ranker'
                    }
                  ].slice(0, Math.max(0, 3 - (5 - reviewIndex)))
                )
                .slice(0, 3)
                .map((rev, rIdx) => (
                  <div
                    key={rIdx}
                    className="bg-white rounded-md border border-[#edd6ed] shadow-2xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4 group hover:border-[#6d3a68]/40"
                  >
                    <div className="space-y-3">
                      {/* 5-Star Rating */}
                      <div className="flex items-center gap-1 text-[#e7b84b]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      {/* Quote Text */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{rev.quote}"
                      </p>
                    </div>

                    {/* Author & School Details */}
                    <div className="pt-3 border-t border-[#f4ebf4] flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-[#4e2a4a] group-hover:text-[#6d3a68] transition-colors">
                          {rev.author}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {rev.school}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] shrink-0">
                        {rev.badge}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Right Nav Arrow */}
            <button
              type="button"
              onClick={() => setReviewIndex((prev) => (prev + 1) % 5)}
              className="absolute -right-3 sm:-right-5 z-20 w-9 h-9 rounded-full bg-white border border-[#edd6ed] shadow-md flex items-center justify-center text-[#6d3a68] hover:bg-[#6d3a68] hover:text-white transition-all cursor-pointer active:scale-95"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </section>
    </div>
  );
};
