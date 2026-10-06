import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import {
  Play,
  CheckCircle2,
  Users,
  Video,
  BookOpen,
  Award,
  Sparkles,
  Star,
  Clock,
  ShoppingCart,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Zap,
  GraduationCap,
  FileText,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Loader2
} from 'lucide-react';

export const OnlineClassesPage = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToCart, openCart } = useCart();
  const studentGrade = user?.class || 'Class 6';

  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'self_paced_details'
  const [selectedBatch, setSelectedBatch] = useState('reasoning_b1');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [apiPackages, setApiPackages] = useState([]);
  const [heroBanner, setHeroBanner] = useState({
    badge: 'FEATURED',
    title: 'Reasoning Online Classes for IMO, ISO(NSO) & IEO',
    subtitle: 'Master logical reasoning and critical thinking with live interactive sessions and expert faculty.',
    btnText: 'ENROLL NOW →',
    active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOnlineClassesData();
  }, [studentGrade]);

  const fetchOnlineClassesData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/online-classes', { class: studentGrade });
      if (res?.data) {
        if (res.data.packages && res.data.packages.length > 0) {
          setApiPackages(res.data.packages);
        }
        if (res.data.heroBanner) {
          setHeroBanner(res.data.heroBanner);
        }
      }
    } catch (e) {
      console.warn('Could not load online classes from server, using built-in catalog:', e);
    } finally {
      setLoading(false);
    }
  };

  // Video Lectures Data
  const videoLectures = [
    {
      id: 'v1',
      title: 'Mastering English Grammar Rules',
      subject: 'IEO (English)',
      category: 'IEO PREPARATION',
      duration: '42 mins',
      bgGradient: 'from-amber-600 to-orange-700',
      badgeColor: 'bg-orange-600',
      desc: 'Master essential tenses, modal auxiliaries, subject-verb agreement, and error detection rules for IEO Achievers section.',
      thumbnailText: 'LEARN ENGLISH GRAMMAR'
    },
    {
      id: 'v2',
      title: 'All About MODAL Verbs & Syntax',
      subject: 'IEO / ISO',
      category: 'IEO PREPARATION',
      duration: '38 mins',
      bgGradient: 'from-yellow-600 to-amber-700',
      badgeColor: 'bg-amber-600',
      desc: 'Comprehensive visual breakdown of modal verbs (can, could, might, should, must) with real Olympiad sentence applications.',
      thumbnailText: 'ALL ABOUT MODAL VERBS'
    },
    {
      id: 'v3',
      title: 'Mastering Fractions: Simplified for IMO',
      subject: 'IMO (Maths)',
      category: 'IMO PREPARATION',
      duration: '45 mins',
      bgGradient: 'from-amber-500 to-yellow-600',
      badgeColor: 'bg-yellow-600',
      desc: 'Fraction operations, improper fractions, visual models, and speed shortcuts to solve IMO Section 2 fraction word problems.',
      thumbnailText: 'SIMPLIFIED FOR IMO PREPARATION'
    },
    {
      id: 'v4',
      title: 'Prepare for Class Olympiads (NSO Science)',
      subject: 'ISO (Science)',
      category: 'NSO PREPARATION',
      duration: '50 mins',
      bgGradient: 'from-emerald-700 to-green-800',
      badgeColor: 'bg-green-700',
      desc: 'Physics forces, chemical reactions, environmental biology, and scientific methodology for National Science Olympiad.',
      thumbnailText: 'CLASS OLYMPIAD NSO PREPARATION'
    }
  ];

  // Faculty & Batch Data
  const teacherBatches = {
    reasoning_b1: [
      {
        id: 't1',
        name: 'Mrs. Komal Rajput',
        role: 'FACULTY - Reasoning Class 3',
        exp: 'Over 10+ years of teaching experience',
        bio: 'Mrs. Komal Rajput is an enthusiastic and experienced educator with over 10 years of experience in mentoring students for competitive Olympiads, specialized in visual reasoning, pattern decoding, and mental matrices.',
        rating: '4.9 ★',
        students: '12,400+ Students Mentored'
      },
      {
        id: 't2',
        name: 'Ms. Laxmi S.',
        role: 'FACULTY - Reasoning Class 3, 4',
        exp: 'Over 8 years of teaching experience',
        bio: 'Ms. Laxmi is a dedicated and friendly educator with over 8 years of specialized teaching in logical problem solving, analogies, number puzzles, and inductive logic.',
        rating: '4.8 ★',
        students: '9,800+ Students Mentored'
      },
      {
        id: 't3',
        name: 'Mrs. Nikhita Goshal',
        role: 'FACULTY - Reasoning Class 5, 6',
        exp: 'Over 9 years of teaching experience',
        bio: 'Mrs. Nikhita Goshal is a passionate mentor guiding middle-school students into advanced reasoning, syllogisms, coordinate direction tests, and blood relations.',
        rating: '5.0 ★',
        students: '15,200+ Students Mentored'
      },
      {
        id: 't4',
        name: 'Shalini Jaiswal',
        role: 'FACULTY - Reasoning Class 7, 8',
        exp: 'Total 20+ years of teaching experience',
        bio: 'Shalini Jaiswal is a professional senior educator having a total 20+ years of experience, mentoring students across top national schools for Achievers Level Olympiads.',
        rating: '4.9 ★',
        students: '28,000+ Students Mentored'
      }
    ],
    ieo_b1: [
      {
        id: 't5',
        name: 'Dr. Rebecca Thorne',
        role: 'FACULTY - English (IEO)',
        exp: '14+ years in Linguistics & ESL',
        bio: 'Expert in grammar fluency, advanced orthography, reading speed enhancement, and critical verbal logic for International English Olympiad.',
        rating: '4.9 ★',
        students: '11,000+ Students'
      },
      {
        id: 't6',
        name: 'Mr. Arvind Mehta',
        role: 'FACULTY - English Achievers',
        exp: '11+ years of Olympiad training',
        bio: 'Specialist in vocabulary acquisition, idioms, active/passive voice transformations, and reading comprehension.',
        rating: '4.8 ★',
        students: '8,500+ Students'
      }
    ],
    iso_b1: [
      {
        id: 't7',
        name: 'Dr. S. K. Sharma',
        role: 'FACULTY - Science (ISO/NSO)',
        exp: '16+ years in Experimental Science',
        bio: 'Senior Science Mentor guiding students in NCERT/CBSE/ICSE concepts, practical observations, and Achievers HOTS science problems.',
        rating: '5.0 ★',
        students: '20,000+ Students'
      }
    ],
    imo_b1: [
      {
        id: 't8',
        name: 'Prof. R. C. Verma',
        role: 'FACULTY - Mathematics (IMO)',
        exp: '22+ years in Speed Mathematics',
        bio: 'National Olympiad Trainer specializing in speed arithmetic, algebraic number theory, geometry shortcuts, and Achievers section mastery.',
        rating: '5.0 ★',
        students: '35,000+ Students'
      }
    ]
  };

  const currentFacultyList = teacherBatches[selectedBatch] || teacherBatches.reasoning_b1;

  // Handle Add to Cart & Open Checkout
  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice || (item.price === 1999 ? 2500 : item.price === 2999 ? 3500 : item.price === 4999 ? 6500 : Math.round(item.price * 1.25)),
      category: 'Recorded Classes',
      grade: studentGrade,
      quantity: 1
    });
    setShowCartSuccess(true);
    setTimeout(() => setShowCartSuccess(false), 3500);
    openCart();
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-150 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {showCartSuccess && (
        <div className="fixed bottom-6 right-6 bg-[#321630] text-white px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-150 border border-[#e7b84b]/40">
          <CheckCircle2 className="w-5 h-5 text-[#00b074] shrink-0" />
          <span className="text-xs font-black text-white">Package added to cart!</span>
          <button
            type="button"
            onClick={openCart}
            className="px-3 py-1 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-xs active:scale-95"
          >
            View Cart 🛒
          </button>
        </div>
      )}

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-[#edd6ed] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] uppercase">
                  {selectedVideo.category}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900">{selectedVideo.title}</h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Mock Player */}
            <div className="w-full aspect-video bg-slate-900 rounded-2xl relative flex flex-col items-center justify-center text-white overflow-hidden shadow-inner group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <p className="text-xs font-bold text-amber-300">Live Concept Class Recording</p>
                <p className="text-sm font-black">{selectedVideo.title}</p>
                <p className="text-[11px] text-slate-300">Faculty: Senior Olympiad Mentor • Duration: {selectedVideo.duration}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedVideo.desc}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-[#6d3a68]">Includes Chapter Notes &amp; Practice Worksheets</span>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="px-5 py-2 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white rounded-xl text-xs font-bold hover:bg-[#5c3158] transition-colors cursor-pointer"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#4e2a4a] tracking-tight">
            Online Concept Classes &amp; Live Mentorship
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Structured recorded sessions, topic quizzes, problem solving &amp; masterclasses
          </p>
        </div>

        <span className="text-xs font-black text-[#6d3a68] bg-[#f4ebf4] px-3.5 py-1.5 rounded-xl border border-[#edd6ed] shadow-2xs">
          Enrolled Grade: {studentGrade}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 1. VIEW MODE A: MAIN OVERVIEW WITH PACKAGES & VIDEOS & TEACHERS            */}
      {/* ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          {/* FEATURED HERO BANNER */}
          {heroBanner?.active && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] p-6 sm:p-8 text-white shadow-xl border-2 border-indigo-400/40">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-pink-200 font-black text-[11px] uppercase tracking-wider shadow-xs border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{heroBanner.badge || 'FEATURED'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight drop-shadow-xs">
                  {heroBanner.title}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                  {heroBanner.subtitle}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('self_paced_details');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white font-black rounded-2xl text-xs sm:text-sm shadow-md transition-all transform active:scale-95 cursor-pointer flex items-center gap-2 border border-white/20"
                  >
                    <span>{heroBanner.btnText || 'ENROLL NOW →'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart({
                      id: 'pkg_hero_featured',
                      name: heroBanner.title,
                      price: 2499,
                      originalPrice: 3500
                    })}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-xs border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Quick Add (₹2,499)</span>
                  </button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute right-[-40px] -bottom-10 w-72 h-72 bg-gradient-to-br from-amber-400/20 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-xs shadow-xl">
                <div className="flex items-center gap-1 text-amber-300 text-xs font-black">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-white ml-1 font-bold">4.9 / 5</span>
                </div>
                <p className="text-[11px] text-pink-100 font-medium leading-snug">
                  Comprehensive Concept Lectures, Practice Quizzes, and Instant Test Generator for Olympiad mastery.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Syllabus Coverage Guaranteed</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1: ONLINE CONCEPT CLASSES PACKAGES (2 SIDE-BY-SIDE CARDS) */}
          <div className="space-y-4">
            <div className="text-center pt-2 pb-1">
              <h2 className="text-lg sm:text-xl font-black text-[#4e2a4a] tracking-tight">
                Online Concept Classes Packages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Package 1: Self-Paced Recorded Concept Classes */}
              <div className="bg-white rounded-3xl border-2 border-[#e7b84b] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  {/* Top Golden Header */}
                  <div className="min-h-[58px] flex items-center justify-center text-center bg-[#e7b84b] text-[#321630] font-black text-xs sm:text-sm py-2 px-4 rounded-xl shadow-xs leading-snug">
                    Olympiads Self-Paced Recorded Concept Classes - {studentGrade}
                  </div>

                  {/* Bullet Highlights */}
                  <div className="space-y-2 pt-4 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Watch, rewind, pause, replay and revise anytime at your own pace</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Structured series of Recorded Concept classes.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Chapter-wise Presentation Videos for self-paced study</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Chapter-wise Assignments for additional practice</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Chapter-wise Quiz for quick revision</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Previous Year Papers (2024 &amp; 2025) for practice and pattern understanding</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Reasoning Skill Development Program (RSDP) with Reasoning Recorded Concept classes.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Logical Reasoning Previous Year&apos;s Questions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Intelligent Olympiad Test Generator built for smart Olympiad preparation.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-center text-xs font-bold text-slate-500">
                    Price : <span className="text-sm font-black text-emerald-600">₹ 2,499</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSubTab('self_paced_details');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="py-2.5 px-3 bg-[#5c6b73] hover:bg-[#4a575e] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      VIEW DETAILS
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSubTab('self_paced_details');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="py-2.5 px-3 bg-[#e04f44] hover:bg-[#c93f35] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md active:scale-95"
                    >
                      BUY
                    </button>
                  </div>
                </div>
              </div>

              {/* Package 2: Online Concept Classes & Learners Package */}
              <div className="bg-white rounded-3xl border-2 border-[#e7b84b] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  {/* Top Golden Header */}
                  <div className="min-h-[58px] flex items-center justify-center text-center bg-[#e7b84b] text-[#321630] font-black text-xs sm:text-sm py-2 px-4 rounded-xl shadow-xs leading-snug">
                    Olympiads Online Concept Classes &amp; Learners Package - {studentGrade}
                  </div>

                  {/* Bullet Highlights */}
                  <div className="space-y-2 pt-4 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>One Package. Complete Preparation. Greater Confidence.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Rare and benefit with big discount and access. Package.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Solution course of IMO, ISO packages.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>24 Online Concept classes of IMO, ISO</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Online Assignments, Mid Term Assessments.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Recordings of all classes.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Chapter-wise Test Series.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Topic-Wise Explanatory Videos of IMO</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Round 1 Previous Years Papers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Round 1 Mock Tests.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                      <span>Interactive &amp; Downloadable Previous Year Papers and Mock Tests.</span>
                    </div>
                    <div className="flex items-start gap-2 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="font-bold text-amber-900">Intelligent Olympiad Test Generator designed specifically for Olympiad preparation</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-center text-xs font-bold text-slate-500">
                    Price : <span className="text-sm font-black text-emerald-600">₹ 4,999</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSubTab('self_paced_details');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="py-2.5 px-3 bg-[#5c6b73] hover:bg-[#4a575e] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      VIEW DETAILS
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSubTab('self_paced_details');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="py-2.5 px-3 bg-[#e04f44] hover:bg-[#c93f35] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md active:scale-95"
                    >
                      BUY
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ONLINE CLASSES VIDEOS (4 VIDEO THUMBNAILS) */}
          <div className="space-y-4">
            <div className="text-center pt-2 pb-1">
              <h2 className="text-lg sm:text-xl font-black text-[#4e2a4a] tracking-tight">
                Online Classes Videos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {videoLectures.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col justify-between"
                >
                  {/* Video Thumbnail Screen */}
                  <div className={`h-36 bg-gradient-to-br ${vid.bgGradient} p-4 text-white flex flex-col justify-between relative overflow-hidden`}>
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                        {vid.category}
                      </span>
                      <span className="text-[9px] font-mono font-bold bg-black/50 px-1.5 py-0.5 rounded">
                        {vid.duration}
                      </span>
                    </div>

                    {/* Central Red Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transform group-hover:scale-115 transition-transform">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <div className="z-10">
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-200">
                        {vid.thumbnailText}
                      </p>
                    </div>
                  </div>

                  {/* Video Info Bottom */}
                  <div className="p-3.5 space-y-1">
                    <h4 className="text-xs font-black text-slate-800 leading-snug group-hover:text-[#6d3a68] transition-colors">
                      {vid.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Subject: <span className="font-bold text-[#6d3a68]">{vid.subject}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: WHAT WE OFFER (2026-2027) */}
          <div className="bg-white rounded-3xl border border-[#edd6ed] p-6 sm:p-7 shadow-sm space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-black text-[#d9775b] uppercase tracking-wider">WHAT WE OFFER</h3>
              <h2 className="text-base sm:text-lg font-black text-[#4e2a4a] mt-0.5">
                Olympiad Online Classes 2026-27
              </h2>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 max-w-2xl mx-auto">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                <span>Prepare for IMO, ISO, IEO Olympiads from the comfort of your home.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                <span>Enhance your problem-solving skills with Logical Reasoning Online Classes.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                <span>Structured interactive curriculum, live batch doubt clearing, and instant diagnostic scorecards.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VIEW MODE B: DETAILED SELF-PACED SUBJECT PACKAGES (2x2 Grid)           */}
      {/* ========================================================================= */}
      {activeSubTab === 'self_paced_details' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Back to Overview and Breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Online Classes Overview</span>
            </button>
            <span className="text-xs text-slate-500 font-bold">
              Grade: <span className="text-[#6d3a68]">{studentGrade}</span>
            </span>
          </div>

          {/* Top Header Bar Matching Screenshot */}
          <div className="bg-[#dce3ea] rounded-2xl p-3.5 border border-slate-300 flex items-center justify-between shadow-xs">
            <h2 className="text-xs sm:text-sm md:text-base font-black text-slate-900 tracking-tight">
              Olympiads Self-Paced Recorded Concept Classes - {studentGrade}
            </h2>
            <button
              type="button"
              onClick={() => handleAddToCart({ id: 'pkg_bundle', name: `All Subjects Bundle - ${studentGrade}`, price: 4999 })}
              className="px-4 py-1.5 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>ADD TO CART</span>
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Subjects Grid (2x2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 1. IEO */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 pb-1">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                    IEO Recorded Concept Classes - {studentGrade}
                  </h3>
                </div>

                {/* Sub-card 1: Recorded Classes */}
                <div className="p-3 bg-[#e0f2fe] rounded-xl border border-[#bae6fd] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-sky-950 flex items-center gap-1.5 text-xs">
                    <span>📖</span> Recorded Classes
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• Total 25 Recorded Classes – Learn, Revisit &amp; Revise Anytime</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Recorded classes covering the entire syllabus - Chapter-wise</p>
                  <p className="text-[11px] text-slate-700 pl-4">• 2 Previous Year Papers (2024 &amp; 2025)</p>
                </div>

                {/* Sub-card 2: Practice & Tests */}
                <div className="p-3 bg-[#f3e8ff] rounded-xl border border-[#e9d5ff] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-purple-950 flex items-center gap-1.5 text-xs">
                    <span>📝</span> Practice &amp; Tests
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Presentation Videos for practice and reinforcement</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Assignments for additional practice</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Quizzes for quick revision</p>
                  <p className="text-[11px] text-slate-700 pl-4">• 2 Level-1 Previous Year Papers (2024 &amp; 2025)</p>
                </div>

                {/* Sub-card 3: Intelligent Test Generator */}
                <div className="p-3 bg-[#dcfce7] rounded-xl border border-[#bbf7d0] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-emerald-950 flex items-center gap-1.5 text-xs">
                    <span>☑️</span> Intelligent Olympiad Test Generator
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• A bigger, &quot;Intelligent&quot; question bank</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Smart Question Selection</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Generate upto 10 personalised tests</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="bg-[#fef3c7] border border-[#fde68a] px-3 py-1.5 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-black text-amber-900 flex items-center gap-1">
                    <span>🏷️</span> Special Offer
                  </span>
                  <div className="space-x-1.5">
                    <span className="text-slate-400 line-through text-[11px]">3000.00</span>
                    <span className="text-slate-400">—</span>
                    <span className="font-black text-emerald-800 text-xs sm:text-sm">2499.00</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToCart({ id: 'pkg_ieo', name: `IEO Concept Classes - ${studentGrade}`, price: 2499 })}
                  className="w-full py-2 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 rounded-xl text-xs font-black shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* 2. ISO / NSO */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 pb-1">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                    ISO (NSO) Recorded Concept Classes - {studentGrade}
                  </h3>
                </div>

                <div className="p-3 bg-[#e0f2fe] rounded-xl border border-[#bae6fd] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-sky-950 flex items-center gap-1.5 text-xs">
                    <span>📖</span> Recorded Classes
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• Total 27 Recorded Classes – Learn, Revisit &amp; Revise Anytime</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Recorded classes covering the entire syllabus - Chapter-wise</p>
                  <p className="text-[11px] text-slate-700 pl-4">• 2 Previous Year Papers (2024 &amp; 2025)</p>
                </div>

                <div className="p-3 bg-[#f3e8ff] rounded-xl border border-[#e9d5ff] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-purple-950 flex items-center gap-1.5 text-xs">
                    <span>📝</span> Practice &amp; Tests
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Presentation Videos for practice and reinforcement</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Assignments for additional practice</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Quizzes for quick revision</p>
                  <p className="text-[11px] text-slate-700 pl-4">• 2 Level-1 Previous Year Papers (2024 &amp; 2025)</p>
                </div>

                <div className="p-3 bg-[#dcfce7] rounded-xl border border-[#bbf7d0] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-emerald-950 flex items-center gap-1.5 text-xs">
                    <span>☑️</span> Intelligent Olympiad Test Generator
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• Bigger &quot;Intelligent&quot; Question Repository</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Smart Question Selection</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Generate upto 10 personalised tests</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="bg-[#fef3c7] border border-[#fde68a] px-3 py-1.5 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-black text-amber-900 flex items-center gap-1">
                    <span>🏷️</span> Special Offer
                  </span>
                  <div className="space-x-1.5">
                    <span className="text-slate-400 line-through text-[11px]">3500.00</span>
                    <span className="text-slate-400">—</span>
                    <span className="font-black text-emerald-800 text-xs sm:text-sm">2999.00</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToCart({ id: 'pkg_iso', name: `ISO Concept Classes - ${studentGrade}`, price: 2999 })}
                  className="w-full py-2 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 rounded-xl text-xs font-black shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* 3. REASONING */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 pb-1">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                    Reasoning Recorded Concept Classes - {studentGrade}
                  </h3>
                </div>

                <div className="p-3 bg-[#e0f2fe] rounded-xl border border-[#bae6fd] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-sky-950 flex items-center gap-1.5 text-xs">
                    <span>📖</span> Recorded Classes
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• Recorded classes covering the entire syllabus (chapter-wise)</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Previous Year Papers&apos; Questions discussion and Doubt Solving</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Total 20 recorded classes (full sessions) available for revision</p>
                </div>

                <div className="p-3 bg-[#f3e8ff] rounded-xl border border-[#e9d5ff] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-purple-950 flex items-center gap-1.5 text-xs">
                    <span>📝</span> Practice &amp; Tests
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Presentation Videos for practice and reinforcement</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Assignments given as homework for additional practice</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Quizzes for quick revision</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Reasoning Skill Development Package for mastering Logical Reasoning</p>
                </div>

                <div className="p-3 bg-[#dcfce7] rounded-xl border border-[#bbf7d0] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-emerald-950 flex items-center gap-1.5 text-xs">
                    <span>☑️</span> Intelligent Olympiad Test Generator
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• A bigger, &quot;Intelligent&quot; question bank</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Smart Question Selection</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Generate upto 10 personalised tests</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="bg-[#fef3c7] border border-[#fde68a] px-3 py-1.5 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-black text-amber-900 flex items-center gap-1">
                    <span>🏷️</span> Special Offer
                  </span>
                  <div className="space-x-1.5">
                    <span className="text-slate-400 line-through text-[11px]">2500.00</span>
                    <span className="text-slate-400">—</span>
                    <span className="font-black text-emerald-800 text-xs sm:text-sm">1999.00</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToCart({ id: 'pkg_rsdp', name: `Reasoning Concept Classes - ${studentGrade}`, price: 1999 })}
                  className="w-full py-2 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 rounded-xl text-xs font-black shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* 4. IMO */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 pb-1">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                    IMO Self-Paced Recorded Concept Classes - {studentGrade}
                  </h3>
                </div>

                <div className="p-3 bg-[#e0f2fe] rounded-xl border border-[#bae6fd] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-sky-950 flex items-center gap-1.5 text-xs">
                    <span>📖</span> Recorded Classes
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter wise Recorded classes covering the entire syllabus</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Level-1 Previous Year Papers 2024 &amp; 2025 discussion and Doubt Solving</p>
                </div>

                <div className="p-3 bg-[#f3e8ff] rounded-xl border border-[#e9d5ff] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-purple-950 flex items-center gap-1.5 text-xs">
                    <span>📝</span> Practice &amp; Tests
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Quizzes for quick revision</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Presentation Videos for practice and reinforcement</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Chapter-wise Assignments given for additional practice</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Level-1 Previous Year Papers 2024 &amp; 2025</p>
                </div>

                <div className="p-3 bg-[#dcfce7] rounded-xl border border-[#bbf7d0] space-y-1 text-xs text-slate-700">
                  <p className="font-black text-emerald-950 flex items-center gap-1.5 text-xs">
                    <span>☑️</span> Intelligent Olympiad Test Generator
                  </p>
                  <p className="text-[11px] text-slate-700 pl-4">• A bigger, &quot;Intelligent&quot; question bank</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Smart Question Selection</p>
                  <p className="text-[11px] text-slate-700 pl-4">• Generate upto 10 personalised tests</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="bg-[#fef3c7] border border-[#fde68a] px-3 py-1.5 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-black text-amber-900 flex items-center gap-1">
                    <span>🏷️</span> Special Offer
                  </span>
                  <div className="space-x-1.5">
                    <span className="text-slate-400 line-through text-[11px]">3500.00</span>
                    <span className="text-slate-400">—</span>
                    <span className="font-black text-emerald-800 text-xs sm:text-sm">2999.00</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToCart({ id: 'pkg_imo', name: `IMO Concept Classes - ${studentGrade}`, price: 2999 })}
                  className="w-full py-2 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 rounded-xl text-xs font-black shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Offer & Add to Cart Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs font-bold text-slate-700">
              Offers: <button type="button" onClick={() => handleAddToCart({ id: 'pkg_bundle', name: `All 3 Subjects Bundle - ${studentGrade}`, price: 4999 })} className="text-blue-600 hover:underline font-bold cursor-pointer">Save 10% on all 3 and 5% on Any 2</button>
            </span>
            <button
              type="button"
              onClick={() => handleAddToCart({ id: 'pkg_bundle', name: `Special Bundle - ${studentGrade}`, price: 4999 })}
              className="px-5 py-2 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <span>ADD TO CART</span>
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
