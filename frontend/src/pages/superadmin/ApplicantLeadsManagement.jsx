import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  UserCheck,
  Search,
  CheckCircle2,
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
  MessageCircle,
  Users,
  GraduationCap,
  Globe,
  Star,
  FileText,
  Calendar,
  Sparkles,
  Edit3
} from 'lucide-react';
import { Modal } from '../../components/Modal';

export const ApplicantLeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/applicant-leads');
      if (res.success && Array.isArray(res.data)) {
        setLeads(res.data);
      }
    } catch (e) {
      console.error('Error fetching applicant leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      await apiClient.post(`/applicant-leads/${id}/status`, { status });
      setLeads((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      if (selectedLead?.id === id) {
        setSelectedLead((prev) => ({ ...prev, status }));
      }
    } catch (e) {
      console.error('Failed to update applicant lead status:', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      await apiClient.post(`/applicant-leads/${selectedLead.id}/status`, {
        status: selectedLead.status || 'new',
        notes: notesText
      });
      setLeads((prev) =>
        prev.map((item) =>
          item.id === selectedLead.id ? { ...item, notes: notesText } : item
        )
      );
      setSelectedLead((prev) => ({ ...prev, notes: notesText }));
    } catch (e) {
      console.error('Failed to save lead notes:', e);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this applicant record?')) {
      return;
    }
    try {
      await apiClient.delete(`/applicant-leads/${id}`);
      setLeads((prev) => prev.filter((item) => item.id !== id));
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
    } catch (e) {
      console.error('Failed to delete applicant lead:', e);
    }
  };

  const filteredLeads = (leads || []).filter((item) => {
    if (!item) return false;
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = !q ||
      (item.candidate_name && item.candidate_name.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.mobile && item.mobile.toLowerCase().includes(q)) ||
      (item.school_name && item.school_name.toLowerCase().includes(q)) ||
      (item.applicant_id && item.applicant_id.toLowerCase().includes(q));

    const matchesStatus = filterStatus === 'All' || (item.status || 'new') === filterStatus;
    const matchesClass = filterClass === 'All' || item.class_name === filterClass;

    return matchesSearch && matchesStatus && matchesClass;
  });

  // Calculate Metrics
  const totalCount = leads.length;
  const newCount = leads.filter((l) => (l.status || 'new') === 'new').length;
  const contactedCount = leads.filter((l) => l.status === 'contacted').length;
  const enrolledCount = leads.filter((l) => l.status === 'enrolled').length;

  const exportCsv = () => {
    if (leads.length === 0) return;
    const headers = ['Ref ID', 'Candidate Name', 'Grade / Class', 'Country', 'School Name', 'Email', 'Mobile', 'Status', 'Notes', 'Submission Date'];
    const rows = filteredLeads.map((item) => [
      `"${item.applicant_id || ''}"`,
      `"${item.candidate_name || ''}"`,
      `"${item.class_name || ''}"`,
      `"${item.country || ''}"`,
      `"${item.school_name || ''}"`,
      `"${item.email || ''}"`,
      `"${item.mobile || ''}"`,
      `"${item.status || 'new'}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
      `"${item.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Applicant_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openLeadDetails = (lead) => {
    setSelectedLead(lead);
    setNotesText(lead.notes || '');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#122459] via-[#241e6e] to-[#5b3da8] p-6 rounded-md text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-sm bg-[#fbbf24] text-[#122459] text-[10px] font-black uppercase tracking-wider">
              Website Leads
            </span>
            <span className="text-xs text-indigo-200">Real-time Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            New Applicant Registrations &amp; Leads
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1">
            Direct student inquiries and enrollment submissions from the website home page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchLeads}
            disabled={loading}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={leads.length === 0}
            className="px-4 py-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#122459] rounded-md text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-md border border-[#c7d2fe] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Submissions</p>
            <h3 className="text-2xl font-black text-[#16327a] mt-0.5">{totalCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#eef2ff] border border-[#c7d2fe] flex items-center justify-center text-[#16327a]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">New Action Required</p>
            <h3 className="text-2xl font-black text-amber-600 mt-0.5">{newCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-indigo-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Contacted Leads</p>
            <h3 className="text-2xl font-black text-indigo-700 mt-0.5">{contactedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <MessageCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Enrolled / Confirmed</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{enrolledCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-md border border-[#e2e8f0] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by candidate name, email, mobile, school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-semibold text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
            />
          </div>

          {/* Status & Class Filters */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-bold text-[#16327a] focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
              >
                <option value="All">All Statuses</option>
                <option value="new">New (Unread)</option>
                <option value="contacted">Contacted</option>
                <option value="enrolled">Enrolled</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed / Inactive</option>
              </select>
            </div>

            {/* Class Filter */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-2.5 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-bold text-[#16327a] focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
            >
              <option value="All">All Classes</option>
              {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Leads Table */}
      <div className="bg-white rounded-md border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] text-[#16327a] border-b border-[#e2e8f0] font-black uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Applicant Ref &amp; Date</th>
                <th className="py-3 px-4">Candidate &amp; School</th>
                <th className="py-3 px-4">Grade &amp; Country</th>
                <th className="py-3 px-4">Contact Channels</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#5b3da8] mb-2" />
                    <span>Loading applicant registrations...</span>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <UserCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-base font-black text-[#16327a]">No applicant registrations found.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery || filterStatus !== 'All' || filterClass !== 'All'
                        ? 'Try adjusting your search criteria.'
                        : 'New student registrations submitted on the home page will appear here automatically.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((item) => {
                  const rawMobile = (item.mobile || '').replace(/\D/g, '');
                  const waNumber = rawMobile.length === 10 ? `91${rawMobile}` : rawMobile;

                  return (
                    <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors group">
                      {/* Ref ID & Date */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-black text-[#16327a] text-[11px]">
                          {item.applicant_id || `APP-2026-${item.id}`}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent'}</span>
                        </div>
                      </td>

                      {/* Candidate Name & School */}
                      <td className="py-3 px-4">
                        <div className="font-black text-[#16327a] text-sm">
                          {item.candidate_name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">
                            {item.school_name || 'Not Specified'}
                          </span>
                        </div>
                      </td>

                      {/* Grade & Country */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#eef2ff] border border-[#c7d2fe] text-[#16327a] font-bold text-[11px]">
                          <GraduationCap className="w-3 h-3 text-[#5b3da8]" />
                          <span>{item.class_name}</span>
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span>{item.country || 'India'}</span>
                        </div>
                      </td>

                      {/* Contact Info & 1-Click WhatsApp */}
                      <td className="py-3 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                          <Mail className="w-3.5 h-3.5 text-[#5b3da8] shrink-0" />
                          <a href={`mailto:${item.email}`} className="hover:underline text-slate-700">
                            {item.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-slate-600 font-bold">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.mobile}</span>
                          </div>

                          {/* WhatsApp Direct Chat Button */}
                          {rawMobile && (
                            <a
                              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${item.candidate_name}, thank you for registering with SkillRise Olympiads for ${item.class_name}. How can we assist you today?`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-sm text-[10px] font-bold transition-colors cursor-pointer"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4">
                        <select
                          value={item.status || 'new'}
                          disabled={actionLoading === item.id}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-2 py-1 rounded-sm text-[11px] font-extrabold border cursor-pointer focus:outline-none ${
                            item.status === 'enrolled'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : item.status === 'contacted'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                              : item.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : item.status === 'closed'
                              ? 'bg-slate-100 text-slate-600 border-slate-300'
                              : 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse-subtle'
                          }`}
                        >
                          <option value="new">★ New Lead</option>
                          <option value="contacted">💬 Contacted</option>
                          <option value="enrolled">✓ Enrolled</option>
                          <option value="pending">⏳ Pending</option>
                          <option value="closed">✕ Closed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openLeadDetails(item)}
                            className="p-1.5 bg-[#f8fafc] hover:bg-[#eef2ff] text-[#16327a] border border-[#e2e8f0] rounded-sm transition-colors cursor-pointer"
                            title="View Full Lead & Notes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-sm transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Lead Details & Notes Modal */}
      {selectedLead && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLead(null)}
          title={`Applicant Lead: ${selectedLead.candidate_name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-[#f8fafc] p-3.5 rounded-md border border-[#e2e8f0]">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applicant ID</p>
                <p className="font-mono font-black text-[#16327a] text-xs mt-0.5">{selectedLead.applicant_id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grade Level</p>
                <p className="font-bold text-[#16327a] mt-0.5">{selectedLead.class_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Email</p>
                <a href={`mailto:${selectedLead.email}`} className="font-bold text-[#5b3da8] hover:underline mt-0.5 block">
                  {selectedLead.email}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</p>
                <p className="font-bold text-[#16327a] mt-0.5">{selectedLead.mobile}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Country</p>
                <p className="font-semibold text-slate-700 mt-0.5">{selectedLead.country || 'India'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">School Name</p>
                <p className="font-semibold text-slate-700 mt-0.5">{selectedLead.school_name || 'Not Provided'}</p>
              </div>
            </div>

            {/* Internal Counselor Notes / Follow-up Remarks */}
            <div className="space-y-1.5">
              <label className="block font-black text-[#16327a] text-xs flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#5b3da8]" />
                <span>Counselor Follow-up Notes &amp; Remarks</span>
              </label>
              <textarea
                rows={3}
                placeholder="Add notes e.g., 'Called parent on 05-Oct, interested in Math & Science Olympiad. Sent fee link.'"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="w-full p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-xs font-semibold text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b3da8]"
              />
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-2 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be185d] text-white rounded-md text-xs font-bold transition-all cursor-pointer disabled:opacity-50 border border-white/20"
                >
                  {savingNotes ? 'Saving Notes...' : 'Save Remarks'}
                </button>
              </div>
            </div>

            {/* Quick Actions in Modal */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${(selectedLead.mobile || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedLead.candidate_name}, this is from SkillRise Olympiads regarding your registration.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Message</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
