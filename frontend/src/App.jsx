import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/auth/LoginPage';
import { ExamPortal } from './pages/exam/ExamPortal';
import { CertificateView } from './components/CertificateView';
import { Modal } from './components/Modal';
import { CartDrawer } from './components/CartDrawer';
import { apiClient } from './api/client';

// Public Components & Pages
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { PublicHomePage } from './pages/public/PublicHomePage';
import { OlympiadsPage } from './pages/public/OlympiadsPage';
import { IndividualOlympiadPage } from './pages/public/IndividualOlympiadPage';
import { SyllabusPage } from './pages/public/SyllabusPage';
import { ExamPatternPage } from './pages/public/ExamPatternPage';
import { SamplePapersPage } from './pages/public/SamplePapersPage';
import { PreparationHubPage } from './pages/public/PreparationHubPage';
import { ExamSchedulePage } from './pages/public/ExamSchedulePage';
import { PublicRankingsPage } from './pages/public/PublicRankingsPage';
import { PublicResultsPage } from './pages/public/PublicResultsPage';
import { CertificateVerifierPage } from './pages/public/CertificateVerifierPage';
import { StudentRegistrationPage } from './pages/public/StudentRegistrationPage';
import { SchoolRegistrationPage } from './pages/public/SchoolRegistrationPage';
import { BecomeCoordinatorPage } from './pages/public/BecomeCoordinatorPage';
import { FreeTrialExperience } from './pages/public/FreeTrialExperience';
import { PricingPage } from './pages/public/PricingPage';
import { WorkbooksPage } from './pages/public/WorkbooksPage';
import { AboutUsPage } from './pages/public/AboutUsPage';
import { BlogPage } from './pages/public/BlogPage';
import { FAQPage } from './pages/public/FAQPage';
import { ContactPage } from './pages/public/ContactPage';

// Super Admin Pages
import { SuperAdminOverview } from './pages/superadmin/SuperAdminOverview';
import { SchoolManagement } from './pages/superadmin/SchoolManagement';
import { CoordinatorManagement } from './pages/superadmin/CoordinatorManagement';
import { ApplicantLeadsManagement } from './pages/superadmin/ApplicantLeadsManagement';
import { WorkbookOrdersManagement } from './pages/superadmin/WorkbookOrdersManagement';
import { UserManagement } from './pages/superadmin/UserManagement';
import { StudentManagement } from './pages/superadmin/StudentManagement';
import { AcademicStructure } from './pages/superadmin/AcademicStructure';
import { QuestionBankPage } from './pages/superadmin/QuestionBankPage';
import { ExamManagementPage } from './pages/superadmin/ExamManagementPage';
import { ExamResultsPage } from './pages/superadmin/ExamResultsPage';
import { LeaderboardPage } from './pages/superadmin/LeaderboardPage';
import { CertificatesPage } from './pages/superadmin/CertificatesPage';
import { ActivityLogsPage } from './pages/superadmin/ActivityLogsPage';
import { SystemSettingsPage } from './pages/superadmin/SystemSettingsPage';
import { FaqsAndKeyInfoManager } from './pages/superadmin/FaqsAndKeyInfoManager';
import { TestGeneratorAdminManager } from './pages/superadmin/TestGeneratorAdminManager';
import { SuperAdminPackagesManager } from './pages/superadmin/SuperAdminPackagesManager';
import { SuperAdminSkillDevelopmentManager } from './pages/superadmin/SuperAdminSkillDevelopmentManager';
import { SuperAdminOnlineClassesManager } from './pages/superadmin/SuperAdminOnlineClassesManager';
import { SuperAdminPaymentManager } from './pages/superadmin/SuperAdminPaymentManager';
import { SuperAdminRevisionVaultManager } from './pages/superadmin/SuperAdminRevisionVaultManager';
import { SuperAdminFreeQuizzesManager } from './pages/superadmin/SuperAdminFreeQuizzesManager';
import { RolesAndPermissionsManager } from './pages/superadmin/RolesAndPermissionsManager';

// Teacher Pages
import { TeacherOverview } from './pages/teacher/TeacherOverview';

// Student Pages
import { StudentOverview } from './pages/student/StudentOverview';
import { StudentMyContentPage } from './pages/student/StudentMyContentPage';
import { AvailableExamsPage } from './pages/student/AvailableExamsPage';
import { ExamHistoryPage } from './pages/student/ExamHistoryPage';
import { ExamResultView } from './pages/student/ExamResultView';
import { DetailedSolutionsPage } from './pages/student/DetailedSolutionsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentPerformancePage } from './pages/student/StudentPerformancePage';
import { StudentHubModules } from './pages/student/StudentHubModules';
import { TestGeneratorPro } from './pages/student/TestGeneratorPro';
import { OnlineClassesPage } from './pages/student/OnlineClassesPage';
import { SubjectContentPackagesPage } from './pages/student/SubjectContentPackagesPage';
import { SkillDevelopmentProgramPage } from './pages/student/SkillDevelopmentProgramPage';
import { NotificationsPage } from './pages/common/NotificationsPage';

const parseRouteFromUrl = () => {
  try {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    const saved = localStorage.getItem('olympiadhub_route_state') || sessionStorage.getItem('olympiadhub_route_state');
    const savedTab = localStorage.getItem('olympiadhub_current_tab');
    let savedState = null;
    try {
      if (saved) savedState = JSON.parse(saved);
    } catch {}

    if (!rawHash) {
      if (savedState && typeof savedState === 'object') return savedState;
      return {
        viewMode: 'public',
        activePublicPage: 'home',
        activeOlympiadId: 'english',
        activeClassLevel: 'Class 1',
        currentTab: savedTab || 'overview',
        activeResultAttemptId: null,
        activeSolutionAttemptId: null
      };
    }

    const [routePath, queryString] = rawHash.split('?');
    const params = new URLSearchParams(queryString || '');

    if (routePath.startsWith('dashboard')) {
      const parts = routePath.split('/');
      const tab = parts[1] || savedTab || savedState?.currentTab || 'overview';
      return {
        viewMode: 'dashboard',
        currentTab: tab,
        activePublicPage: 'home',
        activeOlympiadId: params.get('id') || params.get('olympiad') || savedState?.activeOlympiadId || 'english',
        activeClassLevel: params.get('class') || savedState?.activeClassLevel || 'Class 1',
        activeResultAttemptId: params.get('resultAttempt') || savedState?.activeResultAttemptId || null,
        activeSolutionAttemptId: params.get('solutionAttempt') || savedState?.activeSolutionAttemptId || null
      };
    } else if (routePath === 'login') {
      return {
        viewMode: 'login',
        activePublicPage: 'home',
        currentTab: savedTab || savedState?.currentTab || 'overview',
        activeOlympiadId: 'english',
        activeClassLevel: 'Class 1',
        activeResultAttemptId: null,
        activeSolutionAttemptId: null
      };
    } else {
      const page = routePath || 'home';
      return {
        viewMode: 'public',
        activePublicPage: page,
        activeOlympiadId: params.get('id') || params.get('olympiad') || 'english',
        activeClassLevel: params.get('class') || 'Class 1',
        currentTab: savedTab || 'overview',
        activeResultAttemptId: null,
        activeSolutionAttemptId: null
      };
    }
  } catch (e) {
    return {
      viewMode: 'public',
      activePublicPage: 'home',
      activeOlympiadId: 'english',
      activeClassLevel: 'Class 1',
      currentTab: 'overview',
      activeResultAttemptId: null,
      activeSolutionAttemptId: null
    };
  }
};

const updateUrlAndStorage = (state) => {
  try {
    let hash = '';
    if (state.viewMode === 'dashboard') {
      hash = `dashboard/${state.currentTab || 'overview'}`;
      const params = new URLSearchParams();
      if (state.activeResultAttemptId) params.set('resultAttempt', state.activeResultAttemptId);
      if (state.activeSolutionAttemptId) params.set('solutionAttempt', state.activeSolutionAttemptId);
      const q = params.toString();
      if (q) hash += `?${q}`;
    } else if (state.viewMode === 'login') {
      hash = 'login';
    } else {
      hash = state.activePublicPage || 'home';
      const params = new URLSearchParams();
      if (state.activePublicPage === 'olympiad-detail' || (state.activeOlympiadId && state.activeOlympiadId !== 'english')) {
        params.set('id', state.activeOlympiadId);
      }
      if (state.activeClassLevel && state.activeClassLevel !== 'Class 1') {
        params.set('class', state.activeClassLevel);
      }
      const q = params.toString();
      if (q) hash += `?${q}`;
    }

    const currentHash = window.location.hash.replace(/^#\/?/, '');
    if (currentHash !== hash) {
      window.history.replaceState(null, '', `#/${hash}`);
    }
    sessionStorage.setItem('olympiadhub_route_state', JSON.stringify(state));
    localStorage.setItem('olympiadhub_route_state', JSON.stringify(state));
    if (state.currentTab) {
      localStorage.setItem('olympiadhub_current_tab', state.currentTab);
    }
  } catch (e) {
    // ignore storage errors
  }
};

export const App = () => {
  const { user, loading } = useAuth();

  const initialRoute = useMemo(() => parseRouteFromUrl(), []);

  // Mode: 'public' | 'dashboard' | 'login'
  const [viewMode, setViewMode] = useState(initialRoute.viewMode);
  
  // Public Page Routing: 'home' | 'olympiads' | 'olympiad-detail' | 'syllabus' | 'pattern' | 'sample-papers' | 'practice-hub' | 'workbooks' | 'schedule' | 'rankings' | 'results-finder' | 'certificates-info' | 'schools' | 'register-student' | 'pricing' | 'about' | 'blog' | 'faqs' | 'contact'
  const [activePublicPage, setActivePublicPage] = useState(initialRoute.activePublicPage);
  const [activeOlympiadId, setActiveOlympiadId] = useState(initialRoute.activeOlympiadId);
  const [activeClassLevel, setActiveClassLevel] = useState(initialRoute.activeClassLevel);

  // Dashboard Tab Routing (Preserve exact tab on refresh!)
  const [currentTab, setCurrentTab] = useState(() => {
    return initialRoute.currentTab || localStorage.getItem('olympiadhub_current_tab') || 'overview';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Active Exam state
  const [activeExamId, setActiveExamId] = useState(null);

  // Result & Solutions drill-down state
  const [activeResultAttemptId, setActiveResultAttemptId] = useState(initialRoute.activeResultAttemptId);
  const [activeSolutionAttemptId, setActiveSolutionAttemptId] = useState(initialRoute.activeSolutionAttemptId);

  // Standalone Certificate View Modal
  const [viewingCertificate, setViewingCertificate] = useState(null);

  // Synchronize viewMode with authentication state (without resetting active tab on refresh!)
  useEffect(() => {
    if (user) {
      if (viewMode === 'login' || viewMode === 'dashboard') {
        setViewMode('dashboard');
      }
    } else if (!loading) {
      const cached = localStorage.getItem('olympiadhub_user') || sessionStorage.getItem('olympiadhub_user');
      if (!cached && viewMode === 'dashboard') {
        setViewMode('login');
        setActiveExamId(null);
        setActiveResultAttemptId(null);
        setActiveSolutionAttemptId(null);
      }
    }
  }, [user, loading]);

  // Keep URL hash and LocalStorage updated whenever state changes
  useEffect(() => {
    updateUrlAndStorage({
      viewMode,
      activePublicPage,
      activeOlympiadId,
      activeClassLevel,
      currentTab,
      activeResultAttemptId,
      activeSolutionAttemptId
    });
  }, [viewMode, activePublicPage, activeOlympiadId, activeClassLevel, currentTab, activeResultAttemptId, activeSolutionAttemptId]);

  // Listen to browser Back / Forward buttons and Hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseRouteFromUrl();
      setViewMode(route.viewMode);
      setActivePublicPage(route.activePublicPage);
      setActiveOlympiadId(route.activeOlympiadId);
      setActiveClassLevel(route.activeClassLevel);
      setCurrentTab(route.currentTab);
      setActiveResultAttemptId(route.activeResultAttemptId);
      setActiveSolutionAttemptId(route.activeSolutionAttemptId);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#321630] flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 rounded-3xl bg-[#6d3a68] border border-[#e7b84b]/40 flex items-center justify-center font-black text-2xl mb-4 shadow-2xl shadow-[#6d3a68]/40 animate-pulse text-[#e7b84b]">
          Ω
        </div>
        <p className="text-sm font-semibold tracking-wide text-[#f4ebf4]">
          Loading OlympiadHub...
        </p>
      </div>
    );
  }

  // LIVE EXAM PORTAL (Full Screen distraction free)
  if (activeExamId) {
    return (
      <ExamPortal
        examId={activeExamId}
        onExamCompleted={(attemptId) => {
          setActiveExamId(null);
          setActiveSolutionAttemptId(attemptId);
          setActiveResultAttemptId(attemptId);
          setViewMode('dashboard');
          setCurrentTab('exam_solutions');
        }}
        onExit={() => {
          setActiveExamId(null);
          setViewMode('dashboard');
          setCurrentTab('available_exams');
        }}
      />
    );
  }

  const handleOpenCertificateById = async (certId) => {
    try {
      const res = await apiClient.get(`/certificates/${certId}`);
      if (res.success && res.data) {
        setViewingCertificate(res.data);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleNavigatePublic = (pageId, subId = null, classLevel = null) => {
    if (subId) {
      setActiveOlympiadId(subId);
    }
    if (classLevel) {
      setActiveClassLevel(classLevel);
    }
    setActivePublicPage(pageId);
    setViewMode('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. LOGIN SCREEN VIEW
  if (viewMode === 'login' || (viewMode === 'dashboard' && !user)) {
    return (
      <LoginPage
        onNavigateVerify={() => {
          setActivePublicPage('certificates-info');
          setViewMode('public');
        }}
        onBackToPublic={() => setViewMode('public')}
      />
    );
  }

  // 2. PUBLIC PORTAL VIEW (Landing, Olympiads, Syllabus, Schedule, Practice Hub, etc.)
  if (viewMode === 'public') {
    const renderPublicContent = () => {
      switch (activePublicPage) {
        case 'home':
          return (
            <PublicHomePage
              onNavigatePublic={handleNavigatePublic}
              onOpenLogin={() => setViewMode('login')}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'olympiads':
          return (
            <OlympiadsPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'olympiad-detail':
          return (
            <IndividualOlympiadPage
              olympiadId={activeOlympiadId}
              initialClass={activeClassLevel}
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'syllabus':
          return (
            <SyllabusPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'pattern':
          return (
            <ExamPatternPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'sample-papers':
          return (
            <SamplePapersPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'practice-hub':
          return (
            <PreparationHubPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'workbooks':
          return (
            <WorkbooksPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'schedule':
          return (
            <ExamSchedulePage
              selectedDisciplineId="all"
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'rankings':
        case 'cut-off':
          return (
            <PublicRankingsPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'results-finder':
          return (
            <PublicResultsPage
              onNavigatePublic={handleNavigatePublic}
              onOpenLogin={() => setViewMode('login')}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'certificates-info':
          return (
            <CertificateVerifierPage
              onBackToLogin={() => setViewMode('login')}
              onNavigatePublic={handleNavigatePublic}
            />
          );
        case 'register-student':
          return (
            <StudentRegistrationPage
              onNavigatePublic={handleNavigatePublic}
              onOpenLogin={() => setViewMode('login')}
            />
          );
        case 'schools':
          return (
            <SchoolRegistrationPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
              onOpenLogin={() => setViewMode('login')}
            />
          );
        case 'coordinator':
        case 'become-coordinator':
          return (
            <BecomeCoordinatorPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
              onOpenLogin={() => setViewMode('login')}
            />
          );
        case 'free-trial':
        case 'free-trial-exam':
          return (
            <FreeTrialExperience
              onNavigatePublic={handleNavigatePublic}
              onOpenLogin={() => setViewMode('login')}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'pricing':
          return (
            <PricingPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'about':
          return (
            <AboutUsPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'blog':
          return (
            <BlogPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'faqs':
          return (
            <FAQPage
              onNavigatePublic={handleNavigatePublic}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
        case 'contact':
          return (
            <ContactPage
              onNavigatePublic={handleNavigatePublic}
            />
          );
        default:
          return (
            <PublicHomePage
              onNavigatePublic={handleNavigatePublic}
              onOpenLogin={() => setViewMode('login')}
              onOpenRegister={() => handleNavigatePublic('register-student')}
            />
          );
      }
    };

    return (
      <div className="min-h-screen bg-[#fff9f2] flex flex-col justify-between">
        {/* Public Header */}
        <PublicNavbar
          user={user}
          activePublicPage={activePublicPage}
          onNavigatePublic={handleNavigatePublic}
          onOpenLogin={() => setViewMode('login')}
          onGoToDashboard={() => setViewMode('dashboard')}
          onOpenRegister={() => handleNavigatePublic('register-student')}
        />

        {/* Public Content Viewport */}
        <main className="flex-1">
          {renderPublicContent()}
        </main>

        {/* Public Footer */}
        <PublicFooter
          onNavigatePublic={handleNavigatePublic}
          onOpenLogin={() => setViewMode('login')}
          onOpenRegister={() => handleNavigatePublic('register-student')}
        />
      </div>
    );
  }

  // 3. DASHBOARD VIEW (Logged-in Super Admin, Teacher, or Student)
  const renderDashboardContent = () => {
    // 0. Universal Notifications Page
    if (currentTab === 'notifications') {
      return (
        <NotificationsPage
          onNavigateTab={(tab) => {
            setActiveResultAttemptId(null);
            setActiveSolutionAttemptId(null);
            setCurrentTab(tab);
          }}
          onBack={() => setCurrentTab('overview')}
        />
      );
    }

    // 1. Result & Solutions Drill-Down (Directly show Detailed Solutions & Performance Review)
    if (currentTab === 'exam_result' && activeResultAttemptId) {
      return (
        <DetailedSolutionsPage
          attemptId={activeResultAttemptId}
          onBack={() => {
            setActiveResultAttemptId(null);
            setCurrentTab('overview');
          }}
          onGoToList={() => {
            setActiveResultAttemptId(null);
            setActiveSolutionAttemptId(null);
            setCurrentTab('available_exams');
          }}
          onViewAnalysis={() => {
            setCurrentTab('performance');
          }}
          onNavigateTab={setCurrentTab}
        />
      );
    }

    if (currentTab === 'exam_solutions' && activeSolutionAttemptId) {
      return (
        <DetailedSolutionsPage
          attemptId={activeSolutionAttemptId}
          onBack={() => {
            setActiveSolutionAttemptId(null);
            setCurrentTab('my_content');
          }}
          onGoToList={() => {
            setActiveResultAttemptId(null);
            setActiveSolutionAttemptId(null);
            setCurrentTab('available_exams');
          }}
          onViewAnalysis={() => {
            setActiveResultAttemptId(activeSolutionAttemptId);
            setCurrentTab('performance');
          }}
          onNavigateTab={setCurrentTab}
        />
      );
    }

    // 2. Super Admin Routes
    if (user?.role === 'superadmin') {
      switch (currentTab) {
        case 'overview':
          return <SuperAdminOverview onNavigateTab={setCurrentTab} />;
        case 'online_classes_manager':
        case 'online_classes_admin':
        case 'superadmin_online_classes':
          return <SuperAdminOnlineClassesManager onNavigateTab={setCurrentTab} />;
        case 'skill_programs_manager':
        case 'skill_programs':
          return <SuperAdminSkillDevelopmentManager onNavigateTab={setCurrentTab} />;
        case 'packages':
        case 'superadmin_packages':
          return <SuperAdminPackagesManager onNavigateTab={setCurrentTab} />;
        case 'payment_bank_manager':
        case 'payment_settings':
        case 'payment_orders':
          return <SuperAdminPaymentManager onNavigateTab={setCurrentTab} />;
        case 'applicant_leads':
        case 'applicant-leads':
        case 'applicant_registrations':
          return <ApplicantLeadsManagement />;
        case 'schools':
          return <SchoolManagement />;
        case 'coordinators':
          return <CoordinatorManagement />;
        case 'workbook_orders':
          return <WorkbookOrdersManagement />;
        case 'teachers':
          return <UserManagement mode="teachers" />;
        case 'students':
          return <StudentManagement />;
        case 'roles_permissions':
        case 'role_permissions':
        case 'roles':
        case 'permissions':
          return <RolesAndPermissionsManager onNavigateTab={setCurrentTab} />;
        case 'academic':
          return <AcademicStructure defaultTab="subjects" onNavigateTab={setCurrentTab} />;
        case 'subject_content':
          return <AcademicStructure defaultTab="page_content" onNavigateTab={setCurrentTab} />;
        case 'faqs_key_info':
          return <FaqsAndKeyInfoManager onNavigateTab={setCurrentTab} onGoToPublic={() => setViewMode('public')} />;
        case 'revision_vault':
        case 'revision_vault_manager':
          return <SuperAdminRevisionVaultManager onNavigateTab={setCurrentTab} />;
        case 'free_quizzes_manager':
        case 'free_quizzes_admin':
          return <SuperAdminFreeQuizzesManager onNavigateTab={setCurrentTab} />;
        case 'question_bank':
          return <QuestionBankPage />;
        case 'test_generator_manager':
          return <TestGeneratorAdminManager />;
        case 'exams':
          return <ExamManagementPage />;
        case 'results':
          return <ExamResultsPage />;
        case 'leaderboard':
          return <LeaderboardPage />;
        case 'certificates':
          return <CertificatesPage />;
        case 'activity_logs':
          return <ActivityLogsPage />;
        case 'settings':
          return <SystemSettingsPage />;
        case 'profile':
          return <StudentProfilePage />;
        default:
          return <SuperAdminOverview onNavigateTab={setCurrentTab} />;
      }
    }

    // 3. Teacher Routes
    if (user?.role === 'teacher') {
      switch (currentTab) {
        case 'overview':
          return <TeacherOverview onNavigateTab={setCurrentTab} />;
        case 'question_bank':
          return <QuestionBankPage />;
        case 'exams':
          return <ExamManagementPage />;
        case 'students':
          return <StudentManagement />;
        case 'results':
          return <ExamResultsPage />;
        case 'leaderboard':
          return <LeaderboardPage />;
        case 'profile':
          return <StudentProfilePage />;
        default:
          return <TeacherOverview onNavigateTab={setCurrentTab} />;
      }
    }

    // 4. Student Routes
    if (user?.role === 'student' || !user?.role) {
      switch (currentTab) {
        case 'overview':
          return (
            <StudentOverview
              onNavigateTab={setCurrentTab}
              onStartExam={(eId) => setActiveExamId(eId)}
              onViewResult={(attId) => {
                setActiveSolutionAttemptId(attId);
                setActiveResultAttemptId(attId);
                setCurrentTab('exam_solutions');
              }}
            />
          );
        case 'my_content':
        case 'content_icso':
        case 'content_iso':
        case 'content_imo':
        case 'content_ieo':
        case 'content_igko':
        case 'content_isso':
        case 'content_vc':
        case 'content_ego':
        case 'content_cao':
          return (
            <StudentMyContentPage
              activeSubjectCode={currentTab}
              onNavigateTab={setCurrentTab}
              onStartExam={(eId) => setActiveExamId(eId)}
            />
          );
        case 'available_exams':
          return (
            <AvailableExamsPage
              onStartExam={(eId) => setActiveExamId(eId)}
            />
          );
        case 'exam_history':
          return (
            <ExamHistoryPage
              onViewResult={(attId) => {
                setActiveSolutionAttemptId(attId);
                setActiveResultAttemptId(attId);
                setCurrentTab('exam_solutions');
              }}
              onViewSolutions={(attId) => {
                setActiveSolutionAttemptId(attId);
                setCurrentTab('exam_solutions');
              }}
              onViewCertificate={(certId) => handleOpenCertificateById(certId)}
            />
          );
        case 'exam_solutions':
          return (
            <DetailedSolutionsPage
              attemptId={activeSolutionAttemptId}
              onBack={() => {
                setActiveSolutionAttemptId(null);
                setCurrentTab('my_content');
              }}
              onGoToList={() => {
                setActiveResultAttemptId(null);
                setActiveSolutionAttemptId(null);
                setCurrentTab('available_exams');
              }}
              onViewAnalysis={() => {
                setActiveResultAttemptId(activeSolutionAttemptId);
                setCurrentTab('performance');
              }}
              onNavigateTab={setCurrentTab}
            />
          );
        case 'analysis':
        case 'performance':
        case 'statistics':
          return (
            <StudentPerformancePage
              onNavigateTab={setCurrentTab}
              onViewResult={(attId) => {
                setActiveSolutionAttemptId(attId);
                setActiveResultAttemptId(attId);
                setCurrentTab('exam_solutions');
              }}
            />
          );
        case 'leaderboard':
          return <LeaderboardPage />;
        case 'certificates':
          return <CertificatesPage />;
        case 'profile':
          return <StudentProfilePage />;
        case 'prog_rsdp':
        case 'prog_msdp':
        case 'prog_ssdp':
        case 'prog_esdp':
        case 'prog_gksdp':
        case 'prog_csdp':
          return (
            <SkillDevelopmentProgramPage
              initialProgram={currentTab}
              onNavigateTab={setCurrentTab}
            />
          );
        case 'forum':
        case 'info_faq':
        case 'info_datesheet':
        case 'info_awards':
        case 'info_icso':
        case 'info_nso':
        case 'info_imo':
        case 'info_ieo':
        case 'my_revision':
        case 'my_orders':
        case 'my_wallet':
        case 'free_sample_papers':
        case 'free_past_papers':
        case 'free_quizzes':
        case 'fun_zone':
          return (
            <StudentHubModules
              activeModule={currentTab}
              onNavigateTab={setCurrentTab}
              onStartExam={(eId) => setActiveExamId(eId)}
            />
          );
        case 'my_classes':
          return (
            <OnlineClassesPage
              onNavigateTab={setCurrentTab}
            />
          );
        case 'test_generator':
          return (
            <TestGeneratorPro
              onNavigateTab={setCurrentTab}
              onExitToDashboard={() => setCurrentTab('overview')}
            />
          );
        default:
          return (
            <StudentOverview
              onNavigateTab={setCurrentTab}
              onStartExam={(eId) => setActiveExamId(eId)}
              onViewResult={(attId) => {
                setActiveSolutionAttemptId(attId);
                setActiveResultAttemptId(attId);
                setCurrentTab('exam_solutions');
              }}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#faf6fa] flex flex-col w-full overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateTab={(tab) => {
          setActiveResultAttemptId(null);
          setActiveSolutionAttemptId(null);
          setCurrentTab(tab);
        }}
        onOpenNotifications={() => {
          setActiveResultAttemptId(null);
          setActiveSolutionAttemptId(null);
          setCurrentTab('notifications');
        }}
      />

      <div className="flex-1 flex w-full min-w-0">
        {/* Role-Based Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tabId) => {
            setActiveResultAttemptId(null);
            setActiveSolutionAttemptId(null);
            setCurrentTab(tabId);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onGoToPublic={() => setViewMode('public')}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 lg:pl-72 min-w-0 w-full overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderDashboardContent()}
          </div>
        </main>
      </div>

      {/* Interactive Global Cart Drawer */}
      <CartDrawer
        onNavigateTab={(tab) => {
          setActiveResultAttemptId(null);
          setActiveSolutionAttemptId(null);
          setCurrentTab(tab);
        }}
      />

      {/* Standalone Certificate Viewer Modal */}
      <Modal
        isOpen={!!viewingCertificate}
        onClose={() => setViewingCertificate(null)}
        title="Official Examination Certificate"
        maxWidth="max-w-4xl"
      >
        {viewingCertificate && (
          <CertificateView
            certificate={viewingCertificate}
            onClose={() => setViewingCertificate(null)}
          />
        )}
      </Modal>
    </div>
  );
};
