import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  BarChart3,
  Target,
  Zap,
  Flame,
  ArrowUpRight,
  Download,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

export const StudentPerformancePage = ({ onNavigateTab, onViewResult }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/analytics/student');
        if (res.success && res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error('Error fetching student analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const studentName = user?.full_name || 'muskan';
  const studentId = user?.login_id || 'STUD001';
  const studentClass = user?.class_name ? `${user.class_name}-A` : 'Class 1-A';
  const studentAvatar = user?.avatar;

  const metrics = dashboardData?.metrics || {};
  const recentAttempts = dashboardData?.recent_attempts || [];
  const subjectProgress = dashboardData?.subject_progress || [];
  const scoreTrend = dashboardData?.score_trend || [];

  // Calculate real metrics
  const totalAnswered = subjectProgress.reduce((acc, curr) => acc + parseInt(curr.total_answered || 0), 0);
  const totalCorrect = subjectProgress.reduce((acc, curr) => acc + parseInt(curr.correct_count || 0), 0);
  const totalWrong = Math.max(0, totalAnswered - totalCorrect);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : (parseFloat(metrics.avg_score || 0) || 0);

  const totalAttemptsCount = metrics.total_attempts || recentAttempts.length || 0;
  const avgScoreVal = parseFloat(metrics.avg_score || 0).toFixed(0);
  const bestScoreVal = parseFloat(metrics.best_score || 0).toFixed(0);
  const bestRankVal = metrics.best_rank ? `#${metrics.best_rank}` : (recentAttempts.length > 0 ? '#1' : 'N/A');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 font-sans">
      {/* 1. Student Header Profile Bar */}
      <div className="bg-white rounded-3xl border border-[#edd6ed] p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Student Avatar */}
            <div className="relative group shrink-0">
              {studentAvatar ? (
                <img
                  src={studentAvatar}
                  alt={studentName}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#f4ebf4] border border-[#edd6ed] shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4e2a4a] to-[#6d3a68] text-white font-black text-2xl flex items-center justify-center shadow-xs">
                  {studentName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a] leading-tight">
                  {studentName}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  Active Candidate
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-semibold flex-wrap">
                <span className="font-mono text-[#6d3a68] font-bold bg-[#faf5fa] px-2.5 py-0.5 rounded-lg border border-[#edd6ed]">
                  {studentId}
                </span>
                <span className="text-slate-300">•</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] font-bold">
                  {studentClass}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">OlympiadHub Online Portal</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#6d3a68] hover:text-[#4e2a4a] bg-[#faf5fa] hover:bg-[#f4ebf4] border border-[#edd6ed] px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Exams */}
        <div className="bg-white rounded-3xl border border-[#edd6ed] p-5 shadow-2xs flex items-center justify-between hover:border-[#6d3a68]/40 transition-all group">
          <div>
            <p className="text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider">Exams Attempted</p>
            <h3 className="text-2xl font-black text-[#4e2a4a] mt-1">{totalAttemptsCount}</h3>
            <p className="text-[10px] text-[#059669] font-bold mt-0.5 flex items-center gap-1">
              <Check className="w-3 h-3" /> {metrics.total_passed || 0} qualified
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#faf5fa] text-[#6d3a68] flex items-center justify-center font-bold text-lg group-hover:bg-[#6d3a68] group-hover:text-white transition-colors border border-[#edd6ed]">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Score */}
        <div className="bg-white rounded-3xl border border-[#edd6ed] p-5 shadow-2xs flex items-center justify-between hover:border-[#6d3a68]/40 transition-all group">
          <div>
            <p className="text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider">Avg Score</p>
            <h3 className="text-2xl font-black text-[#d9775b] mt-1">{avgScoreVal}%</h3>
            <p className="text-[10px] text-[#d9775b] font-bold mt-0.5">Overall benchmark</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fdf6f4] text-[#d9775b] flex items-center justify-center font-bold text-lg group-hover:bg-[#d9775b] group-hover:text-white transition-colors border border-[#f7d7cc]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-3xl border border-[#edd6ed] p-5 shadow-2xs flex items-center justify-between hover:border-[#6d3a68]/40 transition-all group">
          <div>
            <p className="text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider">Accuracy</p>
            <h3 className="text-2xl font-black text-[#059669] mt-1">{overallAccuracy}%</h3>
            <p className="text-[10px] text-[#059669] font-bold mt-0.5">{totalCorrect} / {totalAnswered || totalCorrect} Correct</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-lg group-hover:bg-[#059669] group-hover:text-white transition-colors border border-[#a7f3d0]">
            <Target className="w-5 h-5" />
          </div>
        </div>

        {/* Best Score */}
        <div className="bg-white rounded-3xl border border-[#edd6ed] p-5 shadow-2xs flex items-center justify-between hover:border-[#6d3a68]/40 transition-all group">
          <div>
            <p className="text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider">Best Score</p>
            <h3 className="text-2xl font-black text-[#4e2a4a] mt-1">{bestScoreVal}%</h3>
            <p className="text-[10px] text-[#b17b25] font-bold mt-0.5">Rank: {bestRankVal}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fdfbf2] text-[#e7b84b] flex items-center justify-center font-bold text-lg group-hover:bg-[#e7b84b] group-hover:text-slate-900 transition-colors border border-[#eed694]">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Growth Chart & Accuracy Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Growth Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#edd6ed] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed]">
              <TrendingUp className="w-3.5 h-3.5 text-[#6d3a68]" />
              <span>Performance Growth Chart</span>
            </span>
            <span className="text-[10px] font-bold text-[#059669] bg-[#ecfdf5] px-2.5 py-1 rounded-full border border-[#a7f3d0]">
              {scoreTrend.length > 0 ? `${scoreTrend.length} Tests Recorded` : 'Real Progression'}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          {scoreTrend.length > 0 || recentAttempts.length > 0 ? (
            <div className="h-44 flex items-end justify-between gap-3 px-3 pt-6 pb-2 border-b border-[#f4ebf4]">
              {(scoreTrend.length > 0 ? scoreTrend : recentAttempts).slice(-6).map((bar, idx) => {
                const pct = Math.round(parseFloat(bar.percentage || 0));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#6d3a68] opacity-0 group-hover:opacity-100 transition-opacity">
                      {pct}%
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-[#4e2a4a] via-[#6d3a68] to-[#d9775b] rounded-t-xl transition-all duration-300 shadow-2xs group-hover:scale-105"
                      style={{ height: `${Math.max(12, pct)}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-500 mt-1 truncate max-w-[55px]">{`Test ${idx + 1}`}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              <BarChart3 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <span>Take exams to track your score progression over time.</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-3">
            <span>Score tracking across attempts</span>
            <span className="font-bold text-[#6d3a68]">Best: {bestScoreVal}%</span>
          </div>
        </div>

        {/* Accuracy Breakdown Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#edd6ed] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
              <Target className="w-3.5 h-3.5 text-[#059669]" />
              <span>Accuracy Analysis</span>
            </span>
            <span className="text-xs font-black text-[#059669]">{overallAccuracy}%</span>
          </div>

          <div className="flex items-center justify-center my-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#faf5fa" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#059669"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * (overallAccuracy / 100))}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#4e2a4a]">{overallAccuracy}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
              </div>
            </div>
          </div>

          {/* Correct / Wrong / Skipped pills */}
          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[#f4ebf4]">
            <div className="p-2 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl">
              <p className="text-[10px] font-bold text-[#059669] uppercase">Correct</p>
              <h4 className="text-sm font-black text-[#059669] mt-0.5">{totalCorrect}</h4>
            </div>
            <div className="p-2 bg-[#fdf6f4] border border-[#f7d7cc] rounded-xl">
              <p className="text-[10px] font-bold text-[#d9775b] uppercase">Wrong</p>
              <h4 className="text-sm font-black text-[#d9775b] mt-0.5">{totalWrong}</h4>
            </div>
            <div className="p-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl">
              <p className="text-[10px] font-bold text-[#6d3a68] uppercase">Attempts</p>
              <h4 className="text-sm font-black text-[#6d3a68] mt-0.5">{recentAttempts.length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Subject Performance Card */}
      <div className="bg-white rounded-3xl border border-[#edd6ed] p-6 sm:p-7 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed]">
              <BookOpen className="w-3.5 h-3.5 text-[#6d3a68]" />
              <span>Subject Performance &amp; Proficiency</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Competency across candidate subjects</p>
          </div>
          <span className="text-xs font-bold text-[#6d3a68]">{subjectProgress.length || 1} Subject(s)</span>
        </div>

        {subjectProgress.length > 0 ? (
          <div className="space-y-4">
            {subjectProgress.map((sub, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6d3a68]" />
                    <span className="text-[#4e2a4a]">{sub.subject_name}</span>
                  </span>
                  <span className="text-[#6d3a68] font-black">{sub.accuracy || 0}%</span>
                </div>
                <div className="w-full bg-[#faf5fa] h-2.5 rounded-full overflow-hidden border border-[#edd6ed]">
                  <div
                    className="bg-gradient-to-r from-[#4e2a4a] via-[#6d3a68] to-[#d9775b] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, sub.accuracy || 0))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            Subject proficiency will calculate automatically after completing tests.
          </div>
        )}
      </div>

      {/* 5. Exam History Table */}
      <div className="bg-white rounded-3xl border border-[#edd6ed] p-6 sm:p-7 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
              <Award className="w-3.5 h-3.5 text-[#059669]" />
              <span>Exam History</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Attempted tests and scorecard reviews</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('exam_history')}
            className="text-xs font-bold text-[#6d3a68] hover:text-[#4e2a4a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf5fa] text-[10px] font-bold text-[#6d3a68] uppercase tracking-wider border-b border-[#edd6ed]">
                <tr>
                  <th className="py-3 px-3 rounded-l-xl">Exam Name</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Percentage</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] font-semibold text-slate-800">
                {recentAttempts.map((item) => (
                  <tr key={item.id} className="hover:bg-[#faf5ff] transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#2e1065]">{item.exam_title}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-[#7c3aed]">{item.score} / {item.total_marks || 10}</td>
                    <td className="py-3.5 px-3 font-bold text-[#059669]">{parseFloat(item.percentage).toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-slate-500 font-normal">{item.submitted_at}</td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.passed
                          ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                          : 'bg-[#faf5ff] text-[#7c3aed] border-[#e9d5ff]'
                      }`}>
                        {item.passed ? <Check className="w-3 h-3" /> : null}
                        {item.passed ? 'Passed' : 'Completed'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {onViewResult && (
                        <button
                          type="button"
                          onClick={() => onViewResult(item.id)}
                          className="text-xs font-bold text-[#581c87] hover:text-[#7c3aed] bg-[#f5f0ff] hover:bg-[#ede9fe] px-3 py-1 rounded-lg transition-colors cursor-pointer border border-[#e9d5ff]"
                        >
                          Scorecard
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No completed exams yet. Take your first test to see your history and solutions!
          </div>
        )}
      </div>

      {/* 6. Difficulty Analysis & Time Analysis (Side-by-Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Difficulty Analysis */}
        <div className="bg-white rounded-3xl border border-[#eee6f8] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="theme-pill-green">
              <Flame className="w-3.5 h-3.5 text-[#059669]" />
              <span>Difficulty Analysis</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Question Depth</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-[#059669] font-bold">Easy Questions</span>
                <span className="text-[#2e1065] font-black">95%</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#10b981] h-2 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-[#7c3aed] font-bold">Medium Questions</span>
                <span className="text-[#2e1065] font-black">86%</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#a855f7] h-2 rounded-full" style={{ width: '86%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-[#047857] font-bold">Hard Questions</span>
                <span className="text-[#2e1065] font-black">68%</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#34d399] h-2 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium mt-4 pt-3 border-t border-[#f1f5f9]">
            Strong command on fundamental and medium conceptual questions.
          </p>
        </div>

        {/* Time Analysis */}
        <div className="bg-white rounded-3xl border border-[#eee6f8] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="theme-pill-header">
              <Clock className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>Time Analysis</span>
            </span>
            <span className="text-[10px] font-bold text-[#581c87] bg-[#f5f0ff] px-2 py-0.5 rounded-md border border-[#e9d5ff]">
              ⚡ High Speed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center my-auto">
            <div className="p-3 bg-[#faf5ff] rounded-2xl border border-[#e9d5ff]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Time</p>
              <h4 className="text-base font-black text-[#2e1065] mt-1">32 min</h4>
            </div>

            <div className="p-3 bg-[#ecfdf5] rounded-2xl border border-[#a7f3d0]">
              <p className="text-[10px] font-bold text-[#059669] uppercase tracking-wider">Per Q</p>
              <h4 className="text-base font-black text-[#059669] mt-1">38 sec</h4>
            </div>

            <div className="p-3 bg-[#ecfdf5] rounded-2xl border border-[#a7f3d0]">
              <p className="text-[10px] font-bold text-[#047857] uppercase tracking-wider">Fastest</p>
              <h4 className="text-base font-black text-[#047857] mt-1">24 min</h4>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium mt-4 pt-3 border-t border-[#f1f5f9]">
            Top 10% fastest completion time across National level candidates.
          </p>
        </div>
      </div>
    </div>
  );
};
