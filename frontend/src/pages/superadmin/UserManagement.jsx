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
  Check
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

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Selected User
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    role: mode === 'teachers' ? 'teacher' : 'student',
    full_name: '',
    login_id: '',
    password: '',
    email: '',
    phone: '',
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
        const [tRes, pRes] = await Promise.all([
          apiClient.get('/users/teachers', { search }),
          apiClient.get('/permissions')
        ]);
        if (tRes.success) setTeachers(tRes.data || []);
        if (pRes.success) setAllPermissions(pRes.data || []);
      } else {
        const [sRes, cRes] = await Promise.all([
          apiClient.get('/users/students', { search, class_id: selectedClassFilter }),
          apiClient.get('/academic/classes')
        ]);
        if (sRes.success) setStudents(sRes.data || []);
        if (cRes.success) setClasses(cRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      role: user.role,
      full_name: user.full_name,
      email: user.email || '',
      phone: user.phone || '',
      class_id: user.class_id || '',
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await apiClient.put(`/users/${selectedUser.id}`, formData);
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error updating user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await apiClient.post(`/users/${user.id}/toggle-status`);
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
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            {isTeacherView ? (
              <>
                <GraduationCap className="w-7 h-7 text-brand-600" />
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
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isTeacherView && (
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-brand-500"
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
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isTeacherView ? (
          /* TEACHERS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Teacher Name & ID</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Permissions</th>
                  <th className="py-3.5 px-4">Questions Authored</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No teachers found. Click "Add New Teacher" to create faculty accounts.
                    </td>
                  </tr>
                ) : (
                  teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{t.full_name}</p>
                        <p className="text-[11px] font-mono font-bold text-brand-600">{t.login_id}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <p>{t.email || '-'}</p>
                        <p className="text-[11px] text-slate-400">{t.phone || '-'}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleOpenPermissions(t)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] border border-indigo-200"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>{(t.permissions || []).length} Granted</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {t.questions_count} Added
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(t)}
                          className="focus:outline-none"
                        >
                          <Badge variant={t.status === 'active' ? 'active' : 'inactive'} size="sm">
                            {t.status.toUpperCase()}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Reset Password"
                            onClick={() => handleOpenReset(t)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Edit Details"
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete Teacher"
                            onClick={() => handleDeleteUser(t)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student Name & ID</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Exams Attempted</th>
                  <th className="py-3.5 px-4">Avg Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      No students found. Click "Add New Student" to create candidate profiles.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{s.full_name}</p>
                        <p className="text-[11px] font-mono font-bold text-emerald-600">{s.login_id}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
                          {s.class_name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <p>{s.email || '-'}</p>
                        <p className="text-[11px] text-slate-400">{s.phone || '-'}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {s.attempts_count} exams
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-600 font-mono">
                        {s.avg_score ? `${parseFloat(s.avg_score).toFixed(1)}%` : '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(s)}
                          className="focus:outline-none"
                        >
                          <Badge variant={s.status === 'active' ? 'active' : 'inactive'} size="sm">
                            {s.status.toUpperCase()}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Reset Password"
                            onClick={() => handleOpenReset(s)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Edit Details"
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete Student"
                            onClick={() => handleDeleteUser(s)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
        title={`Create New ${formData.role === 'teacher' ? 'Teacher Account' : 'Student Account'}`}
        subtitle="Credentials will be generated and ready for immediate login"
        maxWidth="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={actionLoading} onClick={handleCreateSubmit}>
              Create {formData.role === 'teacher' ? 'Teacher' : 'Student'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder={isTeacherView ? 'e.g. Dr. Rajesh Sharma' : 'e.g. Aarav Mehta'}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Custom Login ID (Optional)
              </label>
              <input
                type="text"
                value={formData.login_id}
                onChange={(e) => setFormData({ ...formData, login_id: e.target.value })}
                placeholder="Auto-generated if empty"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Temporary Password *
              </label>
              <input
                type="text"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>
          </div>

          {!isTeacherView && (
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Academic Class
              </label>
              <select
                value={formData.class_id}
                onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select Academic Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={isTeacherView ? 'teacher@olympiadhub.com' : 'student@email.com'}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit ${selectedUser?.role === 'teacher' ? 'Teacher' : 'Student'} Profile`}
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" loading={actionLoading} onClick={handleEditSubmit}>Save Changes</Button>
          </div>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {!isTeacherView && (
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Academic Class</label>
              <select
                value={formData.class_id}
                onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select Academic Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </form>
      </Modal>

      {/* RESET PASSWORD MODAL */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Account Password"
        subtitle={`User: ${selectedUser?.full_name} (${selectedUser?.login_id})`}
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>Cancel</Button>
            <Button variant="danger" loading={actionLoading} onClick={handleResetSubmit}>Reset Password</Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Set a new temporary password for this user. The user will be required to change it upon first login.
          </p>
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">New Password</label>
            <input
              type="text"
              required
              value={resetPasswordVal}
              onChange={(e) => setResetPasswordVal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </Modal>

      {/* TEACHER CUSTOM PERMISSIONS MODAL */}
      <Modal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        title="Configure Teacher Role Permissions"
        subtitle={`Configuring access for: ${selectedUser?.full_name}`}
        maxWidth="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={() => setShowPermissionsModal(false)}>Cancel</Button>
            <Button variant="primary" loading={actionLoading} onClick={handleSavePermissions}>Save Permissions</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600 mb-4">
            Select the specific administrative capabilities granted to this teacher. The backend API validates these permissions on every request.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {allPermissions.filter(p => p.code !== 'manage_settings' && p.code !== 'manage_users').map((p) => {
              const isChecked = teacherPerms.includes(p.code);
              return (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                    isChecked ? 'bg-brand-50/70 border-brand-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTeacherPerms([...teacherPerms, p.code]);
                      } else {
                        setTeacherPerms(teacherPerms.filter(c => c !== p.code));
                      }
                    }}
                    className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{p.name}</span>
                    <span className="text-[11px] text-slate-500">{p.description}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
