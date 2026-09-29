import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Activity, Search, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';

export const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/logs', { page, limit: 15, search });
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
    fetchLogs(1);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            System Audit & Activity Logs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of all user registrations, logins, question creations, exam submissions, and permission updates.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-12">#</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">Module</th>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Details / Metadata</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400">Loading audit trail...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400">No activity logs recorded yet.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                  <td className="py-3 px-4 text-slate-400">#{log.id}</td>
                  <td className="py-3 px-4 font-bold font-sans text-xs text-slate-900">{log.action}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-sans">
                    {log.user_name || log.user_role || 'Guest'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate font-mono text-[10px]">
                    {log.details_json || '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{log.ip_address}</td>
                  <td className="py-3 px-4 text-right text-slate-500">{log.created_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
          <span className="text-slate-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              icon={ChevronLeft}
              disabled={pagination.page <= 1}
              onClick={() => fetchLogs(pagination.page - 1)}
            >
              Prev
            </Button>
            <span className="font-bold text-slate-700 px-2">{pagination.page} / {pagination.total_pages}</span>
            <Button
              variant="secondary"
              size="xs"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => fetchLogs(pagination.page + 1)}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
