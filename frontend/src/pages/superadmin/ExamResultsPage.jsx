import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { FileCheck2, Search, Award, CheckCircle2, XCircle, Eye, Clock, BarChart3 } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const ExamResultsPage = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [resRes, exRes] = await Promise.all([
        apiClient.get('/analytics/superadmin'),
        apiClient.get('/exams')
      ]);
      if (resRes.success && resRes.data) {
        setResults(resRes.data.recent_results || []);
      }
      if (exRes.success) {
        setExams(exRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleViewScorecard = async (attemptId) => {
    try {
      const [rRes, sRes] = await Promise.all([
        apiClient.get(`/results/${attemptId}`),
        apiClient.get(`/results/${attemptId}/solutions`)
      ]);
      if (rRes.success) setSelectedResult(rRes.data);
      if (sRes.success) setSolutions(sRes.data || []);
      setShowDetailModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Examination Results & Scorecards
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Detailed performance evaluation, question-wise breakdown, and accuracy metrics.
        </p>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Candidate Name</th>
              <th className="py-3.5 px-4">Exam Title</th>
              <th className="py-3.5 px-4">Score</th>
              <th className="py-3.5 px-4">Percentage</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Submitted At</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400">No exam results available yet.</td></tr>
            ) : (
              results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{r.student_name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{r.student_login_id}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{r.exam_title}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">{parseFloat(r.score).toFixed(1)}</td>
                  <td className="py-3.5 px-4 font-bold text-brand-600 font-mono">{parseFloat(r.percentage).toFixed(1)}%</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={r.passed ? 'success' : 'danger'} size="sm">
                      {r.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{r.submitted_at}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="secondary" size="xs" icon={Eye} onClick={() => handleViewScorecard(r.id)}>
                      Scorecard
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILED SCORECARD MODAL */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Candidate Performance Scorecard"
        subtitle={`Candidate: ${selectedResult?.student_name} (${selectedResult?.student_login_id})`}
        maxWidth="max-w-3xl"
        footer={<Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>}
      >
        {selectedResult && (
          <div className="space-y-6 text-xs">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Final Score</span>
                <span className="text-xl font-black text-slate-900 font-mono">{parseFloat(selectedResult.score).toFixed(1)}</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-[10px] text-emerald-600 font-bold block uppercase">Percentage</span>
                <span className="text-xl font-black text-emerald-700 font-mono">{parseFloat(selectedResult.percentage).toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
                <span className="text-[10px] text-indigo-600 font-bold block uppercase">Accuracy</span>
                <span className="text-xl font-black text-indigo-700 font-mono">{selectedResult.accuracy || 0}%</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <span className="text-[10px] text-amber-600 font-bold block uppercase">Olympiad Rank</span>
                <span className="text-xl font-black text-amber-700 font-mono">{selectedResult.rank_exam ? `#${selectedResult.rank_exam}` : 'Merit'}</span>
              </div>
            </div>

            {/* Solutions Question list */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Question-by-Question Evaluation</h4>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {solutions.map((sol, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border bg-slate-50/60 border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-800">Q{idx + 1}. {sol.question_text}</span>
                      <Badge variant={sol.is_correct ? 'success' : sol.selected_option ? 'danger' : 'default'} size="sm">
                        {sol.is_correct ? 'CORRECT' : sol.selected_option ? 'WRONG' : 'UNANSWERED'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                      <div className="p-1.5 bg-white border rounded-md">
                        <span className="text-slate-400 block font-bold">Candidate Selected:</span>
                        <span className="font-bold">{sol.selected_option ? `Option ${sol.selected_option}` : 'Not Answered'}</span>
                      </div>
                      <div className="p-1.5 bg-white border rounded-md">
                        <span className="text-emerald-600 block font-bold">Correct Option:</span>
                        <span className="font-bold text-emerald-700">Option {sol.correct_option}</span>
                      </div>
                    </div>
                    {sol.explanation && (
                      <p className="mt-2 text-[11px] text-slate-600 italic bg-amber-50/60 p-2 rounded-md border border-amber-200/50">
                        {sol.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
