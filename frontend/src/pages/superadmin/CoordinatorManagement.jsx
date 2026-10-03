import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  UserCheck,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { Modal } from '../../components/Modal';

export const CoordinatorManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/coordinator/inquiries');
      if (res.success && Array.isArray(res.data)) {
        setInquiries(res.data);
      }
    } catch (e) {
      console.error('Error fetching coordinator inquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      await apiClient.post(`/coordinator/inquiries/${id}/status`, { status });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (e) {
      console.error('Failed to update inquiry status:', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/coordinator/inquiries/${id}`);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (e) {
      console.error('Failed to delete inquiry:', e);
    }
  };

  const filteredInquiries = (inquiries || []).filter((item) => {
    if (!item) return false;
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = !q ||
      (item.name && (item.name || '').toLowerCase().includes(q)) ||
      (item.email && (item.email || '').toLowerCase().includes(q)) ||
      (item.phone && (item.phone || '').toLowerCase().includes(q)) ||
      (item.school_name && (item.school_name || '').toLowerCase().includes(q)) ||
      (item.city && (item.city || '').toLowerCase().includes(q));

    const matchesStatus = filterStatus === 'All' || (item.status || 'pending') === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const exportCsv = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', 'Applicant Name', 'Email', 'Phone', 'City', 'School/Org', 'Experience', 'Status', 'Date'];
    const rows = filteredInquiries.map((item) => [
      `"${item.id}"`,
      `"${item.name || ''}"`,
      `"${item.email || ''}"`,
      `"${item.phone || ''}"`,
      `"${item.city || ''}"`,
      `"${item.school_name || ''}"`,
      `"${item.experience || ''}"`,
      `"${item.status || 'pending'}"`,
      `"${item.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SkillRise_Coordinator_Applicants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#4e2a4a]">
            Coordinators &amp; New Teacher Applicants
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review educator inquiries, regional coordinator applications, and prospective institutional partners.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchInquiries}
            className="p-2 bg-white border border-[#edd6ed] text-[#6d3a68] hover:bg-[#faf5fa] rounded-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Refresh List"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={exportCsv}
            disabled={inquiries.length === 0}
            className="px-3.5 py-2 bg-[#6d3a68] hover:bg-[#5c3158] text-white rounded-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#e7b84b]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-sm border border-[#edd6ed] shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Applications</p>
          <p className="text-2xl font-black text-[#4e2a4a] mt-1">{inquiries.length}</p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-[#edd6ed] shadow-2xs">
          <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">New / Pending</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {inquiries.filter((i) => (i.status || 'pending') === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-[#edd6ed] shadow-2xs">
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Contacted / Interview</p>
          <p className="text-2xl font-black text-blue-700 mt-1">
            {inquiries.filter((i) => i.status === 'contacted').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-[#edd6ed] shadow-2xs">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Approved Coordinators</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {inquiries.filter((i) => i.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-sm border border-[#edd6ed] shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by applicant name, email, phone, city, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#faf5fa] border border-[#edd6ed] rounded-sm text-xs font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-[#edd6ed] rounded-sm text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-sm border border-[#edd6ed] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2a1b29]">
            <thead className="bg-[#faf5fa] text-[#4e2a4a] font-bold uppercase tracking-wider text-[10px] border-b border-[#edd6ed]">
              <tr>
                <th className="py-3 px-4">Applicant &amp; Date</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">School / Organization</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fdf2f8]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#6d3a68] mb-2" />
                    <span>Loading coordinator inquiries from database...</span>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <UserCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-[#4e2a4a]">No coordinator applications found.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {searchQuery ? 'Try adjusting your search query.' : 'New submissions from the "Become a Coordinator" page will appear here.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const status = inq.status || 'pending';
                  return (
                    <tr key={inq.id} className="hover:bg-[#faf5fa] transition-colors">
                      <td className="py-3 px-4 align-top">
                        <p className="font-bold text-[#4e2a4a] text-sm leading-tight">{inq.name}</p>
                        <span className="text-[10px] text-slate-400">
                          {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top space-y-0.5">
                        <p className="text-[11px] text-slate-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#d9775b]" />
                          <span className="select-all">{inq.email}</span>
                        </p>
                        <p className="text-[11px] text-slate-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#d9775b]" />
                          <span className="select-all">{inq.phone}</span>
                        </p>
                        {inq.city && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            City: {inq.city}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <p className="font-semibold text-slate-800">
                          {inq.school_name || 'Independent Educator'}
                        </p>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span className="text-xs font-medium text-slate-600">
                          {inq.experience || 'Educator'}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : status === 'contacted'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 text-[#6d3a68] hover:bg-[#f4ebf4] rounded-sm transition-colors cursor-pointer"
                          title="View Inquiry Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(inq.id, 'approved')}
                            disabled={actionLoading === inq.id}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-sm transition-colors cursor-pointer"
                            title="Approve Coordinator"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {status !== 'contacted' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(inq.id, 'contacted')}
                            disabled={actionLoading === inq.id}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors cursor-pointer"
                            title="Mark Contacted"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(inq.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Message Modal */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Coordinator Application Details"
        maxWidth="max-w-xl"
      >
        {selectedInquiry && (
          <div className="space-y-4 text-xs text-[#2a1b29]">
            <div className="p-4 bg-[#faf5fa] rounded-sm border border-[#edd6ed] flex items-center justify-between">
              <div>
                <p className="text-base font-black text-[#4e2a4a]">{selectedInquiry.name}</p>
                <p className="text-xs text-slate-500">{selectedInquiry.school_name || 'Independent Coordinator'}</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[11px] font-bold capitalize">
                {selectedInquiry.status || 'pending'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-bold block">Email Address:</span>
                <p className="font-semibold select-all text-slate-800">{selectedInquiry.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Contact Phone:</span>
                <p className="font-semibold select-all text-slate-800">{selectedInquiry.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Location / City:</span>
                <p className="font-semibold text-slate-800">{selectedInquiry.city || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Experience:</span>
                <p className="font-semibold text-slate-800">{selectedInquiry.experience || 'Educator'}</p>
              </div>
            </div>

            {selectedInquiry.message && (
              <div className="p-3 bg-white rounded-sm border border-slate-200">
                <span className="text-slate-400 font-bold block mb-1">Applicant Message / Motivation:</span>
                <p className="text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-[#edd6ed] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 bg-white border border-[#edd6ed] text-[#4e2a4a] hover:bg-[#faf5fa] rounded-sm text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
