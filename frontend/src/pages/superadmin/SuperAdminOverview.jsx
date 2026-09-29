import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  Users,
  GraduationCap,
  FileSpreadsheet,
  HelpCircle,
  Award,
  TrendingUp,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  BookOpen,
  Calendar
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

export const SuperAdminOverview = ({ onNavigateTab }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/superadmin');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Super Administrator Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time examination statistics, subject proficiency, and system audit feed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('question_bank')}>
            Question Bank
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigateTab('exams')}>
            Create Exam
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={metrics.total_students || 0}
          subtitle="Enrolled across classes"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Active Teachers"
          value={metrics.total_teachers || 0}
          subtitle="Faculty & evaluators"
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="Total Exams"
          value={metrics.total_exams || 0}
          subtitle={`${metrics.active_exams || 0} live published`}
          icon={FileSpreadsheet}
          color="brand"
        />
        <StatCard
          title="Questions in Bank"
          value={metrics.total_questions || 0}
          subtitle="Across all subjects"
          icon={HelpCircle}
          color="amber"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Attempts</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_attempts || 0}</h4>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Platform Score</p>
          <h4 className="text-2xl font-bold text-brand-600 mt-1">{metrics.avg_score || 0}%</h4>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Pass Rate</p>
          <h4 className="text-2xl font-bold text-emerald-600 mt-1">{metrics.pass_percentage || 0}%</h4>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-slate-800">Operational</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Subject Performance & Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Accuracy Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subject Accuracy & Performance</h3>
              <p className="text-xs text-slate-500">Calculated from actual student exam submissions</p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {(data?.subject_performance || []).map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{sub.subject_name}</span>
                  <span className="font-bold text-slate-900">{sub.accuracy || 0}% accuracy</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(5, sub.accuracy || 0))}%`,
                      backgroundColor: sub.color || '#4F46E5'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Exam Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Candidate Submissions</h3>
              <p className="text-xs text-slate-500">Latest evaluated Olympiad attempts</p>
            </div>
            <Button variant="ghost" size="xs" onClick={() => onNavigateTab('results')}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {(data?.recent_results || []).map((res, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{res.student_name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{res.exam_title}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold font-mono text-slate-900">{parseFloat(res.score).toFixed(1)} pts</span>
                  <Badge variant={res.passed ? 'success' : 'danger'} size="sm">
                    {res.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Activity Logs Summary */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Administrative Audit Logs</h3>
            <p className="text-xs text-slate-500">Security and activity events logged in database</p>
          </div>
          <Button variant="ghost" size="xs" onClick={() => onNavigateTab('activity_logs')}>
            View Full Audit Log
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3 px-2">Action</th>
                <th className="pb-3 px-2">Module</th>
                <th className="pb-3 px-2">User / Initiator</th>
                <th className="pb-3 px-2">IP Address</th>
                <th className="pb-3 px-2">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.recent_logs || []).map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-2 font-semibold text-slate-900">{log.action}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px]">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-600 font-medium">
                    {log.user_name || log.user_role || 'System'}
                  </td>
                  <td className="py-3 px-2 font-mono text-slate-500">{log.ip_address}</td>
                  <td className="py-3 px-2 text-slate-500">{log.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
