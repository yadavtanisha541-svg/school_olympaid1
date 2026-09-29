import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Clock, Award, CheckCircle2, Eye, FileText, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const ExamHistoryPage = ({ onViewResult, onViewSolutions, onViewCertificate }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/results/history');
      if (res.success) setHistory(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          My Examination History
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review previous test submissions, view detailed question-by-question solutions and access merit certificates.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Olympiad Title</th>
              <th className="py-3.5 px-4">Exam Type</th>
              <th className="py-3.5 px-4">Score</th>
              <th className="py-3.5 px-4">Percentage</th>
              <th className="py-3.5 px-4">Result</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400">Loading exam history...</td></tr>
            ) : history.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400">No completed exams found yet.</td></tr>
            ) : (
              history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{item.exam_title}</p>
                    <p className="text-[11px] font-mono text-slate-400">{item.exam_code}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={item.exam_type} size="sm">
                      {item.exam_type?.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-sm">
                    {parseFloat(item.score).toFixed(1)} / {parseFloat(item.exam_total_marks).toFixed(1)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-600 font-mono text-sm">
                    {parseFloat(item.percentage).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={item.passed ? 'success' : 'danger'} size="sm">
                      {item.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{item.submitted_at}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" size="xs" onClick={() => onViewResult(item.id)}>
                        Scorecard
                      </Button>
                      <Button variant="secondary" size="xs" onClick={() => onViewSolutions(item.id)}>
                        Solutions
                      </Button>
                      {item.certificate_id && (
                        <Button
                          variant="warning"
                          size="xs"
                          icon={Award}
                          onClick={() => onViewCertificate(item.certificate_id)}
                        >
                          Certificate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
