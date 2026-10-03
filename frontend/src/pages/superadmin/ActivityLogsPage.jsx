import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  Activity,
  Search,
  Shield,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trash2,
  X,
  Filter,
  AlertTriangle,
  Lock,
  User,
  FileCheck2,
  HelpCircle,
  Layers,
  Settings
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

export const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Clear all confirmation modal
  const [showClearModal, setShowClearModal] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/logs', {
        page,
        limit: 15,
        search,
        module: selectedModule
      });
      if (res.success && res.data) {
        setLogs(res.data.logs || []);
        setPagination(res.data.pagination || { page: 1, limit: 15, total: 0, total_pages: 1 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage, search, selectedModule]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedModule('');
    setCurrentPage(1);
  };

  const handleClearAllLogs = async () => {
    try {
      setActionLoading(true);
      const res = await apiClient.delete('/analytics/logs');
      if (res.success) {
        setFeedback({ type: 'success', message: 'All audit activity logs cleared successfully.' });
        setShowClearModal(false);
        fetchLogs(1);
      }
    } catch (err) {
      alert(err.message || 'Failed to clear logs.');
    } finally {
      setActionLoading(false);
    }
  };

  const getModuleBadge = (module) => {
    switch (module) {
      case 'Auth':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'User':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Exams':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ExamEngine':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'QuestionBank':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Academic':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Settings':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            System Audit & Activity Logs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable audit trail of user logins, registrations, question updates, exam submissions, and administrative events.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Logs</span>
          </button>
        </div>
      </div>

      {feedback.message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between shadow-xs">
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Compact Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search audit trail by user, action, or IP address..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown & Clear Action */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-64 h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="">All Activity Categories</option>
            <option value="Auth">🔑 Authentication & Logins</option>
            <option value="User">👤 User Management</option>
            <option value="Exams">📝 Exams & Olympiads</option>
            <option value="ExamEngine">⏱️ Exam Submissions</option>
            <option value="QuestionBank">❓ Question Bank</option>
            <option value="Academic">🏫 Academic Architecture</option>
            <option value="Settings">⚙️ System Settings</option>
          </select>

          {(search || selectedModule) && (
            <button
              type="button"
              onClick={handleClearFilters}
              title="Clear Filters"
              className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 border border-slate-200/60 shadow-2xs shrink-0 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-3 w-10 text-center">#</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Details / Metadata</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No activity logs found for the selected filter criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => {
                  const indexNumber = (pagination.page - 1) * pagination.limit + idx + 1;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-400 text-xs">
                        {indexNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 text-xs">
                        {log.action}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getModuleBadge(log.module)}`}>
                          {log.module}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span>{log.user_name || log.user_role || 'System'}</span>
                          {log.login_id && (
                            <span className="text-[10px] font-mono text-slate-400">({log.login_id})</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate font-mono text-[11px]">
                        {log.details_json || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {log.ip_address || '127.0.0.1'}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 font-medium text-[11px]">
                        {log.created_at}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && pagination.total > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
            <div className="text-xs font-semibold text-slate-500">
              Showing <span className="font-bold text-slate-900">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-bold text-slate-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-bold text-slate-900">{pagination.total}</span> audit records
            </div>

            {pagination.total_pages > 1 && (
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        pageNum === pagination.page
                          ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30 font-extrabold'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={pagination.page >= pagination.total_pages}
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.total_pages, prev + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CLEAR ALL LOGS CONFIRMATION MODAL */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All Audit & Activity Logs"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure you want to permanently clear all logs?</p>
              <p className="text-[11px] text-rose-700 mt-1">
                This action will permanently delete all past security audit trail records from the database. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowClearModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={actionLoading} onClick={handleClearAllLogs}>
              Yes, Clear All Logs
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
