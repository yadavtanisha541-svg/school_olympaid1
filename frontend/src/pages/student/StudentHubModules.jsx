import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import {
  BookOpen,
  Laptop,
  Rocket,
  Calculator,
  Atom,
  Brain,
  Globe,
  Award,
  Trophy,
  Star,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  CreditCard,
  Wallet,
  ShoppingBag,
  Sparkles,
  Zap,
  HelpCircle,
  TrendingUp,
  BarChart3,
  Bookmark,
  Gamepad2,
  Send,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Check,
  AlertCircle,
  Users,
  MessageSquare,
  Compass,
  Calendar,
  Info,
  Medal,
  FileQuestion,
  Search,
  ThumbsUp
} from 'lucide-react';
import { OLYMPIAD_SUBJECT_METADATA } from '../../data/olympiadClassData';
import { getDynamicFaqsList } from '../../data/keyInfoMasterData';
import { OnlineClassesPage } from './OnlineClassesPage';
import { FreePreviousPapersModule } from './FreePreviousPapersModule';

export const StudentHubModules = ({ activeModule = 'my_classes', onNavigateTab, onStartExam }) => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [quizScore, setQuizScore] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  // Forum State
  const [forumPosts, setForumPosts] = useState([
    {
      id: 1,
      author: 'Rohan Verma (Class 4)',
      title: 'How to approach tricky sequence patterns in IMO Achievers section?',
      content: 'I often get confused when geometric pattern differences increase quadratically. Any shortcut tips?',
      likes: 12,
      replies: [
        { author: 'Faculty Mentor (OlympiadHub)', text: 'Look at the difference of differences! If 1st diff is arithmetic, the 2nd diff is constant.' }
      ],
      time: '2 hours ago'
    },
    {
      id: 2,
      author: 'Ananya Sen (Class 6)',
      title: 'Best strategy for NSO Science Experiments & HOTS questions',
      content: 'Should we memorize the chemical reactions or focus on conceptual observations from everyday life?',
      likes: 19,
      replies: [
        { author: 'Dr. S. Sharma (Senior Mentor)', text: 'Focus on application-based observations. NCERT/CBSE experiments are directly adapted into NSO HOTS.' }
      ],
      time: '5 hours ago'
    }
  ]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const post = {
      id: Date.now(),
      author: `${user?.name || 'Candidate'} (${user?.class || 'Class 1'})`,
      title: newPostTitle,
      content: newPostContent,
      likes: 0,
      replies: [],
      time: 'Just now'
    };
    setForumPosts([post, ...forumPosts]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  // Sample quick quiz questions for Fun Zone / Free Quizzes
  const quickQuizQuestions = [
    {
      q: 'Which geometric shape has 3 sides and the sum of its interior angles is always 180°?',
      options: ['Square', 'Triangle', 'Hexagon', 'Circle'],
      correct: 1,
      hint: 'Think of equilateral, isosceles, and scalene shapes.'
    },
    {
      q: 'Which planet is known as the "Red Planet" in our Solar System?',
      options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
      correct: 1,
      hint: 'Its reddish appearance is due to iron oxide on its surface.'
    },
    {
      q: 'Complete the pattern: 2, 6, 12, 20, 30, ___ ?',
      options: ['38', '40', '42', '44'],
      correct: 2,
      hint: 'Differences between consecutive terms are +4, +6, +8, +10, +12.'
    },
    {
      q: 'In English grammar, what is the superlative form of the adjective "GOOD"?',
      options: ['Gooder', 'Better', 'Best', 'Most Good'],
      correct: 2,
      hint: 'Good -> Better -> Best.'
    },
    {
      q: 'Which component is considered the "Brain" of a computer?',
      options: ['RAM', 'Hard Drive', 'CPU (Central Processing Unit)', 'Monitor'],
      correct: 2,
      hint: 'It performs all computational instructions and logical operations.'
    }
  ];

  const handleAnswerSelect = (optionIdx) => {
    setQuizAnswers({ ...quizAnswers, [activeQuizIndex]: optionIdx });
  };

  const handleFinishQuiz = () => {
    let score = 0;
    quickQuizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
  };

  // -----------------------------------------------------------------
  // 1. PROGRAMS SECTION (MSDP, SSDP, ESDP, RSDP, GK-SDP)
  // -----------------------------------------------------------------
  if (activeModule.startsWith('prog_')) {
    const pCode = activeModule.replace('prog_', '').toUpperCase();
    const programsData = {
      'MSDP': { title: 'Maths Skill Development Program (MSDP)', code: 'MSDP', subject: 'Mathematics', icon: Calculator, color: '#6d3a68', levels: ['Foundational Number Logic', 'Speed Arithmetic & Mental Maths', 'Spatial Geometry & Spatial Logic', 'Advanced Problem Solving'] },
      'SSDP': { title: 'Science Skill Development Program (SSDP)', code: 'SSDP', subject: 'Science', icon: Rocket, color: '#059669', levels: ['Observational Science & Nature', 'Experimental Methodology & Logic', 'Physical Systems & Forces', 'Environmental Ecology & Life Sciences'] },
      'ESDP': { title: 'English Skill Development Program (ESDP)', code: 'ESDP', subject: 'English', icon: BookOpen, color: '#d9775b', levels: ['Phonics & Orthography', 'Syntax & Grammatical Fluency', 'Lexical Depth & Vocabulary', 'Critical Reading & Comprehension'] },
      'RSDP': { title: 'Reasoning Skill Development Program (RSDP)', code: 'RSDP', subject: 'Logical Reasoning', icon: Brain, color: '#7c3aed', levels: ['Visual & Pattern Recognition', 'Deductive & Inductive Logic', 'Coding, Ciphers & Matrices', 'Analytical & Critical Thinking'] },
      'GKSDP': { title: 'General Knowledge Skill Development Program (GK-SDP)', code: 'GK-SDP', subject: 'General Knowledge', icon: Globe, color: '#e7b84b', levels: ['Global Geography & Heritage', 'Scientific Inventions & Breakthroughs', 'Current Affairs & Global Leaders', 'Sports, Awards & Civics'] }
    };

    const cur = programsData[pCode] || programsData['MSDP'];
    const Icon = cur.icon;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
              <Icon className="w-3.5 h-3.5 text-[#6d3a68]" />
              <span>Structured Skill Development Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">{cur.title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              4-Stage Structured Pathway for Class {user?.class || 'Class 1'} Mastery in {cur.subject}
            </p>
          </div>

          <button
            onClick={() => alert(`Enrolled in ${cur.code} Skill Certification!`)}
            className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#6d3a68] text-white hover:bg-[#5c3158] transition-all shadow-md cursor-pointer shrink-0"
          >
            Resume Program →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cur.levels.map((lvl, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed]">
                    Stage {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {idx === 0 ? 'In Progress (75%)' : idx === 1 ? 'Unlocked' : 'Upcoming'}
                  </span>
                </div>
                <h3 className="text-base font-black text-[#4e2a4a]">{lvl}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.
                </p>
              </div>

              <div className="pt-4 border-t border-[#f4ebf4] flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">120 XP • 2 Badges</span>
                <button
                  onClick={() => alert(`Starting Stage ${idx + 1}: ${lvl}`)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#6d3a68] text-white hover:bg-[#5c3158] transition-colors cursor-pointer"
                >
                  Start Stage →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }



  // -----------------------------------------------------------------
  // 3. STUDENT COMMUNITY FORUM
  // -----------------------------------------------------------------
  if (activeModule === 'forum') {
    return (
      <div className="space-y-6">
        <div className="pb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-[#6d3a68]" />
            <span>Peer Learning &amp; Faculty Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">Student Discussion Forum &amp; Q&amp;A</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Ask Olympiad doubts, discuss tricky sample questions, and get verified answers from expert faculty.
          </p>
        </div>

        {/* Post Question Form */}
        <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#4e2a4a] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#6d3a68]" />
            <span>Ask a Doubt / Start a Discussion</span>
          </h3>

          <form onSubmit={handlePostSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Question Topic or Title (e.g. How to solve IMO Section 2 Algebra?)"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
            />
            <textarea
              rows={3}
              placeholder="Describe your doubt or share the problem statement..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-medium text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#6d3a68] hover:bg-[#5c3158] transition-colors cursor-pointer shadow-sm"
              >
                Post to Forum 🚀
              </button>
            </div>
          </form>
        </div>

        {/* Forum Feed */}
        <div className="space-y-4">
          {forumPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-black text-[11px]">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#4e2a4a]">{post.author}</p>
                    <p className="text-[10px] text-slate-400">{post.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const updated = forumPosts.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p);
                    setForumPosts(updated);
                  }}
                  className="px-3 py-1 rounded-full text-xs font-bold text-[#6d3a68] bg-[#faf5fa] hover:bg-[#f4ebf4] border border-[#edd6ed] flex items-center gap-1 cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#d9775b]" />
                  <span>{post.likes} Helpful</span>
                </button>
              </div>

              <h4 className="text-sm font-black text-[#4e2a4a]">{post.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>

              {post.replies.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#f4ebf4] space-y-2">
                  {post.replies.map((rep, rIdx) => (
                    <div key={rIdx} className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs space-y-1">
                      <span className="font-black text-[#6d3a68] text-[11px] block">{rep.author}</span>
                      <p className="text-slate-700">{rep.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 4. INFO SECTION (FAQ, Date Sheet, Awards, ICSO, NSO, IMO, IEO)
  // -----------------------------------------------------------------
  if (activeModule.startsWith('info_')) {
    const infoType = activeModule.replace('info_', '');

    if (infoType === 'faq') {
      const faqsList = getDynamicFaqsList();
      return (
        <div className="space-y-6">
          <div className="pb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5 text-[#6d3a68]" />
              <span>Help &amp; Guidelines</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">Student FAQs &amp; Key Instructions</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Important questions regarding exam portal login, webcam requirements, timing rules and results.
            </p>
          </div>

          <div className="space-y-3">
            {faqsList.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-sm space-y-2">
                <h4 className="text-xs font-black text-[#4e2a4a] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#6d3a68] shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (infoType === 'datesheet') {
      return (
        <div className="space-y-6">
          <div className="pb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#6d3a68]" />
              <span>Exam Calendar 2026-27</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">Official Olympiad Examination Date Sheet (2026-27)</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Level 1 online examination slots, Level 2 Grand Finale dates, and result publication calendar.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf5fa] text-[#6d3a68] border-b border-[#edd6ed] uppercase text-[11px] font-black">
                  <th className="py-3.5 px-4 rounded-l-xl">Olympiad Discipline</th>
                  <th className="py-3.5 px-4">Level 1 Exam Slot</th>
                  <th className="py-3.5 px-4">Level 2 Finale Slot</th>
                  <th className="py-3.5 px-4 text-center rounded-r-xl">Last Date of Reg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4ebf4]">
                {Object.values(OLYMPIAD_SUBJECT_METADATA).map((sub, idx) => (
                  <tr key={idx} className="hover:bg-[#fff9f2]">
                    <td className="py-3 px-4 font-black text-[#4e2a4a]">{sub.fullName} ({sub.code})</td>
                    <td className="py-3 px-4 text-slate-700">{sub.examDates2026_2027?.level1Dates}</td>
                    <td className="py-3 px-4 font-bold text-[#d9775b]">{sub.examDates2026_2027?.level2Dates}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{sub.examDates2026_2027?.lastDateReg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (infoType === 'awards') {
      return (
        <div className="space-y-6">
          <div className="pb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-[#e7b84b]" />
              <span>Recognition &amp; Scholarships</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">Awards, Medals &amp; Scholarships Scheme</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Celebrating national and international brilliance with ₹50,000 cash scholarships, gold medals, and trophies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-3 text-center">
              <div className="w-14 h-14 rounded-full bg-[#faf4e0] text-[#e7b84b] flex items-center justify-center mx-auto shadow-sm">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-[#4e2a4a]">International Rank 1</h3>
              <p className="text-xs text-[#d9775b] font-bold">₹50,000 Cash + Gold Medal + Grand Trophy</p>
              <p className="text-[11px] text-slate-500">Awarded to top scorer in each grade cohort internationally.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-3 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto shadow-sm">
                <Medal className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-[#4e2a4a]">Zonal Rank 1 to 3</h3>
              <p className="text-xs text-[#6d3a68] font-bold">Silver/Bronze Medals + Excellence Certificate</p>
              <p className="text-[11px] text-slate-500">Awarded to top 3 rankers in each educational state/zone.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-3 text-center">
              <div className="w-14 h-14 rounded-full bg-purple-100 text-[#7c3aed] flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-[#4e2a4a]">School Class Topper</h3>
              <p className="text-xs text-purple-700 font-bold">Gold Medal of Distinction</p>
              <p className="text-[11px] text-slate-500">Awarded to top student in each section/school (min 10 candidates).</p>
            </div>
          </div>
        </div>
      );
    }

    // Default: Subject Specific Info (ICSO, NSO, IMO, IEO)
    const subKey = infoType.toLowerCase();
    const meta = OLYMPIAD_SUBJECT_METADATA[subKey] || OLYMPIAD_SUBJECT_METADATA.math;

    return (
      <div className="space-y-6">
        <div className="pb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
            <Info className="w-3.5 h-3.5 text-[#6d3a68]" />
            <span>Official Discipline Information</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">{meta.fullName} ({meta.code})</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 italic">"{meta.quote}"</p>
          <p className="text-xs text-slate-400 mt-1">{meta.tagline}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#4e2a4a]">Key Information &amp; Exam Structure</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed]">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Level 1 Exam Dates</span>
              <span className="font-bold text-[#4e2a4a] text-xs">{meta.examDates2026_2027?.level1Dates}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed]">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Level 2 Finale Dates</span>
              <span className="font-bold text-[#d9775b] text-xs">{meta.examDates2026_2027?.level2Dates}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed]">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Eligibility</span>
              <span className="font-bold text-[#4e2a4a] text-xs">All Grades (Nursery to Class 12)</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed]">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Standard Examination Fee</span>
              <span className="font-bold text-[#4e2a4a] text-xs">{meta.examDates2026_2027?.feeIndia}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 5. MY CONTENT (Subject specific: ICSO, ISO, IMO, IEO, IGKO, ISSO)
  // -----------------------------------------------------------------
  if (activeModule.startsWith('content_')) {
    const code = activeModule.replace('content_', '').toUpperCase();
    const subjectMap = {
      'ICSO': { title: 'International Cyber & AI Olympiad (ICSO)', code: 'ICSO', icon: Laptop, color: '#0284c7', chapters: ['Hardware & Peripherals', 'Operating Systems', 'Algorithms & Logic', 'MS Office & Tools', 'Cyber Safety & AI Basics', 'HOTS Coding Concepts'] },
      'ISO': { title: 'National / International Science Olympiad (ISO/NSO)', code: 'ISO', icon: Rocket, color: '#059669', chapters: ['Living & Non-Living World', 'Human Body & Health', 'Matter & Materials', 'Force, Work & Energy', 'Our Environment', 'Scientific HOTS Section'] },
      'IMO': { title: 'International Mathematics Olympiad (IMO)', code: 'IMO', icon: Calculator, color: '#6d3a68', chapters: ['Number Sense & Numeration', 'Arithmetic Operations', 'Fractions & Decimals', 'Geometry & Shapes', 'Data Handling & Graphs', 'Achievers Mathematical HOTS'] },
      'IEO': { title: 'International English Olympiad (IEO)', code: 'IEO', icon: BookOpen, color: '#d9775b', chapters: ['Nouns, Pronouns & Verbs', 'Tenses & Prepositions', 'Vocabulary & Synonyms', 'Reading Comprehension', 'Spoken & Written Expressions', 'Achievers Verbal HOTS'] },
      'IGKO': { title: 'International General Knowledge Olympiad (IGKO)', code: 'IGKO', icon: Globe, color: '#e7b84b', chapters: ['Our Surroundings & Flora/Fauna', 'India and the World', 'Science & Technology', 'Sports & Awards', 'Current Affairs & Civics', 'Life Skills & Quantitative Aptitude'] },
      'ISSO': { title: 'International Social Studies & Reasoning Olympiad (ISSO/IRO)', code: 'ISSO', icon: Brain, color: '#7c3aed', chapters: ['Patterns & Sequences', 'Analogy & Classification', 'Coding-Decoding', 'Blood Relations & Direction', 'Spatial & Embedded Figures', 'Logical Reasoning HOTS'] }
    };

    const cur = subjectMap[code] || subjectMap['IMO'];
    const Icon = cur.icon;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
              <Icon className="w-3.5 h-3.5 text-[#6d3a68]" />
              <span>Enrolled Subject Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">{cur.title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Class {user?.class || 'Class 1'} Comprehensive Study Notes, Practice Tests &amp; Achievers Question Bank
            </p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('available_exams')}
            className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#6d3a68] text-white hover:bg-[#5c3158] transition-all shadow-md cursor-pointer shrink-0"
          >
            Take Live Test →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-4">
            <h3 className="text-base font-black text-[#4e2a4a] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#6d3a68]" />
              <span>Chapter-wise Curriculum &amp; Practice Modules</span>
            </h3>

            <div className="space-y-3">
              {cur.chapters.map((ch, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] flex items-center justify-between gap-4 hover:border-[#6d3a68] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white text-[#6d3a68] font-black text-xs flex items-center justify-center border border-[#edd6ed] shadow-2xs">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#4e2a4a]">{ch}</p>
                      <p className="text-[10px] text-slate-400">15 Practice Questions • 2 Diagnostic Sets</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Opening interactive practice module for ${ch}`)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white text-[#6d3a68] border border-[#edd6ed] hover:bg-[#6d3a68] hover:text-white transition-colors cursor-pointer"
                  >
                    Practice →
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-3">
              <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider">Subject Quick Stats</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-[#faf5fa]">
                  <span className="text-slate-500">Completed Topics:</span>
                  <span className="font-bold text-[#6d3a68]">4 / 6</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-[#faf5fa]">
                  <span className="text-slate-500">Practice Accuracy:</span>
                  <span className="font-bold text-emerald-600">88.5%</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-[#faf5fa]">
                  <span className="text-slate-500">Mock Tests Taken:</span>
                  <span className="font-bold text-[#d9775b]">3 Tests</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#faf4e0] to-[#fff9f2] rounded-3xl p-6 border border-[#e7b84b]/40 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d9775b]" />
                <h4 className="text-xs font-black text-[#4e2a4a]">HOTS Achievers Section</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Higher Order Thinking Skills (HOTS) questions carry 2x marks and act as key tie-breaker criteria in national rankings.
              </p>
              <button
                onClick={() => onNavigateTab && onNavigateTab('available_exams')}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#6d3a68] hover:bg-[#5c3158] transition-colors cursor-pointer shadow-xs"
              >
                Attempt HOTS Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 6. MY CLASSES (ONLINE CONCEPT CLASSES & FACULTY)
  // -----------------------------------------------------------------
  if (activeModule === 'my_classes') {
    return <OnlineClassesPage onNavigateTab={onNavigateTab} />;
  }

  // -----------------------------------------------------------------
  // 7. MY REVISION & BOOKMARKS (DYNAMICALLY SYNCED WITH SUPER ADMIN)
  // -----------------------------------------------------------------
  if (activeModule === 'my_revision') {
    return <StudentRevisionVaultModule user={user} onNavigateTab={onNavigateTab} />;
  }

  // -----------------------------------------------------------------
  // 8. MY ORDERS & WORKBOOKS
  // -----------------------------------------------------------------
  if (activeModule === 'my_orders') {
    return (
      <div className="space-y-6">
        <div className="pb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
            <ShoppingBag className="w-3.5 h-3.5 text-[#6d3a68]" />
            <span>Purchases &amp; Registrations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">My Workbook Orders &amp; Test Packs</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track workbook shipments, digital study kits, and examination registration receipts.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf5fa] text-[#6d3a68] border-b border-[#edd6ed] uppercase text-[11px] font-black tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Order ID</th>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Amount</th>
                  <th className="py-3 px-4 text-center rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4ebf4]">
                <tr className="hover:bg-[#fff9f2]">
                  <td className="py-3 px-4 font-mono font-bold text-[#6d3a68]">#ORD-9482</td>
                  <td className="py-3 px-4 font-bold text-[#4e2a4a]">Class 1 Comprehensive Olympiad Workbook Set (Math + Science + English)</td>
                  <td className="py-3 px-4 text-slate-500">28 Sep 2026</td>
                  <td className="py-3 px-4 text-center font-bold text-[#4e2a4a]">₹750</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Dispatched / Track
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[#fff9f2]">
                  <td className="py-3 px-4 font-mono font-bold text-[#6d3a68]">#REG-3109</td>
                  <td className="py-3 px-4 font-bold text-[#4e2a4a]">Mathematics Olympiad (IMO) 2026-27 Registration &amp; 2 Online Mocks</td>
                  <td className="py-3 px-4 text-slate-500">15 Sep 2026</td>
                  <td className="py-3 px-4 text-center font-bold text-[#4e2a4a]">₹250</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300">
                      Confirmed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 9. MY WALLET & CREDITS
  // -----------------------------------------------------------------
  if (activeModule === 'my_wallet') {
    return (
      <div className="space-y-6">
        <div className="pb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
            <Wallet className="w-3.5 h-3.5 text-[#6d3a68]" />
            <span>Credits &amp; Rewards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">My Olympiad Wallet &amp; Test Credits</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Redeem points, top up mock test balance, and view examination transaction history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Wallet Balance</span>
            <p className="text-3xl font-black text-[#4e2a4a]">₹350</p>
            <p className="text-[11px] text-emerald-600 font-semibold">● Ready for exam registration or mock tests</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reward Scholar Coins</span>
            <p className="text-3xl font-black text-[#e7b84b]">1,250</p>
            <p className="text-[11px] text-[#8c4e8b] font-semibold">★ Earned by attempting quizzes &amp; mock tests</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Test Tokens</span>
            <p className="text-3xl font-black text-[#6d3a68]">4 Mocks</p>
            <p className="text-[11px] text-slate-500 font-semibold">Valid through Academic Session 2026-27</p>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 10. FREE ZONE & SAMPLE PAPERS / PAST PAPERS (Complete 4-Step Interactive Workflow)
  // -----------------------------------------------------------------
  if (activeModule === 'free_sample_papers' || activeModule === 'free_past_papers') {
    return (
      <FreePreviousPapersModule
        mode={activeModule === 'free_sample_papers' ? 'sample_paper' : 'previous_year'}
        onNavigateTab={onNavigateTab}
        onStartExam={onStartExam}
      />
    );
  }

  // -----------------------------------------------------------------
  // 11. FREE QUIZZES & FUN-ZONE (Interactive dynamic quiz runner from MySQL)
  // -----------------------------------------------------------------
  return (
    <StudentFreeQuizzesModule
      activeModule={activeModule}
      user={user}
      onNavigateTab={onNavigateTab}
    />
  );
};

// =========================================================================
// DYNAMIC STUDENT REVISION VAULT & QUESTION BOOKMARKS MODULE
// =========================================================================
const StudentRevisionVaultModule = ({ user, onNavigateTab }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userAnswers, setUserAnswers] = useState({});

  const userClass = user?.class_name || user?.class || 'Class 1';

  const fetchRevisionVault = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/revision-vault', {
        class: userClass,
        subject: selectedSubject !== 'All' ? selectedSubject : '',
        search: searchQuery
      });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setItems(res.data);
      } else {
        // If no class-specific match, fetch all available
        const allRes = await apiClient.get('/revision-vault', {
          subject: selectedSubject !== 'All' ? selectedSubject : '',
          search: searchQuery
        });
        if (allRes.success && Array.isArray(allRes.data)) {
          setItems(allRes.data);
        } else {
          setItems([]);
        }
      }
    } catch (e) {
      console.warn('Error loading revision vault:', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisionVault();

    const handleVaultSync = () => {
      fetchRevisionVault();
    };

    window.addEventListener('revision-vault-updated', handleVaultSync);
    window.addEventListener('storage', handleVaultSync);
    return () => {
      window.removeEventListener('revision-vault-updated', handleVaultSync);
      window.removeEventListener('storage', handleVaultSync);
    };
  }, [userClass, selectedSubject]);

  const subjectFilters = [
    { label: 'All Subjects', value: 'All' },
    { label: 'Mathematics (IMO)', value: 'Mathematics' },
    { label: 'Science (NSO)', value: 'Science' },
    { label: 'English (IEO)', value: 'English' },
    { label: 'Cyber & AI (ICSO)', value: 'Cyber' },
    { label: 'GK (IGKO)', value: 'General Knowledge' },
    { label: 'Reasoning (ISSO)', value: 'Reasoning' }
  ];

  const handleSelectOption = (questionId, optLetter) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optLetter
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header on Page Background (No dark box) */}
      <div className="pb-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
          <Bookmark className="w-3.5 h-3.5 text-[#6d3a68]" />
          <span>Curated Revision &amp; AI Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">
          My Revision Vault &amp; Question Bookmarks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Review tricky questions, bookmarked concepts, and faculty-curated solutions for your class.
        </p>
      </div>

      {/* Subject Filter Pills & Search */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#edd6ed] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {subjectFilters.map((sub) => (
            <button
              key={sub.value}
              type="button"
              onClick={() => setSelectedSubject(sub.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubject === sub.value
                  ? 'bg-[#6d3a68] text-white shadow-xs'
                  : 'bg-[#faf5fa] text-[#6d3a68] hover:bg-[#f4ebf4] border border-[#edd6ed]'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-[#6d3a68] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchRevisionVault(); }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#edd6ed] text-xs font-medium text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68] bg-[#faf5fa] placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Main Revision Cards List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#f4ebf4]">
          <h3 className="text-sm font-black text-[#4e2a4a] flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#d9775b]" />
            <span>Bookmarked Tricky Questions ({items.length} Saved)</span>
          </h3>
          <span className="text-xs font-bold text-[#6d3a68] bg-[#faf5fa] px-3 py-1 rounded-full border border-[#edd6ed]">
            {userClass} Revision
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-7 h-7 border-3 border-[#6d3a68] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading your revision vault...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No revision questions available for this subject</p>
            <p className="text-[11px] text-slate-400">Select another subject tab or check back later!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => {
              const opts = Array.isArray(item.options) && item.options.length >= 2
                ? item.options
                : [item.option_a || 'Option A', item.option_b || 'Option B', item.option_c || 'Option C', item.option_d || 'Option D'];
              const corrOpt = (item.correct_option || 'A').toUpperCase();
              const userPick = userAnswers[item.id || idx];

              return (
                <div
                  key={item.id || idx}
                  className="p-5 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] space-y-3 hover:border-[#6d3a68]/40 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between text-[11px] flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#6d3a68]">{item.subject}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#edd6ed] text-[10px] font-bold text-slate-600">
                        {item.class_name || item.class || userClass}
                      </span>
                      {item.tags && (
                        <span className="px-2 py-0.5 rounded-md bg-pink-50 border border-pink-200 text-[10px] font-bold text-pink-700">
                          {item.tags}
                        </span>
                      )}
                      {item.difficulty && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-[10px] font-bold text-purple-700">
                          {item.difficulty}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 font-semibold">Question #{idx + 1}</span>
                  </div>

                  <p className="text-sm font-bold text-[#4e2a4a] leading-relaxed">
                    {item.question_text || item.title}
                  </p>

                  {/* 4 Interactive Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {['A', 'B', 'C', 'D'].map((letter, optIdx) => {
                      const text = opts[optIdx] || item[`option_${letter.toLowerCase()}`] || `Option ${letter}`;
                      const isCorrect = corrOpt === letter;
                      const isSelected = userPick === letter;

                      let optStyle = 'bg-white border-slate-200 text-slate-700 hover:border-[#6d3a68]/50';
                      if (isSelected) {
                        if (isCorrect) {
                          optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400/30';
                        } else {
                          optStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
                        }
                      } else if (userPick && isCorrect) {
                        optStyle = 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold';
                      }

                      return (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => handleSelectOption(item.id || idx, letter)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all text-left cursor-pointer ${optStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                                isSelected && isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : isSelected && !isCorrect
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {letter}
                            </span>
                            <span className="font-semibold">{text}</span>
                          </div>
                          {isSelected && isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Correct!
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="text-[10px] font-bold text-rose-600">
                              Your Pick
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Solution Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 font-semibold space-y-1 mt-1">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-black text-emerald-900">Correct Answer:</span>
                      <span className="font-bold">{item.correct_answer || `Option ${corrOpt}`}</span>
                    </div>
                    {item.explanation && (
                      <p className="text-[11px] text-emerald-800 font-normal leading-relaxed pt-0.5">
                        <strong className="font-bold">Explanation / Solution:</strong> {item.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// DYNAMIC STUDENT FREE QUIZZES & FUN-ZONE RUNNER MODULE (SAVED IN MYSQL)
// =========================================================================
const StudentFreeQuizzesModule = ({ activeModule, user, onNavigateTab }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 mins

  const userClass = user?.class_name || user?.class || 'Class 1';

  // Default fallback questions if database is empty
  const fallbackQuestions = [
    {
      id: 1,
      subject: 'Mathematics',
      question_text: 'Which geometric shape has 3 sides and interior angles adding up to 180°?',
      options: ['Square', 'Triangle', 'Hexagon', 'Circle'],
      correct_option: 1,
      hint: 'Think of equilateral, isosceles, and scalene shapes.',
      explanation: 'A triangle is a 3-sided polygon whose interior angles always sum to 180°.',
      difficulty: 'Easy',
      points: 50
    },
    {
      id: 2,
      subject: 'Science',
      question_text: 'Which planet in our solar system is widely known as the "Red Planet"?',
      options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
      correct_option: 1,
      hint: 'Its reddish appearance is due to iron oxide on its surface.',
      explanation: 'Mars is known as the Red Planet because iron minerals in its Martian soil oxidize (rust).',
      difficulty: 'Easy',
      points: 50
    },
    {
      id: 3,
      subject: 'Reasoning',
      question_text: 'Complete the pattern series: 2, 6, 12, 20, 30, ___ ?',
      options: ['38', '40', '42', '44'],
      correct_option: 2,
      hint: 'Differences between consecutive terms are +4, +6, +8, +10, +12.',
      explanation: 'Differences are successive even numbers: 2+4=6, 6+6=12, 12+8=20, 20+10=30, 30+12=42.',
      difficulty: 'Medium',
      points: 75
    },
    {
      id: 4,
      subject: 'English',
      question_text: 'What is the correct superlative degree of the adjective "GOOD"?',
      options: ['Gooder', 'Better', 'Best', 'Most Good'],
      correct_option: 2,
      hint: 'Good -> Better -> Best.',
      explanation: 'The degrees of comparison for "good" are good (positive), better (comparative), best (superlative).',
      difficulty: 'Easy',
      points: 50
    },
    {
      id: 5,
      subject: 'Cyber',
      question_text: 'Which hardware component is considered the primary "Brain" of a computer?',
      options: ['RAM', 'Hard Drive', 'CPU (Central Processing Unit)', 'Monitor'],
      correct_option: 2,
      hint: 'It executes program instructions and performs all logical and arithmetic operations.',
      explanation: 'The Central Processing Unit (CPU) interprets and carries out instructions from computer hardware and software.',
      difficulty: 'Easy',
      points: 50
    }
  ];

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/free-quizzes', {
        class: userClass,
        subject: selectedSubject !== 'All' ? selectedSubject : '',
        status: 'active'
      });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setQuestions(res.data);
      } else {
        // Fallback filter
        const filtered = selectedSubject === 'All' 
          ? fallbackQuestions 
          : fallbackQuestions.filter(q => q.subject.toLowerCase() === selectedSubject.toLowerCase());
        setQuestions(filtered.length > 0 ? filtered : fallbackQuestions);
      }
    } catch (e) {
      console.warn('Error fetching free quizzes:', e);
      setQuestions(fallbackQuestions);
    } finally {
      setLoading(false);
      setActiveIdx(0);
      setAnswers({});
      setShowHint(false);
      setIsSubmitted(false);
      setScore(0);
      setTimeRemaining(300);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [userClass, selectedSubject]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || loading || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, loading, questions]);

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [activeIdx]: optIdx });
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    questions.forEach((q, idx) => {
      const studentAns = answers[idx];
      const correctAns = parseInt(q.correct_option ?? q.correct ?? 0, 10);
      if (studentAns === correctAns) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  const handleRestart = () => {
    setActiveIdx(0);
    setAnswers({});
    setShowHint(false);
    setIsSubmitted(false);
    setScore(0);
    setTimeRemaining(300);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const subjectTabs = [
    { label: 'All Subjects', value: 'All' },
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Science', value: 'Science' },
    { label: 'English', value: 'English' },
    { label: 'Cyber & AI', value: 'Cyber' },
    { label: 'General Knowledge', value: 'General Knowledge' },
    { label: 'Reasoning', value: 'Reasoning' }
  ];

  const currentQ = questions[activeIdx];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQ > 0 ? ((activeIdx + 1) / totalQ) * 100 : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header on Page Background (No dark box) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
            <Gamepad2 className="w-3.5 h-3.5 text-[#6d3a68]" />
            <span>Daily Speed Challenge • {userClass}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">
            {activeModule === 'free_quizzes' ? 'FREE 5-Minute Daily Quizzes' : 'Fun-Zone & Olympiad Riddles'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Solve instant interactive questions, test speed logic, and earn Scholar XP badges!
          </p>
        </div>

        {!isSubmitted && (
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="bg-white border border-[#edd6ed] rounded-2xl px-4 py-2.5 text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#6d3a68] block">Time Left</span>
              <span className="text-lg sm:text-xl font-mono font-black text-[#4e2a4a] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#d9775b]" />
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Subject Filter Tabs */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#edd6ed] shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-xs font-black text-[#6d3a68] uppercase tracking-wider mr-1">Select Quiz:</span>
        {subjectTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setSelectedSubject(tab.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSubject === tab.value
                ? 'bg-[#6d3a68] text-white shadow-xs'
                : 'bg-[#faf5fa] text-slate-700 hover:bg-[#f4eaf4] border border-[#edd6ed]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-[#edd6ed] shadow-sm text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#6d3a68] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading quiz questions for {selectedSubject}...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#edd6ed] shadow-sm text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No active quiz questions found for {selectedSubject}</h3>
          <p className="text-xs text-slate-400">Please choose another subject or check back later.</p>
          <button
            onClick={() => setSelectedSubject('All')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#6d3a68] text-white cursor-pointer"
          >
            View All Quizzes
          </button>
        </div>
      ) : !isSubmitted ? (
        /* Active Quiz Runner */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-6">
          {/* Progress & Header */}
          <div>
            <div className="flex items-center justify-between text-xs pb-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-[#6d3a68] uppercase tracking-wider">
                  Question {activeIdx + 1} of {totalQ}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed]">
                  {currentQ?.subject || selectedSubject}
                </span>
                {currentQ?.difficulty && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentQ.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    currentQ.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {currentQ.difficulty}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                ⚡ +{currentQ?.points || 50} Scholar XP
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#f4ebf4] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#d9775b] to-[#6d3a68] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base sm:text-lg font-black text-[#4e2a4a] leading-relaxed">
              {currentQ?.question_text || currentQ?.q}
            </h3>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(currentQ?.options || []).map((opt, optIdx) => {
                const isSelected = answers[activeIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-4 rounded-2xl text-left text-xs font-bold transition-all border cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#6d3a68] text-white border-[#6d3a68] shadow-sm ring-2 ring-[#6d3a68]/20'
                        : 'bg-[#faf5fa] text-[#4e2a4a] border-[#edd6ed] hover:bg-[#f4ebf4] hover:border-[#6d3a68]/40'
                    }`}
                  >
                    <span className="leading-snug">{opt}</span>
                    <span className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black ${
                      isSelected ? 'bg-[#e7b84b] text-[#321630]' : 'border border-slate-300 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hint Section */}
            {currentQ?.hint && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{showHint ? 'Hide Hint' : '💡 Need a hint?'}</span>
                </button>
                {showHint && (
                  <p className="mt-1.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed animate-in fade-in">
                    {currentQ.hint}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation & Submit Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#f4ebf4]">
            <button
              type="button"
              onClick={() => {
                setActiveIdx(Math.max(0, activeIdx - 1));
                setShowHint(false);
              }}
              disabled={activeIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-[#faf5fa] hover:bg-[#f4ebf4] disabled:opacity-40 cursor-pointer border border-[#edd6ed]"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
              {activeIdx < totalQ - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveIdx(activeIdx + 1);
                    setShowHint(false);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#6d3a68] hover:bg-[#5c3158] transition-colors cursor-pointer shadow-sm"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-[#321630] bg-[#e7b84b] hover:bg-[#deb145] transition-colors cursor-pointer shadow-md"
                >
                  Submit Quiz ({answeredCount}/{totalQ} Answered) ✨
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Results & Detailed Solutions Review */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#faf4e0] text-[#e7b84b] mx-auto flex items-center justify-center shadow-sm border border-[#e7b84b]/30">
              <Trophy className="w-8 h-8 text-[#e7b84b]" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a]">Quiz Completed!</h2>
            
            <div className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Score</p>
              <p className="text-3xl font-black text-[#6d3a68]">
                {score} / {totalQ}
              </p>
              <p className="text-xs font-bold text-emerald-600">
                Accuracy: {totalQ > 0 ? Math.round((score / totalQ) * 100) : 0}% • +{score * 50} Scholar XP Earned
              </p>
            </div>

            <p className="text-xs text-slate-500">
              {score === totalQ
                ? '🌟 Perfect Score! You unlocked the Master Thinker Gold Badge!'
                : score >= Math.ceil(totalQ * 0.7)
                ? 'Great job! You showed strong conceptual grasp. Keep practicing!'
                : 'Good effort! Review the detailed solutions below to master these concepts.'}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#6d3a68] hover:bg-[#5c3158] transition-colors cursor-pointer shadow-sm"
              >
                Retake Quiz 🔄
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSubject('All');
                  handleRestart();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#4e2a4a] bg-[#faf5fa] hover:bg-[#f4ebf4] border border-[#edd6ed] cursor-pointer"
              >
                Try Another Subject
              </button>
            </div>
          </div>

          {/* Detailed Question by Question Review */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#4e2a4a] pb-2 border-b border-[#f4ebf4] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Detailed Question Review &amp; Explanations</span>
            </h3>

            <div className="space-y-4">
              {questions.map((q, qIdx) => {
                const studentAns = answers[qIdx];
                const correctAns = parseInt(q.correct_option ?? q.correct ?? 0, 10);
                const isCorrect = studentAns === correctAns;
                const isSkipped = studentAns === undefined;

                return (
                  <div
                    key={q.id || qIdx}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                      isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isSkipped
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-[#6d3a68]">Question #{qIdx + 1} • {q.subject}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isSkipped
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {isCorrect ? '✓ Correct' : isSkipped ? '○ Skipped' : '✗ Incorrect'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-[#4e2a4a]">
                      {q.question_text || q.q}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {(q.options || []).map((opt, optIdx) => {
                        const isThisCorrect = optIdx === correctAns;
                        const isThisStudentAns = optIdx === studentAns;

                        let optClass = 'bg-white text-slate-700 border-slate-200';
                        if (isThisCorrect) {
                          optClass = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                        } else if (isThisStudentAns && !isCorrect) {
                          optClass = 'bg-rose-100 text-rose-900 border-rose-400 font-bold';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${optClass}`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isThisCorrect && <span className="text-emerald-700 font-black text-[10px]">✓ Correct</span>}
                            {isThisStudentAns && !isThisCorrect && <span className="text-rose-700 font-black text-[10px]">✗ Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200 text-xs text-slate-700">
                        <span className="font-black text-[#6d3a68]">Explanation: </span>
                        <span>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


