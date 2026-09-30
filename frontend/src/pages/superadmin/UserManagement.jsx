import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  Users,
  GraduationCap,
  Plus,
  Search,
  Key,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  Lock,
  RefreshCw,
  Sliders,
  Check,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Award,
  BarChart3,
  Clock,
  Layers,
  Sparkles,
  Save,
  X
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const UserManagement = ({ mode = 'teachers' }) => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  // Full Screen Detail View State
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    role: mode === 'teachers' ? 'teacher' : 'student',
    full_name: '',
    login_id: '',
    password: '',
    email: '',
    phone: '',
    gender: 'Male',
    city: 'Jaipur',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    experience: '8+ Years',
    designation: 'Mathematics Teacher',
    class_id: '',
    status: 'active',
    permissions: []
  });

  const [resetPasswordVal, setResetPasswordVal] = useState('ChangeMe@123');
  const [teacherPerms, setTeacherPerms] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const isTeacherView = mode === 'teachers';

  const fetchData = async () => {
    try {
      setLoading(true);
      if (isTeacherView) {
        const [tRes, pRes, cRes] = await Promise.all([
          apiClient.get('/users/teachers', { search }),
          apiClient.get('/permissions'),
          apiClient.get('/academic/classes')
        ]);
        if (tRes.success) {
          const formatted = (tRes.data || []).map(t => ({
            ...t,
            gender: t.gender || 'Male',
            city: t.city || 'Jaipur',
            qualification: t.qualification || 'M.Sc. Mathematics, B.Ed.',
            experience: t.experience || '8+ Years',
            designation: t.designation || 'Mathematics Teacher',
            assigned_classes: t.assigned_classes || [
              { class_name: 'Class 5', subject: 'Mathematics' },
              { class_name: 'Class 6', subject: 'Mathematics' },
              { class_name: 'Class 7', subject: 'Science' }
            ]
          }));
          setTeachers(formatted);
          if (selectedUserDetail) {
            const updated = formatted.find(u => u.id === selectedUserDetail.id);
            if (updated) setSelectedUserDetail(updated);
          }
        }
        if (pRes.success) setAllPermissions(pRes.data || []);
        if (cRes.success) setClasses(cRes.data || []);
      } else {
        const [sRes, cRes] = await Promise.all([
          apiClient.get('/users/students', { search, class_id: selectedClassFilter }),
          apiClient.get('/academic/classes')
        ]);
        if (sRes.success) {
          const formatted = (sRes.data || []).map(s => ({
            ...s,
            gender: s.gender || 'Male',
            city: s.city || 'Jaipur',
            dob: s.dob || '15 Aug 2010',
            school: s.school || 'Delhi Public School'
          }));
          setStudents(formatted);
          if (selectedUserDetail) {
            const updated = formatted.find(u => u.id === selectedUserDetail.id);
            if (updated) setSelectedUserDetail(updated);
          }
        }
        if (cRes.success) setClasses(cRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedUserDetail(null);
    setIsEditingProfile(false);
    fetchData();
  }, [mode, search, selectedClassFilter]);

  const handleOpenCreate = () => {
    const role = isTeacherView ? 'teacher' : 'student';
    setFormData({
      role,
      full_name: '',
      login_id: '',
      password: role === 'teacher' ? 'Teacher@123' : 'Student@123',
      email: '',
      phone: '',
      gender: 'Male',
      city: 'Jaipur',
      qualification: 'M.Sc. Mathematics, B.Ed.',
      experience: '8+ Years',
      designation: 'Mathematics Teacher',
      class_id: classes[0]?.id || '',
      status: 'active',
      permissions: ['manage_questions', 'import_questions', 'manage_exams', 'view_students', 'view_results', 'view_analytics', 'view_leaderboards']
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await apiClient.post('/users', formData);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `${formData.role === 'teacher' ? 'Teacher' : 'Student'} created successfully! Login ID: ${res.data.login_id}`
        });
        setShowCreateModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.message || 'Error creating user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDetailView = (u) => {
    setSelectedUserDetail(u);
    setIsEditingProfile(false);
    setFormData({
      role: u.role,
      full_name: u.full_name,
      email: u.email || '',
      phone: u.phone || '',
      gender: u.gender || 'Male',
      city: u.city || 'Jaipur',
      qualification: u.qualification || 'M.Sc. Mathematics, B.Ed.',
      experience: u.experience || '8+ Years',
      designation: u.designation || 'Mathematics Teacher',
      class_id: u.class_id || '',
      status: u.status,
      permissions: u.permissions || []
    });
  };

  const handleSaveProfileChanges = async () => {
    if (!selectedUserDetail) return;
    setActionLoading(true);
    try {
      await apiClient.put(`/users/${selectedUserDetail.id}`, formData);
      setSelectedUserDetail({
        ...selectedUserDetail,
        ...formData
      });
      setIsEditingProfile(false);
      setFeedback({ type: 'success', message: 'Teacher profile updated successfully!' });
      fetchData();
    } catch (err) {
      alert(err.message || 'Error updating user profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await apiClient.post(`/users/${user.id}/toggle-status`);
      if (selectedUserDetail && selectedUserDetail.id === user.id) {
        setSelectedUserDetail({
          ...selectedUserDetail,
          status: selectedUserDetail.status === 'active' ? 'inactive' : 'active'
        });
      }
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenReset = (user) => {
    setSelectedUser(user);
    setResetPasswordVal('Reset@123');
    setShowResetModal(true);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await apiClient.post(`/users/${selectedUser.id}/reset-password`, { new_password: resetPasswordVal });
      alert(`Password for ${selectedUser.full_name} (${selectedUser.login_id}) has been reset to: ${resetPasswordVal}`);
      setShowResetModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenPermissions = async (teacher) => {
    setSelectedUser(teacher);
    try {
      const res = await apiClient.get(`/users/${teacher.id}/permissions`);
      if (res.success) {
        setTeacherPerms(res.data || []);
      }
      setShowPermissionsModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSavePermissions = async () => {
    setActionLoading(true);
    try {
      await apiClient.post(`/users/${selectedUser.id}/permissions`, { permissions: teacherPerms });
      setShowPermissionsModal(false);
      if (selectedUserDetail && selectedUserDetail.id === selectedUser.id) {
        setSelectedUserDetail({
          ...selectedUserDetail,
          permissions: teacherPerms
        });
      }
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete user ${user.full_name} (${user.login_id})? This action cannot be undone.`)) {
      return;
    }
    try {
      await apiClient.delete(`/users/${user.id}`);
      if (selectedUserDetail && selectedUserDetail.id === user.id) {
        setSelectedUserDetail(null);
      }
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================================================================
  // FULL SCREEN TEACHER / USER DETAILS VIEW (When a user is selected)
  // =========================================================================
  if (selectedUserDetail) {
    const u = selectedUserDetail;
    const isTeacher = u.role === 'teacher';

    return (
      <div className="space-y-6 pb-12 font-sans max-w-5xl mx-auto animate-in fade-in duration-200">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedUserDetail(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to {isTeacher ? 'Teachers' : 'Students'}</span>
          </button>

          {isEditingProfile && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={X}
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Save}
                loading={actionLoading}
                onClick={handleSaveProfileChanges}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {feedback.message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between shadow-xs">
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4">✕</button>
          </div>
        )}

        {/* 1. Top Profile Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-indigo-500/20">
                {u.full_name ? u.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {u.full_name}
                  </h2>
                  <span
                    onClick={() => handleToggleStatus(u)}
                    title="Click to toggle status"
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      u.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    {u.status === 'active' ? '● Active' : '● Inactive'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2">
                  <span>{u.designation || (isTeacher ? 'Mathematics Teacher' : (u.class_name || 'Class 10 Student'))}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {u.login_id}
                  </span>
                </p>
              </div>
            </div>

            {/* Hero Card Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant={isEditingProfile ? 'secondary' : 'primary'}
                size="sm"
                icon={Edit2}
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={Key}
                onClick={() => handleOpenReset(u)}
              >
                Reset Password
              </Button>

              {isTeacher && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Shield}
                  onClick={() => handleOpenPermissions(u)}
                >
                  Permissions
                </Button>
              )}

              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => handleDeleteUser(u)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Personal Information Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Personal Information</span>
            </h3>
            {!isEditingProfile && (
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Info
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-sm font-bold text-slate-900">{u.full_name}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              {isEditingProfile ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {u.email || 'N/A'}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {u.phone || 'N/A'}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Gender
              </label>
              {isEditingProfile ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-sm font-semibold text-slate-800">{u.gender || 'Male'}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                City / Location
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {u.city || 'Jaipur'}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Login ID (Immutable)
              </label>
              <p className="text-sm font-mono font-bold text-slate-700">{u.login_id}</p>
            </div>
          </div>
        </div>

        {/* 3. Two Columns: Professional Info & Account Permissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional Info */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span>Professional Info</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Qualification</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{u.qualification || 'M.Sc. Mathematics, B.Ed.'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Experience</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{u.experience || '8+ Years'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Primary Subjects</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">Mathematics, Science, Logic</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Classes Assigned</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">Class 5, Class 6, Class 7, Class 10</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account & Permissions */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Account & Permissions</span>
                </h3>
                {isTeacher && (
                  <button
                    type="button"
                    onClick={() => handleOpenPermissions(u)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    Configure
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'manage_questions', label: 'Manage Questions' },
                  { id: 'manage_exams', label: 'Manage Exams' },
                  { id: 'view_results', label: 'View Results' },
                  { id: 'view_analytics', label: 'View Reports' },
                  { id: 'view_leaderboards', label: 'View Leaderboards' }
                ].map((perm) => {
                  const hasPerm = (u.permissions || []).includes(perm.id) || isTeacher;
                  return (
                    <div key={perm.id} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center ${hasPerm ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{perm.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Teacher Performance Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <span>{isTeacher ? 'Teacher Performance' : 'Student Performance Overview'}</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">All Time Record</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Exams</p>
              <h4 className="text-xl font-black text-slate-900 mt-1">{u.exams_count || 12}</h4>
            </div>
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Questions</p>
              <h4 className="text-xl font-black text-slate-900 mt-1">{u.questions_count || 245}</h4>
            </div>
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Students</p>
              <h4 className="text-xl font-black text-slate-900 mt-1">180</h4>
            </div>
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Avg. Score</p>
              <h4 className="text-xl font-black text-teal-600 mt-1">82%</h4>
            </div>
          </div>

          {/* Circular Performance Chart */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="#14b8a6" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="45" strokeLinecap="round" fill="transparent" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900">82%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Efficiency</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-3">High Accuracy & Active Examination Rating</p>
          </div>
        </div>

        {/* 5. Assigned Classes & Subjects */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Assigned Classes & Subjects</span>
            </h3>
            <span className="text-xs font-bold text-indigo-600">+ Assign New</span>
          </div>

          <div className="space-y-2.5">
            {[
              { class_name: 'Class 5', subject: 'Mathematics' },
              { class_name: 'Class 6', subject: 'Mathematics' },
              { class_name: 'Class 7', subject: 'Science' }
            ].map((asg, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-150 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{asg.class_name}</span>
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-2">
                  → {asg.subject}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Recent Activity Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Recent Activity</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
              <span className="font-semibold text-slate-800">Added Question: Trigonometric Identities</span>
              <span className="text-slate-400 font-medium">10:45 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
              <span className="font-semibold text-slate-800">Created Exam: National Olympiad Mock 2</span>
              <span className="text-slate-400 font-medium">Yesterday</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
              <span className="font-semibold text-slate-800">Updated Question Bank: Geometry Set</span>
              <span className="text-slate-400 font-medium">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN TABLE LIST VIEW (When no user detail is selected)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            {isTeacherView ? (
              <>
                <GraduationCap className="w-7 h-7 text-indigo-600" />
                <span>Teacher Management</span>
              </>
            ) : (
              <>
                <Users className="w-7 h-7 text-emerald-600" />
                <span>Student Management</span>
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isTeacherView
              ? 'Create faculty accounts, configure permissions, generate credentials, and monitor question authoring.'
              : 'Create student candidates, assign academic classes, monitor performance, and manage candidate credentials.'}
          </p>
        </div>

        <Button
          variant={isTeacherView ? 'primary' : 'success'}
          size="sm"
          icon={isTeacherView ? GraduationCap : Users}
          onClick={handleOpenCreate}
        >
          {isTeacherView ? 'Add New Teacher' : 'Add New Student'}
        </Button>
      </div>

      {feedback.message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between shadow-xs">
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isTeacherView && (
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}

          <span className="text-xs font-bold text-slate-500">
            Total: {isTeacherView ? teachers.length : students.length} {isTeacherView ? 'Teachers' : 'Students'}
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${isTeacherView ? 'teachers' : 'students'} by name, ID or email...`}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isTeacherView ? (
          /* TEACHERS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Teacher Name & ID</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Questions Authored</th>
                  <th className="py-3 px-4">Exams</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No teachers found. Click "Add New Teacher" to create one.
                    </td>
                  </tr>
                ) : (
                  teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 cursor-pointer" onClick={() => handleOpenDetailView(t)}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {t.full_name ? t.full_name.charAt(0).toUpperCase() : 'T'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                              {t.full_name}
                            </p>
                            <p className="text-[11px] font-mono text-indigo-600 font-bold">{t.login_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <p>{t.email || '-'}</p>
                        <p className="text-[11px] text-slate-400">{t.phone || '-'}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {t.questions_count || 0} Questions
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {t.exams_count || 0} Exams
                      </td>
                      <td className="py-3 px-4">
                        <span
                          onClick={() => handleToggleStatus(t)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                            t.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {t.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="secondary"
                            size="xs"
                            icon={Edit2}
                            title="View / Edit Profile"
                            onClick={() => handleOpenDetailView(t)}
                          >
                            View Profile
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Key}
                            title="Reset Password"
                            onClick={() => handleOpenReset(t)}
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Shield}
                            title="Manage Permissions"
                            onClick={() => handleOpenPermissions(t)}
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Trash2}
                            title="Delete Teacher"
                            onClick={() => handleDeleteUser(t)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* STUDENTS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Student Name & Roll No</th>
                  <th className="py-3 px-4">Academic Class</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Exams Attempted</th>
                  <th className="py-3 px-4">Avg Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No students found. Click "Add New Student" to create one.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 cursor-pointer" onClick={() => handleOpenDetailView(s)}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {s.full_name ? s.full_name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 hover:text-emerald-600 transition-colors">
                              {s.full_name}
                            </p>
                            <p className="text-[11px] font-mono text-emerald-600 font-bold">{s.login_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {s.class_name || 'Class 10'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <p>{s.email || '-'}</p>
                        <p className="text-[11px] text-slate-400">{s.phone || '-'}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {s.attempts_count || 0} Attempts
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {s.avg_score ? `${parseFloat(s.avg_score).toFixed(1)}%` : '0%'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          onClick={() => handleToggleStatus(s)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                            s.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {s.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="secondary"
                            size="xs"
                            icon={Edit2}
                            title="View / Edit Profile"
                            onClick={() => handleOpenDetailView(s)}
                          >
                            View Profile
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Key}
                            title="Reset Password"
                            onClick={() => handleOpenReset(s)}
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Trash2}
                            title="Delete Student"
                            onClick={() => handleDeleteUser(s)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={isTeacherView ? 'Add New Teacher' : 'Add New Student'}
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder={isTeacherView ? 'e.g. Rahul Sharma' : 'e.g. Aarav Sharma'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Login ID (Optional)</label>
            <input
              type="text"
              value={formData.login_id}
              onChange={(e) => setFormData({ ...formData, login_id: e.target.value })}
              placeholder={isTeacherView ? 'e.g. TCH101 (Leave blank to auto-generate)' : 'e.g. STU1001 (Leave blank to auto-generate)'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {!isTeacherView && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Academic Class *</label>
              <select
                value={formData.class_id}
                onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@domain.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Initial Password *</label>
            <input
              type="text"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="secondary" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={actionLoading}>
              Create {isTeacherView ? 'Teacher' : 'Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* RESET PASSWORD MODAL */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title={`Reset Password: ${selectedUser?.full_name}`}
      >
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Set a new temporary password for user <strong className="text-slate-900">{selectedUser?.login_id}</strong>.
          </p>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
            <input
              type="text"
              required
              value={resetPasswordVal}
              onChange={(e) => setResetPasswordVal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={actionLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* MANAGE PERMISSIONS MODAL */}
      <Modal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        title={`Permissions: ${selectedUser?.full_name}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Select the granular capabilities granted to this teacher account.
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {allPermissions.map((p) => {
              const checked = teacherPerms.includes(p.name);
              return (
                <label
                  key={p.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTeacherPerms([...teacherPerms, p.name]);
                      } else {
                        setTeacherPerms(teacherPerms.filter((name) => name !== p.name));
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.description || p.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{p.name}</p>
                  </div>
                </label>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowPermissionsModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSavePermissions} loading={actionLoading}>
              Save Permissions
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
