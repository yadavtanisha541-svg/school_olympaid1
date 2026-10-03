import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Trash2,
  Check,
  ArrowLeft,
  Sparkles,
  Info,
  Shield,
  FileSpreadsheet,
  RotateCcw,
  User,
  GraduationCap
} from 'lucide-react';
import { Button } from '../../components/Button';

export const NotificationsPage = ({ onNavigateTab, onBack }) => {
  const { user } = useAuth();
  const [filterCategory, setFilterCategory] = useState('all');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const storageKey = `olympiadhub_notifications_${user?.id || user?.role || 'default'}`;

  // Role-specific initial notification templates
  const getInitialNotifications = () => {
    const role = user?.role || 'student';

    if (role === 'teacher') {
      return [
        {
          id: 't-1',
          title: 'New Student Submissions: Class 1 Computer Science Live Olympiad',
          message: '3 candidate submissions recorded and automatically graded. Scorecards are ready for review.',
          category: 'results',
          time: '15 minutes ago',
          date: '30 Sep 2026',
          isUnread: true,
          actionText: 'View Exam Results',
          actionTab: 'results',
          iconType: 'CheckCircle2',
          iconBg: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
        },
        {
          id: 't-2',
          title: 'Question Bank Updated: New Mathematics MCQs Added',
          message: 'You have successfully authored new multiple-choice questions in Mathematics and Logic.',
          category: 'system',
          time: '2 hours ago',
          date: '30 Sep 2026',
          isUnread: true,
          actionText: 'Explore Questions',
          actionTab: 'question_bank',
          iconType: 'FileSpreadsheet',
          iconBg: 'bg-[#faf5ff] text-[#7c3aed] border-[#e9d5ff]'
        },
        {
          id: 't-3',
          title: 'Scheduled Olympiad Published: Mathematics Progress Test',
          message: 'Your published examination is now live and accessible to assigned student batches.',
          category: 'exams',
          time: 'Yesterday, 04:30 PM',
          date: '29 Sep 2026',
          isUnread: false,
          actionText: 'Manage Exams',
          actionTab: 'exams',
          iconType: 'BookOpen',
          iconBg: 'bg-[#faf5ff] text-[#7c3aed] border-[#e9d5ff]'
        },
        {
          id: 't-4',
          title: 'Proctoring System Active for Live Assessments',
          message: 'Real-time anti-cheat monitoring, tab-switch penalties, and auto-submit triggers are operational.',
          category: 'system',
          time: '28 Sep 2026',
          date: '28 Sep 2026',
          isUnread: false,
          actionText: 'Dashboard',
          actionTab: 'overview',
          iconType: 'Shield',
          iconBg: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
        }
      ];
    }

    if (role === 'superadmin') {
      return [
        {
          id: 'a-1',
          title: 'System Audit: Faculty & Candidate Enrollment Active',
          message: 'Super administrator overview has synced all teacher permissions and student records.',
          category: 'system',
          time: '10 minutes ago',
          date: '30 Sep 2026',
          isUnread: true,
          actionText: 'User Directory',
          actionTab: 'teachers',
          iconType: 'GraduationCap',
          iconBg: 'bg-[#faf5ff] text-[#7c3aed] border-[#e9d5ff]'
        },
        {
          id: 'a-2',
          title: 'Merit Certificate Verification System Synchronized',
          message: 'Cryptographic SHA-256 signatures and QR verification endpoints are operational.',
          category: 'certificates',
          time: '1 hour ago',
          date: '30 Sep 2026',
          isUnread: true,
          actionText: 'Certificates Manager',
          actionTab: 'certificates',
          iconType: 'Award',
          iconBg: 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]'
        },
        {
          id: 'a-3',
          title: 'National Olympiad Examination Published Successfully',
          message: 'Class 1 Computer Science Live Olympiad 2026 is published across candidate dashboards.',
          category: 'exams',
          time: 'Yesterday, 06:15 PM',
          date: '29 Sep 2026',
          isUnread: false,
          actionText: 'Exam Management',
          actionTab: 'exams',
          iconType: 'BookOpen',
          iconBg: 'bg-[#faf5ff] text-[#7c3aed] border-[#e9d5ff]'
        },
        {
          id: 'a-4',
          title: 'Automated Platform Backup & Audit Logs Recorded',
          message: 'All administrative activities and student attempt transactions are backed up.',
          category: 'system',
          time: '28 Sep 2026',
          date: '28 Sep 2026',
          isUnread: false,
          actionText: 'Activity Logs',
          actionTab: 'activity_logs',
          iconType: 'Shield',
          iconBg: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
        }
      ];
    }

    // Default: Student
    return [
      {
        id: 's-1',
        title: 'New Olympiad Published: Class 1 Computer Science Live Olympiad 2026',
        message: 'The examination has been scheduled and is now live for all enrolled Class 1 candidates.',
        category: 'exams',
        time: '10 minutes ago',
        date: '30 Sep 2026',
        isUnread: true,
        actionText: 'View Olympiad',
        actionTab: 'available_exams',
        iconType: 'BookOpen',
        iconBg: 'bg-[#faf5ff] text-[#7c3aed] border-[#e9d5ff]'
      },
      {
        id: 's-2',
        title: 'Merit Certificate Generated & Ready for Download',
        message: 'Your official verified certificate for Mathematics Olympiad 2026 has been signed.',
        category: 'certificates',
        time: '2 hours ago',
        date: '30 Sep 2026',
        isUnread: true,
        actionText: 'Download Certificate',
        actionTab: 'certificates',
        iconType: 'Award',
        iconBg: 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]'
      },
      {
        id: 's-3',
        title: 'Examination Result Published: National Science Talent Exam',
        message: 'Evaluation complete! You scored 43/50 (86%) with a distinction grade.',
        category: 'results',
        time: 'Yesterday, 04:30 PM',
        date: '29 Sep 2026',
        isUnread: false,
        actionText: 'View Scorecard',
        actionTab: 'exam_history',
        iconType: 'CheckCircle2',
        iconBg: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
      },
      {
        id: 's-4',
        title: 'System Security & Proctoring Protection Active',
        message: 'Anti-cheat tab switch monitoring and automated response synchronization active on all live tests.',
        category: 'system',
        time: '25 Sep 2026',
        date: '25 Sep 2026',
        isUnread: false,
        actionText: 'Dashboard',
        actionTab: 'overview',
        iconType: 'Shield',
        iconBg: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
      }
    ];
  };

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return getInitialNotifications();
  });

  // Keep state synced whenever user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setNotifications(JSON.parse(saved));
      } else {
        const initial = getInitialNotifications();
        setNotifications(initial);
        localStorage.setItem(storageKey, JSON.stringify(initial));
      }
    } catch (e) {
      console.error(e);
    }
  }, [user?.id, user?.role]);

  // Helper to persist changes
  const saveNotifications = (newList) => {
    setNotifications(newList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const filteredNotifications = notifications.filter(n => {
    if (filterCategory === 'unread') return n.isUnread;
    if (filterCategory !== 'all') return n.category === filterCategory;
    return true;
  });

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isUnread: false }));
    saveNotifications(updated);
    setFeedback({ type: 'success', message: 'All notifications marked as read.' });
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    saveNotifications([]);
    setFeedback({ type: 'success', message: 'All notifications cleared successfully.' });
  };

  const handleRestoreDefaults = () => {
    const fresh = getInitialNotifications();
    saveNotifications(fresh);
    setFeedback({ type: 'success', message: 'Default notifications restored.' });
  };

  const handleToggleRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isUnread: !n.isUnread } : n);
    saveNotifications(updated);
  };

  const handleDeleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
    setFeedback({ type: 'success', message: 'Notification deleted successfully.' });
  };

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Shield':
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#eee6f8] shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#7c3aed] px-3.5 py-2 rounded-xl bg-[#faf5ff] border border-[#e9d5ff] hover:bg-[#f3e8ff] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Dashboard</span>
          </button>
          <div>
            <h2 className="text-xl font-black text-[#2e1065] leading-tight flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#7c3aed]" />
              <span>Notification Center</span>
              {unreadCount > 0 && (
                <span className="text-xs font-black text-[#581c87] bg-[#faf5ff] px-2.5 py-0.5 rounded-full border border-[#e9d5ff] shadow-2xs">
                  {unreadCount} New
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              System alerts, exam schedules, scorecard announcements, and verified certificates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#581c87] hover:bg-[#f3e8ff] bg-[#faf5ff] px-3 py-2 rounded-xl border border-[#e9d5ff] cursor-pointer transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-[#7c3aed]" /> Mark Read
            </button>
          )}

          {notifications.length > 0 ? (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 bg-white px-3 py-2 rounded-xl border border-rose-200 cursor-pointer transition-colors shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065f46] hover:bg-[#d1fae5] bg-[#ecfdf5] px-3 py-2 rounded-xl border border-[#a7f3d0] cursor-pointer transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restore
            </button>
          )}
        </div>
      </div>

      {feedback.message && (
        <div className="p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs font-bold rounded-2xl flex items-center justify-between shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#eee6f8] shadow-2xs overflow-x-auto">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'exams', label: 'Exams & Tests' },
          { id: 'results', label: 'Results' },
          { id: 'certificates', label: 'Certificates' },
          { id: 'system', label: 'System & Security' }
        ].map((tab) => {
          const isActive = filterCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterCategory(tab.id)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#faf5ff] to-[#f0fdf4] text-[#581c87] border border-[#d8b4fe] shadow-2xs'
                  : 'text-slate-600 hover:bg-[#faf5ff] hover:text-[#581c87]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#eee6f8] p-16 text-center text-slate-400 text-xs shadow-2xs">
            <Bell className="w-12 h-12 text-[#d8b4fe] mx-auto mb-3" />
            <p className="font-bold text-[#2e1065] text-sm">No notifications found</p>
            <p className="mt-1 text-slate-500">You're all caught up with recent announcements and alerts.</p>
            {notifications.length === 0 && (
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#faf5ff] text-[#7c3aed] font-bold text-xs rounded-xl border border-[#e9d5ff] hover:bg-[#f3e8ff] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Sample Notifications</span>
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            return (
              <div
                key={notif.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  notif.isUnread
                    ? 'bg-white border-[#e9d5ff] shadow-2xs ring-1 ring-[#7c3aed]/15'
                    : 'bg-white/85 border-[#eee6f8] opacity-90'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Category Icon */}
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs ${notif.iconBg}`}>
                    {renderIcon(notif.iconType)}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#2e1065] leading-snug">
                        {notif.title}
                      </h4>
                      {notif.isUnread && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {notif.message}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 pt-1">
                      {notif.time} • {notif.date}
                    </p>
                  </div>
                </div>

                {/* Right Action & Options */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                  {notif.actionText && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab(notif.actionTab)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#581c87] bg-[#f5f0ff] hover:bg-[#ede9fe] border border-[#d8b4fe] shadow-2xs cursor-pointer transition-all active:scale-95 hover:text-[#3b0764]"
                    >
                      {notif.actionText}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleRead(notif.id)}
                    title={notif.isUnread ? 'Mark as Read' : 'Mark as Unread'}
                    className="p-2 text-slate-400 hover:text-[#7c3aed] hover:bg-[#faf5ff] rounded-xl transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteNotification(notif.id)}
                    title="Delete Notification"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
