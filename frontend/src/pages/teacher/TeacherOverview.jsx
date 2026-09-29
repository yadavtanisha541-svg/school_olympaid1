import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  Users,
  FileSpreadsheet,
  HelpCircle,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Plus
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

export const TeacherOverview = ({ onNavigateTab }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/teacher');
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
    return <div className="p-8 text-center text-slate-400">Loading faculty dashboard...</div>;
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Faculty & Evaluator Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Question bank authoring, exam generation, and student performance tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('question_bank')}>
            Manage Questions
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigateTab('exams')}>
            Create Exam
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={metrics.total_students || 0}
          subtitle="Enrolled students"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="My Created Exams"
          value={metrics.total_exams || 0}
          subtitle={`${metrics.active_exams || 0} active/published`}
          icon={FileSpreadsheet}
          color="brand"
        />
        <StatCard
          title="Live Published Exams"
          value={metrics.active_exams || 0}
          subtitle="Ready for candidate attempts"
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Questions in Bank"
          value={metrics.question_bank_count || 0}
          subtitle="Questions authored"
          icon={HelpCircle}
          color="amber"
        />
      </div>

      {/* Recent Exams & Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exams Created */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Exams Created</h3>
            <Button variant="ghost" size="xs" onClick={() => onNavigateTab('exams')}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {(data?.recent_exams || []).map((exam) => (
              <div key={exam.id} className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{exam.title}</p>
                  <p className="text-[11px] text-slate-500">{exam.class_name} • {exam.duration_minutes} mins</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 font-mono">{exam.attempts_count || 0} attempts</span>
                  <Badge variant={exam.status === 'published' ? 'published' : 'draft'} size="sm" className="block mt-1">
                    {exam.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Subject Accuracy & Proficiency</h3>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {(data?.subject_performance || []).map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{sub.subject_name}</span>
                  <span className="font-bold text-slate-900">{sub.accuracy || 0}% accuracy</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
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
      </div>
    </div>
  );
};
