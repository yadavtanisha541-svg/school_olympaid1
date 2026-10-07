import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Trophy, Medal, Award, Search, Filter, Crown, Download } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

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

  const handleExportCSV = () => {
    if (!leaderboard || leaderboard.length === 0) {
      alert('No leaderboard data to export.');
      return;
    }

    const headers = ['Rank', 'Candidate Name', 'Student ID', 'School', 'Class', selectedExamId ? 'Exam' : 'Exams Attempted', selectedExamId ? 'Score' : 'Total Points', selectedExamId ? 'Percentage (%)' : 'Avg Score (%)', 'Time Taken'];
    const rows = leaderboard.map(item => [
      item.rank || '',
      `"${(item.student_name || item.name || 'Student Candidate').toString().replace(/"/g, '""')}"`,
      `"${(item.student_login_id || item.login_id || item.student_id || '').toString().replace(/"/g, '""')}"`,
      `"${(item.school || item.school_name || '').toString().replace(/"/g, '""')}"`,
      `"${(item.class_name || '').toString().replace(/"/g, '""')}"`,
      `"${(selectedExamId ? item.exam_title : `${item.total_exams_attempted || 0} exams`).toString().replace(/"/g, '""')}"`,
      parseFloat(selectedExamId ? item.score : item.total_points || 0).toFixed(1),
      parseFloat(selectedExamId ? item.percentage : item.avg_percentage || 0).toFixed(1),
      item.time_spent_seconds ? `${Math.floor(item.time_spent_seconds / 60)}m ${item.time_spent_seconds % 60}s` : 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `olympiad_leaderboard_export_${selectedExamId ? `exam_${selectedExamId}` : 'overall'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#4e2a4a] flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#e7b84b]" />
            <span>Olympiad Rankings &amp; Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic tie-breaking rules (Score DESC, Time Taken ASC). Real-time leaderboard across exams.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Exam Selector */}
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="px-4 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] shadow-xs focus:outline-none focus:border-[#6d3a68] cursor-pointer"
          >
            <option value="">All-India Overall Championship</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.title}</option>
            ))}
          </select>

          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export Leaderboard (CSV)
          </Button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-[#edd6ed] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf5fa] border-b border-[#edd6ed] text-[#6d3a68] font-bold uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-[#fdf2f8]">
              {loading ? (
                <tr><td colSpan="7" className="py-10 text-center text-slate-400">Loading live rankings...</td></tr>
              ) : leaderboard.length === 0 ? (
                <tr><td colSpan="7" className="py-10 text-center text-slate-400">No candidates on the leaderboard yet.</td></tr>
              ) : (
                leaderboard.map((item) => (
                  <tr
                    key={item.student_id || item.attempt_id}
                    className={`hover:bg-[#faf5fa] transition-colors ${
                      item.rank === 1 ? 'bg-[#faf4e0]/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold">{getRankBadge(item.rank)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {((item.student_name || item.name || 'S')).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-[13px]">
                            {item.student_name || item.name || item.full_name || 'Student Candidate'}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500">
                            {item.student_login_id || item.login_id || `ID: #${item.student_id || 'STU'}`}
                          </p>
                          {(item.school || item.school_name) && (
                            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                              {item.school || item.school_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed]">
                        {item.class_name || 'Class 10'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {selectedExamId ? item.exam_title : `${item.total_exams_attempted} exams`}
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#4e2a4a] font-mono text-sm">
                      {parseFloat(selectedExamId ? item.score : item.total_points).toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 font-mono">
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
    </div>
  );
};
