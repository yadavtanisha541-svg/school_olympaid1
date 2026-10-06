import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  Building2,
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
  MapPin,
  BookOpen,
  UserCheck,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { Modal } from '../../components/Modal';

export const SchoolManagement = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBoard, setFilterBoard] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/schools/registrations');
      if (res.success && Array.isArray(res.data)) {
        setSchools(res.data);
      }
    } catch (e) {
      console.error('Error fetching schools:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      await apiClient.post(`/schools/registrations/${id}/status`, { status });
      setSchools((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status, user_status: status === 'approved' ? 'active' : 'inactive' } : s))
      );
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/schools/registrations/${id}`);
      setSchools((prev) => prev.filter((s) => s.id !== id));
      if (selectedSchool?.id === id) {
        setSelectedSchool(null);
      }
    } catch (e) {
      console.error('Failed to delete school:', e);
    }
  };

  const filteredSchools = (schools || []).filter((s) => {
    if (!s) return false;
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = !q ||
      (s.school_name && (s.school_name || '').toLowerCase().includes(q)) ||
      (s.registration_number && (s.registration_number || '').toLowerCase().includes(q)) ||
      (s.principal_name && (s.principal_name || '').toLowerCase().includes(q)) ||
      (s.teacher_name && (s.teacher_name || '').toLowerCase().includes(q)) ||
      (s.email && (s.email || '').toLowerCase().includes(q)) ||
      (s.city && (s.city || '').toLowerCase().includes(q));

    const matchesBoard = filterBoard === 'All' || (s.school_board && s.school_board.includes(filterBoard));
    const matchesStatus = filterStatus === 'All' || (s.status || 'approved') === filterStatus;

    return matchesSearch && matchesBoard && matchesStatus;
  });

  const exportCsv = () => {
    if (schools.length === 0) return;
    const headers = ['Reg ID', 'School Name', 'Board', 'Principal', 'Coordinator', 'Email', 'Phone', 'City', 'State', 'Status', 'Date'];
    const rows = filteredSchools.map((s) => [
      `"${s.registration_number || s.id}"`,
      `"${s.school_name || ''}"`,
      `"${s.school_board || ''}"`,
      `"${s.principal_name || ''}"`,
      `"${s.teacher_name || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.city || ''}"`,
      `"${s.state || ''}"`,
      `"${s.status || 'approved'}"`,
      `"${s.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SkillRise_Registered_Schools_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-[#80497D]/10 text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-xs">
            <Building2 className="w-7 h-7 text-[#80497D]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#422240] tracking-tight">
              School Registrations &amp; Institutional Applicants
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Real-time directory of all institutions registered for the SkillRise Olympiads examination cycle.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={fetchSchools}
            className="px-4 py-2.5 bg-white border border-[#edd6ed] text-[#6d3a68] hover:bg-[#faf5fa] rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={exportCsv}
            disabled={schools.length === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-[#5b3da8] to-[#16327a] hover:from-[#4d3291] hover:to-[#122459] text-white rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-blue-950/20 disabled:opacity-50 border border-[#7854d6]/30"
          >
            <Download className="w-4 h-4 text-[#e7b84b]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f4eaf4] text-[#80497D] flex items-center justify-center border border-[#ebd7eb] shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Schools</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#80497D] mt-0.5 font-mono">{schools.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Partner institutions</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved &amp; Active</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5 font-mono">
              {schools.filter((s) => (s.status || 'approved') === 'approved').length}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Verified schools</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Verification</p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-0.5 font-mono">
              {schools.filter((s) => s.status === 'pending').length}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Awaiting review</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Student Reach</p>
            <h3 className="text-2xl sm:text-3xl font-black text-blue-600 mt-0.5 font-mono">
              {schools.length > 0 ? `${schools.length * 150}+` : '0'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Potential candidates</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#edd6ed] shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by school name, principal, coordinator, city, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-sm font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68]"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={filterBoard}
            onChange={(e) => setFilterBoard(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[#edd6ed] rounded-xl text-sm font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] cursor-pointer"
          >
            <option value="All">All Boards</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE / CISCE</option>
            <option value="State">State Boards</option>
            <option value="IB">IB Board</option>
            <option value="Cambridge">Cambridge</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[#edd6ed] rounded-xl text-sm font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#edd6ed] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2a1b29]">
            <thead className="bg-[#faf5fa] text-[#4e2a4a] font-bold uppercase tracking-wider text-xs border-b border-[#edd6ed]">
              <tr>
                <th className="py-3.5 px-4">Reg ID &amp; Date</th>
                <th className="py-3.5 px-4">School &amp; Board</th>
                <th className="py-3.5 px-4">Principal &amp; Coordinator</th>
                <th className="py-3.5 px-4">Contact &amp; Location</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fdf2f8]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#6d3a68] mb-2" />
                    <span className="text-sm font-bold">Loading registered schools from database...</span>
                  </td>
                </tr>
              ) : filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-base sm:text-lg font-black text-[#4e2a4a]">No school registrations found.</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {searchQuery ? 'Try adjusting your search criteria.' : 'New school registration submissions will appear here automatically.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => {
                  const status = school.status || 'approved';
                  return (
                    <tr key={school.id} className="hover:bg-[#faf5fa] transition-colors">
                      <td className="py-3 px-4 align-top">
                        <span className="font-mono font-bold text-[#6d3a68] block">
                          {school.registration_number || `SCH-${school.id}`}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {school.created_at ? new Date(school.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <p className="font-bold text-[#4e2a4a] leading-tight">
                          {school.school_name}
                        </p>
                        <span className="inline-block px-1.5 py-0.5 rounded-xs bg-[#f4ebf4] text-[#6d3a68] font-semibold text-[10px] mt-1">
                          {school.school_board || 'CBSE'}
                        </span>
                        {school.school_code && (
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                            Code: {school.school_code}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top space-y-0.5">
                        <p className="font-semibold text-slate-800">
                          <strong>P:</strong> {school.principal_name || 'N/A'}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          <strong>Coord:</strong> {school.teacher_name || 'N/A'} ({school.designation || 'In-Charge'})
                        </p>
                      </td>

                      <td className="py-3 px-4 align-top space-y-0.5">
                        <p className="text-[11px] text-slate-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#d9775b]" />
                          <span>{school.email}</span>
                        </p>
                        <p className="text-[11px] text-slate-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#d9775b]" />
                          <span>{school.phone}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{school.city ? `${school.city}, ${school.state}` : school.address}</span>
                        </p>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span className="text-xs font-semibold text-slate-700 block">
                          {school.student_count || '100-250'}
                        </span>
                        {Array.isArray(school.selected_subjects) && school.selected_subjects.length > 0 && (
                          <span className="text-[10px] text-[#8c4e8b] font-bold block mt-0.5">
                            {school.selected_subjects.length} Subjects Selected
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
                          onClick={() => setSelectedSchool(school)}
                          className="p-1.5 text-[#6d3a68] hover:bg-[#f4ebf4] rounded-sm transition-colors cursor-pointer"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(school.id, 'approved')}
                            disabled={actionLoading === school.id}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-sm transition-colors cursor-pointer"
                            title="Approve School"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(school.id, 'rejected')}
                            disabled={actionLoading === school.id}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-sm transition-colors cursor-pointer"
                            title="Reject / Put On Hold"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(school.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
                          title="Delete School Record"
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

      {/* School Details Modal */}
      <Modal
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
        title="Institution Registration Details"
        maxWidth="max-w-2xl"
      >
        {selectedSchool && (
          <div className="space-y-5 text-xs text-[#2a1b29]">
            
            <div className="p-4 bg-[#faf5fa] rounded-sm border border-[#edd6ed] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Registration Number
                </span>
                <p className="text-base font-black text-[#6d3a68] font-mono select-all">
                  {selectedSchool.registration_number || `SCH-${selectedSchool.id}`}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                  (selectedSchool.status || 'approved') === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                Status: {selectedSchool.status || 'approved'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 font-bold block">School Name:</span>
                <p className="text-sm font-black text-[#4e2a4a]">{selectedSchool.school_name}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Affiliation Board:</span>
                <p className="font-semibold text-slate-800">{selectedSchool.school_board || 'CBSE'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Principal / Head:</span>
                <p className="font-semibold text-slate-800">{selectedSchool.principal_name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Coordinator:</span>
                <p className="font-semibold text-slate-800">{selectedSchool.teacher_name} ({selectedSchool.designation})</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Official Email:</span>
                <p className="font-semibold text-slate-800 select-all">{selectedSchool.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Contact / WhatsApp:</span>
                <p className="font-semibold text-slate-800 select-all">{selectedSchool.phone}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-bold block">Campus Address:</span>
                <p className="font-semibold text-slate-800">{selectedSchool.address}, {selectedSchool.city}, {selectedSchool.state} - {selectedSchool.pincode}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Expected Student Strength:</span>
                <p className="font-semibold text-slate-800">{selectedSchool.student_count || '100-250 Students'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Registration Date:</span>
                <p className="font-semibold text-slate-800">{new Date(selectedSchool.created_at).toLocaleString()}</p>
              </div>
            </div>

            {Array.isArray(selectedSchool.selected_subjects) && selectedSchool.selected_subjects.length > 0 && (
              <div>
                <span className="text-slate-400 font-bold block mb-1">Participating Olympiad Disciplines:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSchool.selected_subjects.map((subj, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#f4ebf4] text-[#6d3a68] rounded-xs text-[11px] font-bold">
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#edd6ed] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSchool(null)}
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
