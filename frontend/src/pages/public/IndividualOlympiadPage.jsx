import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Atom,
  BookOpen,
  Brain,
  Cpu,
  Sparkles,
  Globe,
  Palette,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  ArrowLeft,
  Clock,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  Check,
  Star,
  Users,
  Laptop
} from 'lucide-react';
import {
  ALL_CLASSES,
  OLYMPIAD_SUBJECT_METADATA,
  getClassSyllabus,
  getClassBenefits,
  getClassFAQs
} from '../../data/olympiadClassData';
import { apiClient } from '../../api/client';

export const IndividualOlympiadPage = ({
  olympiadId = 'english',
  initialClass = 'Nursery',
  onNavigatePublic,
  onOpenRegister
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(olympiadId || 'english');
  const [selectedClass, setSelectedClass] = useState(initialClass || 'Nursery');
  const [activeSection, setActiveSection] = useState('overview');
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [customContent, setCustomContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // Sync state when props change
  useEffect(() => {
    if (olympiadId) {
      const normalizedId = olympiadId === 'math' ? 'math' :
                           olympiadId === 'science' ? 'science' :
                           olympiadId === 'english' ? 'english' :
                           olympiadId === 'reasoning' ? 'reasoning' :
                           olympiadId === 'cyber' ? 'cyber' :
                           olympiadId === 'spell-bee' || olympiadId === 'vocab' ? 'vocab' :
                           olympiadId === 'environment' ? 'environment' :
                           olympiadId === 'gk' ? 'gk' :
                           olympiadId === 'arts' ? 'arts' : 'english';
      setSelectedSubjectId(normalizedId);
    }
  }, [olympiadId]);

  useEffect(() => {
    if (initialClass && ALL_CLASSES.includes(initialClass)) {
      setSelectedClass(initialClass);
    }
  }, [initialClass]);

  // Fetch dynamic custom content for selected subject & class from MySQL
  useEffect(() => {
    let isMounted = true;
    const fetchCustomContent = async () => {
      setLoadingContent(true);
      try {
        const res = await apiClient.get('/academic/subject-class-content', {
          subject_slug: selectedSubjectId,
          class_name: selectedClass
        });
        if (isMounted && res && res.success && res.data) {
          setCustomContent(res.data);
        } else if (isMounted) {
          setCustomContent(null);
        }
      } catch (err) {
        if (isMounted) setCustomContent(null);
      } finally {
        if (isMounted) setLoadingContent(false);
      }
    };

    fetchCustomContent();
    return () => { isMounted = false; };
  }, [selectedSubjectId, selectedClass]);

  const subject = OLYMPIAD_SUBJECT_METADATA[selectedSubjectId] || OLYMPIAD_SUBJECT_METADATA.english;

  // Merge static metadata with dynamic backend MySQL content if present
  const parseJsonSafe = (raw, fallback) => {
    if (!raw) return fallback;
    if (typeof raw === 'object') return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const displayQuote = customContent?.quote || subject.quote;
  const displayIntro = customContent?.intro_text || `Think about how empowering it will be for your child to excel in ${subject.shortName} right from early childhood days. SkillRise ${subject.fullName} for ${selectedClass} has been introduced to help your child develop strong conceptual skills by providing interactive picture-based and multiple-choice questions. The exciting rewards keep them motivated and make learning fun while laying solid foundations.`;
  
  const defaultSchedule = subject.examDates2026_2027;
  const customSchedule = parseJsonSafe(customContent?.dates_fees_json, null);
  const schedule = customSchedule ? { ...defaultSchedule, ...customSchedule } : defaultSchedule;

  const defaultSyllabus = getClassSyllabus(subject.id, selectedClass);
  const customSyllabus = parseJsonSafe(customContent?.syllabus_modules_json, null);
  const syllabusList = (Array.isArray(customSyllabus) && customSyllabus.length > 0) ? customSyllabus : defaultSyllabus;

  const defaultBenefits = getClassBenefits(subject.shortName, selectedClass);
  const customBenefits = parseJsonSafe(customContent?.benefits_json, null);
  const benefitsList = (Array.isArray(customBenefits) && customBenefits.length > 0) ? customBenefits : defaultBenefits;

  const defaultFaqs = getClassFAQs(subject.shortName, selectedClass) || [];
  const customFaqs = parseJsonSafe(customContent?.faqs_json, null) || customContent?.faqs;
  const faqsList = (Array.isArray(customFaqs) && customFaqs.length > 0) ? customFaqs : defaultFaqs;

  const customEligibility = parseJsonSafe(customContent?.eligibility_json, null) || customContent?.eligibility;
  const customAwards = parseJsonSafe(customContent?.awards_json, null) || customContent?.awards;
  const customHowToPrepare = customContent?.how_to_prepare_json || customContent?.how_to_prepare;
  const customHeadings = parseJsonSafe(customContent?.headings_json, null) || customContent?.headings || {};
  const pageMainHeading = customContent?.custom_title || `${subject.shortName} Olympiad for ${selectedClass}`;

  const ageRequirement = subject.ageMap[selectedClass] || 'School Age Equivalent';

  const navItems = [
    { id: 'overview', label: 'Olympiad Exams' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'how-to-apply', label: 'How to Apply' },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'dates-fee', label: 'Exam Dates and Fees' },
    { id: 'how-to-prepare', label: 'How to Prepare' },
    { id: 'cutoff-keys', label: 'Cut-off & Answer Keys' },
    { id: 'results', label: 'Results' },
    { id: 'awards', label: 'Awards and Recognition' },
    { id: 'faqs', label: 'Frequently Asked Questions' }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    if (id === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getIcon = (name) => {
    switch (name) {
      case 'Calculator': return Calculator;
      case 'Atom': return Atom;
      case 'BookOpen': return BookOpen;
      case 'Brain': return Brain;
      case 'Cpu': return Cpu;
      case 'Globe': return Globe;
      case 'Palette': return Palette;
      default: return Sparkles;
    }
  };

  const IconComp = getIcon(subject.iconName);

  return (
    <div className="min-h-screen bg-[#fff9f2] font-sans text-[#2a1b29] pb-24">
      {/* Top Subtle Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-[#8c4e8b]">
          <div className="flex items-center gap-1.5 font-medium">
            <button
              type="button"
              onClick={() => onNavigatePublic('home')}
              className="hover:text-[#4e2a4a] hover:underline cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => onNavigatePublic('olympiads')}
              className="hover:text-[#4e2a4a] hover:underline cursor-pointer"
            >
              Olympiads
            </button>
            <span>/</span>
            <span className="text-[#4e2a4a] font-bold">{subject.shortName}</span>
            <span>/</span>
            <span className="text-[#d9775b] font-black">{selectedClass}</span>
          </div>

          <button
            type="button"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white text-xs font-black shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <span>Enroll Student 2026-27</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-10">

        {/* =========================================================================
            MAIN 2-COLUMN LAYOUT (SEAMLESS ON BACKGROUND - NO BOXES)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Sidebar Navigation (Exact Match to Screenshot with horizontal lines) */}
          <aside className="lg:col-span-3 sticky top-24 space-y-2">
            <nav className="border-t border-[#0d9488]/40 divide-y divide-[#0d9488]/30">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left py-2.5 px-1 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'text-[#0d9488] font-black underline underline-offset-4'
                        : 'text-[#006666] hover:text-[#0d9488]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4">
              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full py-2 px-3 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-md text-xs font-black shadow-2xs transition-colors cursor-pointer text-center"
              >
                Register for {selectedClass} →
              </button>
            </div>
          </aside>

          {/* RIGHT COLUMN: Content directly on background (No card boxes) */}
          <main className="lg:col-span-9 space-y-12">

            {/* SECTION: HERO HEADER */}
            <div id="overview" className="space-y-4 pb-6 border-b border-[#edd6ed]/60">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-bold text-[#d9775b] italic">
                  "{displayQuote}"
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3a1d36] tracking-tight leading-snug">
                  {pageMainHeading}
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-[#554053] leading-relaxed whitespace-pre-line">
                {displayIntro}
              </p>

              <div className="text-xs font-bold text-[#0d9488]">
                <a
                  href="#dates-fee"
                  onClick={(e) => { e.preventDefault(); scrollToSection('dates-fee'); }}
                  className="hover:underline flex items-center gap-1"
                >
                  &gt;&gt; Check Official 2026-2027 Examination Dates &amp; Answer Key Schedule
                </a>
              </div>
            </div>

            {/* SECTION 1: ELIGIBILITY CRITERIA */}
            <section id="eligibility" className="space-y-3 pb-8 border-b border-[#edd6ed]/60">
              <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                {customHeadings.eligibility || `Eligibility Criteria for ${selectedClass} International ${subject.shortName} Olympiad`}
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-[#554053] leading-relaxed">
                {Array.isArray(customEligibility) && customEligibility.length > 0 ? (
                  customEligibility.map((item, idx) => (
                    <p key={idx}><strong>{String.fromCharCode(97 + idx)}.</strong> {item}</p>
                  ))
                ) : (
                  <>
                    <p><strong>a.</strong> Students intended for taking the <strong>{subject.fullName}</strong> test for {selectedClass} can do the registration either through their schools or on their own.</p>
                    <p><strong>b.</strong> Candidates from all around the world and from all recognized educational boards (CBSE, ICSE, Cambridge, IB, State Boards) are welcome to apply for the exam.</p>
                    <p><strong>c.</strong> The test for {selectedClass} is performed in <strong>2 levels</strong> (or single foundation tier).</p>
                    <p><strong>d.</strong> Participants qualifying the first level will be eligible to take part in the second level.</p>
                    <p><strong>e.</strong> Participants must meet the age requirement for {selectedClass} (typically <strong>{ageRequirement}</strong>).</p>
                  </>
                )}
              </div>
            </section>

            {/* SECTION 2: BENEFITS */}
            <section id="benefits" className="space-y-3 pb-8 border-b border-[#edd6ed]/60">
              <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                {customHeadings.benefits || `Benefits of ${subject.shortName} Olympiad for ${selectedClass}`}
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-[#554053] leading-relaxed">
                {benefitsList.map((benefit, idx) => (
                  <p key={idx}>
                    <strong>{idx + 1}.</strong> {benefit}
                  </p>
                ))}
              </div>
            </section>

            {/* SECTION 3: HOW TO REGISTER */}
            <section id="how-to-apply" className="space-y-4 pb-8 border-b border-[#edd6ed]/60">
              <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                {customHeadings.how_to_apply || `How to Register for ${selectedClass} ${subject.shortName} Olympiad?`}
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-[#554053] leading-relaxed">
                <p>
                  <strong>Option 1: School Registration</strong><br />
                  International {subject.shortName} Olympiad registration for {selectedClass} can be done by schools. The registration can be coordinated within working hours through the school exam coordinator.
                </p>

                <p>
                  <strong>Option 2: Direct Individual Student Registration</strong><br />
                  Students can also register separately from school &amp; want to appear for the {subject.shortName} Olympiad for {selectedClass} online test can follow these simple steps:
                </p>

                <div className="pl-2 space-y-1">
                  <p>1. Click here [ <button type="button" onClick={onOpenRegister} className="text-[#0d9488] font-bold underline cursor-pointer">Individual Student Registration</button> ]</p>
                  <p>2. The registration form opens up.</p>
                  <p>3. Fill in all the registration form details.</p>
                  <p>4. Select the subject(s) you wish to appear in.</p>
                  <p>5. Read the instructions carefully.</p>
                  <p>6. Make the payment.</p>
                  <p>7. Registration is complete.</p>
                </div>

                <div className="pt-2 text-[11px] text-slate-600 space-y-1">
                  <p><strong>Note:</strong></p>
                  <p>1. {subject.shortName} Olympiad individual registrations by students are accepted globally.</p>
                  <p>2. Students who have done direct registration will have to take exams from home. The individual participating should have a computer or laptop with a webcam and good internet facility.</p>
                </div>
              </div>
            </section>

            {/* SECTION 4: SYLLABUS */}
            <section id="syllabus" className="space-y-3 pb-8 border-b border-[#edd6ed]/60">
              <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                {customHeadings.syllabus || `${selectedClass} ${subject.shortName} Olympiad Syllabus`}
              </h2>
              <p className="text-xs sm:text-sm text-[#554053] leading-relaxed">
                A clear understanding of the syllabus plays a major role in Olympiad preparation. It becomes less stressful when students know what to focus on. After all, a well-planned preparation is already half the work done.
              </p>

              <div className="space-y-3 pt-2">
                {syllabusList.map((mod, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-[#3a1d36]">
                      • Module {idx + 1}: {mod.topic} ({mod.questions}+ Practice Questions)
                    </p>
                    <p className="text-xs text-[#6c568d] pl-3">
                      {mod.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigatePublic('sample-papers')}
                  className="text-xs font-bold text-[#0d9488] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Check Sample Papers &amp; Syllabus Blueprint for {selectedClass} →</span>
                </button>
              </div>
            </section>

            {/* SECTION 5: DATES AND FEE (2026-2027 Table - Exact Match to Screenshot) */}
            <section id="dates-fee" className="space-y-4 pb-8 border-b border-[#edd6ed]/60">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                  {customHeadings.dates_fee || `Dates and Fee for ${selectedClass} ${subject.shortName} Olympiad`}
                </h2>
                <p className="text-xs text-[#6c568d]">
                  The exam dates for SkillRise {subject.fullName} ({subject.code}) for the Academic year 2026-27 are given below:
                </p>
              </div>

              {/* Clean Schedule Table sitting directly on the background */}
              <div className="overflow-x-auto border-t border-b border-[#edd6ed]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <tbody className="divide-y divide-[#edd6ed]/70">
                    <tr className="hover:bg-[#faf5fa]/50">
                      <td className="py-3 pr-4 font-bold text-[#3a1d36] w-1/3">
                        Level 1 Exam Dates
                      </td>
                      <td className="py-3 pl-4 font-semibold text-[#0d9488]">
                        {schedule.level1Dates}
                      </td>
                    </tr>

                    <tr className="hover:bg-[#faf5fa]/50">
                      <td className="py-3 pr-4 font-bold text-[#3a1d36]">
                        Level 2 Exam Dates
                      </td>
                      <td className="py-3 pl-4 font-semibold text-[#3a1d36]">
                        {schedule.level2Dates}
                      </td>
                    </tr>

                    <tr className="hover:bg-[#faf5fa]/50">
                      <td className="py-3 pr-4 font-bold text-[#3a1d36]">
                        Last Date for Registration
                      </td>
                      <td className="py-3 pl-4 font-semibold text-[#d9775b]">
                        {schedule.lastDateReg}
                      </td>
                    </tr>

                    <tr className="hover:bg-[#faf5fa]/50">
                      <td className="py-3 pr-4 font-bold text-[#3a1d36]">
                        Level 1 Answer Key Dates
                      </td>
                      <td className="py-3 pl-4 text-[#554053]">
                        {schedule.level1AnswerKey}
                      </td>
                    </tr>

                    <tr className="hover:bg-[#faf5fa]/50">
                      <td className="py-3 pr-4 font-bold text-[#3a1d36]">
                        Level 2 Answer Key Dates
                      </td>
                      <td className="py-3 pl-4 text-[#554053]">
                        {schedule.level2AnswerKey}
                      </td>
                    </tr>

                    <tr className="hover:bg-[#faf5fa]/50">
                      <td className="py-3 pr-4 font-bold text-[#3a1d36]">
                        Level 1 Result Date
                      </td>
                      <td className="py-3 pl-4 text-[#554053]">
                        {schedule.level1Result}
                      </td>
                    </tr>

                    <tr className="hover:bg-[#faf5fa]/50">
                      <td className="py-3 pr-4 font-bold text-[#3a1d36]">
                        Level 2 Result Date
                      </td>
                      <td className="py-3 pl-4 text-[#554053]">
                        {schedule.level2Result}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Fee Note */}
              <div className="text-xs text-[#554053] space-y-1">
                <p><strong>Note:</strong> Check exam dates for other Olympiad subjects as well.</p>
                <p>The exam fee is <strong>{schedule.feeIndia}</strong>. For students studying and residing outside of India, the fee is <strong>{schedule.feeInternational}</strong>.</p>
              </div>
            </section>

            {/* SECTION 6: HOW TO PREPARE */}
            <section id="how-to-prepare" className="space-y-3 pb-8 border-b border-[#edd6ed]/60">
              <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                {customHeadings.prepare || `How to prepare for ${selectedClass} ${subject.shortName} Olympiad?`}
              </h2>
              <p className="text-xs sm:text-sm text-[#554053] leading-relaxed whitespace-pre-line">
                {typeof customHowToPrepare === 'string' && customHowToPrepare.trim()
                  ? customHowToPrepare
                  : `Practicing sample papers helps students understand the exam pattern and question types better. It improves confidence and accuracy over time. Regular practice also helps the students identify strengths and areas that need more attention. Check sample papers for ${subject.shortName} Olympiad now.`}
              </p>
            </section>

            {/* SECTION 7: CUT-OFF & ANSWER KEY */}
            <section id="cutoff-keys" className="space-y-3 pb-8 border-b border-[#edd6ed]/60">
              <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                {customHeadings.cutoff_keys || `Cut-off & Answer Key for ${selectedClass} ${subject.shortName} Olympiad`}
              </h2>
              <p className="text-xs sm:text-sm text-[#554053] leading-relaxed">
                Since the examination is parent/teacher assisted for foundation tiers and proctored for higher classes, an objective marking system is followed. Every candidate scoring above 60% in the final level examination is awarded a Star Medal and Merit Certificate. To maintain complete transparency, the answer key is released within the declaration of final results, and participants are given time to challenge if needed.
              </p>
            </section>

            {/* SECTION 8: RESULTS */}
            <section id="results" className="space-y-3 pb-8 border-b border-[#edd6ed]/60">
              <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                {customHeadings.results || `Results of ${selectedClass} ${subject.shortName} Olympiad`}
              </h2>
              <p className="text-xs sm:text-sm text-[#554053] leading-relaxed">
                The results can be accessed on candidate's dashboard by logging in for Performance Results &gt; Select Subjects.
              </p>
            </section>

            {/* SECTION 9: AWARDS */}
            <section id="awards" className="space-y-3 pb-8 border-b border-[#edd6ed]/60">
              <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                {customHeadings.awards || `Awards for ${subject.shortName} Olympiad`}
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-[#554053] leading-relaxed">
                {Array.isArray(customAwards) && customAwards.length > 0 ? (
                  customAwards.map((award, idx) => (
                    <p key={idx}><strong>{String.fromCharCode(97 + idx)}.</strong> {award}</p>
                  ))
                ) : (
                  <>
                    <p><strong>a.</strong> Students scoring above 60% in Level 1 will be awarded a Star Medal along with a Merit Certificate.</p>
                    <p><strong>b.</strong> Top 3 International Rankers receive Gold, Silver, and Bronze Medals of Excellence + Cash Scholarships.</p>
                    <p><strong>c.</strong> Other participants will receive a Digital Participation Certificate, accessible through their dashboard.</p>
                    <p><strong>d.</strong> School Topper awards and special recognition for participating schools.</p>
                  </>
                )}
              </div>
            </section>

            {/* SECTION 10: FAQS */}
            <section id="faqs" className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#3a1d36]">
                {customHeadings.faqs || `${subject.shortName} Olympiads FAQs`}
              </h2>

              <div className="space-y-3">
                {faqsList.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div key={idx} className="border-b border-[#edd6ed]/60 pb-3">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        className="w-full text-left text-xs sm:text-sm font-bold text-[#3a1d36] flex items-center justify-between gap-2 cursor-pointer hover:text-[#0d9488]"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-[#0d9488] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-xs sm:text-sm text-[#6c568d] leading-relaxed pl-1">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};
