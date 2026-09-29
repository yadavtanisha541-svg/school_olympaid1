import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Trophy, Medal, Award, Search, Filter, Crown } from 'lucide-react';
import { Badge } from '../../components/Badge';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchExams = async () => {
    const res = await apiClient.get('/exams');
    if (res.success) setExams(res.data || []);
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/leaderboard', { exam_id: selectedExamId });
      if (res.success) setLeaderboard(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedExamId]);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-black text-xs flex items-center justify-center shadow-xs">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 border border-slate-300 font-black text-xs flex items-center justify-center">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-900 border border-amber-700/30 font-black text-xs flex items-center justify-center">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-amber-500" />
            <span>Olympiad Rankings & Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic tie-breaking rules (Score DESC, Time Taken ASC). Real-time leaderboard across exams.
          </p>
        </div>

        {/* Exam Selector */}
        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All-India Overall Championship</option>
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.title}</option>
          ))}
        </select>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-16">Rank</th>
              <th className="py-3.5 px-4">Candidate Profile</th>
              <th className="py-3.5 px-4">Class</th>
              <th className="py-3.5 px-4">{selectedExamId ? 'Exam' : 'Exams Attempted'}</th>
              <th className="py-3.5 px-4">{selectedExamId ? 'Score' : 'Total Points'}</th>
              <th className="py-3.5 px-4">{selectedExamId ? 'Percentage' : 'Avg Score'}</th>
              {selectedExamId && <th className="py-3.5 px-4">Time Taken</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400">Loading live rankings...</td></tr>
            ) : leaderboard.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400">No candidates on the leaderboard yet.</td></tr>
            ) : (
              leaderboard.map((item) => (
                <tr
                  key={item.student_id || item.attempt_id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    item.rank === 1 ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold">{getRankBadge(item.rank)}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{item.student_name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{item.student_login_id}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{item.class_name || 'Class 10'}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {selectedExamId ? item.exam_title : `${item.total_exams_attempted} exams`}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-sm">
                    {parseFloat(selectedExamId ? item.score : item.total_points).toFixed(1)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">
                    {parseFloat(selectedExamId ? item.percentage : item.avg_percentage).toFixed(1)}%
                  </td>
                  {selectedExamId && (
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {Math.floor(item.time_spent_seconds / 60)}m {item.time_spent_seconds % 60}s
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
