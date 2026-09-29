import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/auth/LoginPage';
import { ExamPortal } from './pages/exam/ExamPortal';
import { CertificateVerifierPage } from './pages/public/CertificateVerifierPage';
import { CertificateView } from './components/CertificateView';
import { Modal } from './components/Modal';
import { apiClient } from './api/client';

// Super Admin Pages
import { SuperAdminOverview } from './pages/superadmin/SuperAdminOverview';
import { UserManagement } from './pages/superadmin/UserManagement';
import { AcademicStructure } from './pages/superadmin/AcademicStructure';
import { QuestionBankPage } from './pages/superadmin/QuestionBankPage';
import { ExamManagementPage } from './pages/superadmin/ExamManagementPage';
import { ExamResultsPage } from './pages/superadmin/ExamResultsPage';
import { LeaderboardPage } from './pages/superadmin/LeaderboardPage';
import { CertificatesPage } from './pages/superadmin/CertificatesPage';
import { ActivityLogsPage } from './pages/superadmin/ActivityLogsPage';
import { SystemSettingsPage } from './pages/superadmin/SystemSettingsPage';

// Teacher Pages
import { TeacherOverview } from './pages/teacher/TeacherOverview';

// Student Pages
import { StudentOverview } from './pages/student/StudentOverview';
import { AvailableExamsPage } from './pages/student/AvailableExamsPage';
import { ExamHistoryPage } from './pages/student/ExamHistoryPage';
import { ExamResultView } from './pages/student/ExamResultView';
import { DetailedSolutionsPage } from './pages/student/DetailedSolutionsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

export const App = () => {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Active Exam state
  const [activeExamId, setActiveExamId] = useState(null);

  // Result & Solutions drill-down state
  const [activeResultAttemptId, setActiveResultAttemptId] = useState(null);
  const [activeSolutionAttemptId, setActiveSolutionAttemptId] = useState(null);

  // Public verifier view
  const [showPublicVerifier, setShowPublicVerifier] = useState(false);

  // Standalone Certificate View Modal
  const [viewingCertificate, setViewingCertificate] = useState(null);

  // Reset tab when user role changes
  useEffect(() => {
    setCurrentTab('overview');
    setActiveExamId(null);
    setActiveResultAttemptId(null);
    setActiveSolutionAttemptId(null);
  }, [user?.role]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center font-black text-2xl mb-4 shadow-xl shadow-brand-500/30 animate-pulse">
          Ω
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Loading OlympiadHub...
        </p>
      </div>
    );
  }

  // Public Certificate Verifier Screen
  if (showPublicVerifier) {
    return (
      <CertificateVerifierPage
        onBackToLogin={() => setShowPublicVerifier(false)}
      />
    );
  }

  // Not Logged In -> Login Screen
  if (!user) {
    return (
      <LoginPage
        onNavigateVerify={() => setShowPublicVerifier(true)}
      />
    );
  }

  // LIVE EXAM PORTAL (Full Screen distraction free)
  if (activeExamId) {
    return (
      <ExamPortal
        examId={activeExamId}
        onExamCompleted={(attemptId) => {
          setActiveExamId(null);
          setActiveResultAttemptId(attemptId);
          setCurrentTab('exam_result');
        }}
        onExit={() => {
          setActiveExamId(null);
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

  // Render role-specific tab content
  const renderContent = () => {
    // 1. Result & Solutions Drill-Down
    if (currentTab === 'exam_result' && activeResultAttemptId) {
      return (
        <ExamResultView
          attemptId={activeResultAttemptId}
          onBack={() => {
            setActiveResultAttemptId(null);
            setCurrentTab('overview');
          }}
          onViewSolutions={(attId) => {
            setActiveSolutionAttemptId(attId);
            setCurrentTab('exam_solutions');
          }}
          onViewCertificate={(certId) => handleOpenCertificateById(certId)}
        />
      );
    }

    if (currentTab === 'exam_solutions' && activeSolutionAttemptId) {
      return (
        <DetailedSolutionsPage
          attemptId={activeSolutionAttemptId}
          onBack={() => {
            setActiveSolutionAttemptId(null);
            setCurrentTab('exam_result');
          }}
        />
      );
    }

    // 2. Super Admin Routes
    if (user.role === 'superadmin') {
      switch (currentTab) {
        case 'overview':
          return <SuperAdminOverview onNavigateTab={setCurrentTab} />;
        case 'teachers':
          return <UserManagement mode="teachers" />;
        case 'students':
          return <UserManagement mode="students" />;
        case 'academic':
          return <AcademicStructure />;
        case 'question_bank':
          return <QuestionBankPage />;
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
        default:
          return <SuperAdminOverview onNavigateTab={setCurrentTab} />;
      }
    }

    // 3. Teacher Routes
    if (user.role === 'teacher') {
      switch (currentTab) {
        case 'overview':
          return <TeacherOverview onNavigateTab={setCurrentTab} />;
        case 'question_bank':
          return <QuestionBankPage />;
        case 'exams':
          return <ExamManagementPage />;
        case 'students':
          return <UserManagement mode="students" />;
        case 'results':
          return <ExamResultsPage />;
        case 'leaderboard':
          return <LeaderboardPage />;
        default:
          return <TeacherOverview onNavigateTab={setCurrentTab} />;
      }
    }

    // 4. Student Routes
    if (user.role === 'student') {
      switch (currentTab) {
        case 'overview':
          return (
            <StudentOverview
              onNavigateTab={setCurrentTab}
              onStartExam={(eId) => setActiveExamId(eId)}
              onViewResult={(attId) => {
                setActiveResultAttemptId(attId);
                setCurrentTab('exam_result');
              }}
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
                setActiveResultAttemptId(attId);
                setCurrentTab('exam_result');
              }}
              onViewSolutions={(attId) => {
                setActiveSolutionAttemptId(attId);
                setCurrentTab('exam_solutions');
              }}
              onViewCertificate={(certId) => handleOpenCertificateById(certId)}
            />
          );
        case 'performance':
          return (
            <StudentOverview
              onNavigateTab={setCurrentTab}
              onStartExam={(eId) => setActiveExamId(eId)}
              onViewResult={(attId) => {
                setActiveResultAttemptId(attId);
                setCurrentTab('exam_result');
              }}
            />
          );
        case 'leaderboard':
          return <LeaderboardPage />;
        case 'certificates':
          return <CertificatesPage />;
        case 'profile':
          return <StudentProfilePage />;
        default:
          return (
            <StudentOverview
              onNavigateTab={setCurrentTab}
              onStartExam={(eId) => setActiveExamId(eId)}
              onViewResult={(attId) => {
                setActiveResultAttemptId(attId);
                setCurrentTab('exam_result');
              }}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex">
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
        />

        {/* Main Content Viewport */}
        <main className="flex-1 lg:pl-64 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>

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
