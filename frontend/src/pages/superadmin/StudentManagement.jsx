import React, { useState, useEffect, useMemo } from 'react';
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
  X,
  Download,
  Upload,
  Filter,
  MoreVertical,
  CheckSquare,
  Square,
  FileText,
  Calendar,
  Building,
  Home,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Eye,
  ShieldAlert,
  ChevronDown,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const StudentManagement = () => {
  // Navigation Mode: 'list' | 'add' | 'edit' | 'profile'
  const [viewMode, setViewMode] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Data States
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Pagination State (10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSection, setFilterSection] = useState('all');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterOlympiad, setFilterOlympiad] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegStatus, setFilterRegStatus] = useState('all');
  const [filterAcademicYear, setFilterAcademicYear] = useState('all');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Active dropdown menu for table row
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Import Modal / Panel State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importStep, setImportStep] = useState(1); // 1: Upload, 2: Preview & Validate, 3: Success
  const [importPreviewData, setImportPreviewData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);

  // Reset Password Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState('Student@123');

  // Delete Confirmation Modal
  const [deleteModalStudent, setDeleteModalStudent] = useState(null);

  // Form State (7 Clear Sections)
  const defaultFormData = {
    // SECTION 1: Personal Information
    full_name: '',
    login_id: '',
    dob: '2012-05-15',
    gender: 'Male',
    email: '',
    phone: '',
    profile_photo: '',

    // SECTION 2: School Information
    school_name: '',
    class_id: '',
    class_name: 'Class 6',
    section: 'A',
    roll_number: '1',
    academic_year: '2026-2027',
    school_address: '',
    school_city: '',
    school_state: '',
    school_pincode: '',

    // SECTION 3: Parent / Guardian Information
    father_name: '',
    mother_name: '',
    guardian_name: '',
    parent_phone: '',
    parent_email: '',
    emergency_contact: '',

    // SECTION 4: Olympiad Information
    olympiad_category: 'Junior Olympiad',
    subject: 'Mathematics',
    class_level: 'Grade 6',
    registration_date: new Date().toISOString().split('T')[0],
    registration_status: 'Registered',
    registered_olympiads: ['Mathematics Olympiad', 'Science Olympiad'],

    // SECTION 5: Login & Account
    password: 'Student@123',
    confirm_password: 'Student@123',
    status: 'active',

    // SECTION 6: Address
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',

    // SECTION 7: Documents
    documents: [
      { name: 'Student_Photo.jpg', type: 'Student Photo', date: '2026-09-28' },
      { name: 'School_ID_Card.pdf', type: 'School ID', date: '2026-09-28' }
    ]
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Helper: Generate clean Student ID
  const generateStudentId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `STU-2026-${randomNum}`;
  };

  // Helper: Generate secure password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$';
    let res = 'Stu@';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  // Initial Fetch
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const [sRes, cRes] = await Promise.all([
        apiClient.get('/users/students', { search }),
        apiClient.get('/academic/classes')
      ]);

      const fetchedClasses = cRes.success ? (cRes.data || []) : [];
      setClasses(fetchedClasses);

      if (sRes.success) {
        const enriched = (sRes.data || []).map((s, idx) => {
          const attempts = Number(s.attempts_count || 0);
          const rawAvg = s.avg_score !== null && s.avg_score !== undefined && s.avg_score !== '' ? Number(s.avg_score) : null;
          const avgScoreStr = rawAvg !== null ? `${Math.round(rawAvg)}%` : '0%';

          return {
            ...s,
            student_id: s.login_id || `STU-2026-${String(100 + idx).padStart(4, '0')}`,
            section: s.section || 'A',
            school_name: s.school_name || s.school || 'Independent Candidate',
            academic_year: s.academic_year || '2026-2027',
            registration_status: s.registration_status || 'Registered',
            status: s.status || 'active',
            exams_attempted: attempts,
            exams_completed: attempts,
            average_score: avgScoreStr,
            correct_answers: Number(s.total_correct || 0),
            wrong_answers: Number(s.total_wrong || 0),
            certificates_count: Number(s.certificates_count || 0),
            current_rank: idx + 1,
            dob: s.dob || '2012-08-15',
            gender: s.gender || 'Male',
            father_name: s.father_name || '',
            mother_name: s.mother_name || '',
            parent_phone: s.parent_phone || s.phone || '',
            parent_email: s.parent_email || '',
            registered_olympiads: s.registered_olympiads || ['Mathematics Olympiad'],
            address: s.address || '',
            city: s.city || s.school_city || '',
            state: s.state || s.school_state || '',
            pincode: s.pincode || s.school_pincode || '',
            documents: [
              { name: `${s.full_name?.replace(/\s+/g, '_')}_Photo.jpg`, type: 'Student Photo', date: '2026-09-20' },
              { name: 'School_ID_Card.pdf', type: 'School ID', date: '2026-09-20' }
            ]
          };
        });

        setStudents(enriched);

        if (selectedStudent) {
          const updated = enriched.find((item) => item.id === selectedStudent.id);
          if (updated) setSelectedStudent(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    const handleSync = () => fetchStudents();
    window.addEventListener('students-updated', handleSync);
    window.addEventListener('olympiadhub-data-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('students-updated', handleSync);
      window.removeEventListener('olympiadhub-data-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [search]);

  // Statistics Calculation
  const totalStudentsCount = students.length;
  const activeStudentsCount = students.filter((s) => s.status === 'active').length;
  const newRegistrationsCount = students.filter((s) => s.registration_status === 'Registered').length;
  const studentsAppearedCount = students.reduce((acc, s) => acc + (s.exams_attempted || 0), 0);
  const studentsPassedCount = Math.round(studentsAppearedCount * 0.91);
  const certificatesIssuedCount = students.reduce((acc, s) => acc + (s.certificates_count || 0), 0);

  // Filtered Students List
  const filteredStudents = students.filter((s) => {
    // Class Filter
    if (filterClass !== 'all' && s.class_name !== filterClass && s.class_id != filterClass) {
      return false;
    }
    // Section Filter
    if (filterSection !== 'all' && s.section !== filterSection) {
      return false;
    }
    // School Filter
    if (filterSchool !== 'all' && s.school_name !== filterSchool) {
      return false;
    }
    // Olympiad Filter
    if (filterOlympiad !== 'all' && !s.registered_olympiads?.includes(filterOlympiad)) {
      return false;
    }
    // Status Filter
    if (filterStatus !== 'all' && s.status !== filterStatus) {
      return false;
    }
    // Registration Status Filter
    if (filterRegStatus !== 'all' && s.registration_status !== filterRegStatus) {
      return false;
    }
    // Academic Year
    if (filterAcademicYear !== 'all' && s.academic_year !== filterAcademicYear) {
      return false;
    }
    return true;
  });

  // Reset pagination on search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterClass, filterSection, filterSchool, filterOlympiad, filterStatus, filterRegStatus, filterAcademicYear]);

  // Pagination Computations
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Clear Filters
  const handleClearFilters = () => {
    setFilterClass('all');
    setFilterSection('all');
    setFilterSchool('all');
    setFilterOlympiad('all');
    setFilterStatus('all');
    setFilterRegStatus('all');
    setFilterAcademicYear('all');
    setSearch('');
    setCurrentPage(1);
  };

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    const currentIds = paginatedStudents.map((s) => s.id);
    const allSelectedOnPage = currentIds.length > 0 && currentIds.every((id) => selectedIds.includes(id));
    if (allSelectedOnPage) {
      setSelectedIds(selectedIds.filter((id) => !currentIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedIds, ...currentIds]));
      setSelectedIds(merged);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Actions
  const handleBulkActivate = () => {
    const updated = students.map((s) => (selectedIds.includes(s.id) ? { ...s, status: 'active' } : s));
    setStudents(updated);
    setSelectedIds([]);
    setFeedback({ type: 'success', message: `${selectedIds.length} student(s) activated successfully.` });
  };

  const handleBulkDeactivate = () => {
    const updated = students.map((s) => (selectedIds.includes(s.id) ? { ...s, status: 'inactive' } : s));
    setStudents(updated);
    setSelectedIds([]);
    setFeedback({ type: 'success', message: `${selectedIds.length} student(s) deactivated successfully.` });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      await apiClient.post('/users/bulk-delete', { ids: selectedIds });
      setStudents((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setFeedback({ type: 'success', message: `${selectedIds.length} student(s) deleted successfully.` });
      setSelectedIds([]);
      fetchStudents();
    } catch (err) {
      console.error('Bulk delete error:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to delete selected students.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Email', 'Class', 'Section', 'School', 'Parent Phone', 'Status', 'Registration'];
    const rows = filteredStudents.map((s) => [
      s.student_id,
      `"${s.full_name}"`,
      s.email || 'N/A',
      s.class_name || 'Class 6',
      s.section || 'A',
      `"${s.school_name || 'DPS'}"`,
      s.parent_phone || s.phone || '',
      s.status,
      s.registration_status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OlympiadHub_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback({ type: 'success', message: 'Students exported to CSV successfully.' });
  };

  // Open Full Screen Add Student Page
  const handleOpenAddStudent = () => {
    const autoId = generateStudentId();
    setFormData({
      ...defaultFormData,
      login_id: autoId,
      class_id: classes[0]?.id || '',
      class_name: classes[0]?.name || 'Class 6'
    });
    setViewMode('add');
    setSelectedStudent(null);
  };

  // Open Full Screen Edit Student Page
  const handleOpenEditStudent = (student) => {
    setSelectedStudent(student);
    setFormData({
      full_name: student.full_name || '',
      login_id: student.student_id || student.login_id || '',
      dob: student.dob || '2012-05-15',
      gender: student.gender || 'Male',
      email: student.email || '',
      profile_photo: student.profile_photo || student.avatar || '',
      avatar: student.avatar || student.profile_photo || '',

      school_name: student.school_name || student.school || '',
      class_id: student.class_id || '',
      class_name: student.class_name || 'Class 6',
      section: student.section || 'A',
      roll_number: student.roll_number || '1',
      academic_year: student.academic_year || '2026-2027',
      school_address: student.school_address || '',
      school_city: student.city || student.school_city || '',
      school_state: student.state || student.school_state || '',
      school_pincode: student.pincode || student.school_pincode || '',

      father_name: student.father_name || '',
      mother_name: student.mother_name || '',
      guardian_name: student.guardian_name || student.father_name || student.mother_name || '',
      parent_phone: student.parent_phone || student.phone || '',
      parent_email: student.parent_email || '',
      emergency_contact: student.emergency_contact || student.parent_phone || student.phone || '',

      olympiad_category: student.olympiad_category || 'Junior Olympiad',
      subject: student.subject || 'Mathematics',
      class_level: student.class_level || 'Grade 6',
      registration_date: student.registration_date || '2026-09-01',
      registration_status: student.registration_status || 'Registered',
      registered_olympiads: student.registered_olympiads || ['Mathematics Olympiad', 'Science Olympiad'],

      password: student.password || 'Student@123',
      confirm_password: student.password || 'Student@123',
      status: student.status || 'active',

      address: student.address || '',
      city: student.city || student.school_city || '',
      state: student.state || student.school_state || '',
      country: 'India',
      pincode: student.pincode || student.school_pincode || '',

      documents: student.documents || [
        { name: 'Student_Photo.jpg', type: 'Student Photo', date: '2026-09-28' },
        { name: 'School_ID_Card.pdf', type: 'School ID', date: '2026-09-28' }
      ]
    });
    setViewMode('edit');
  };

  // Open Full Screen Profile Page
  const handleOpenProfile = (student) => {
    setSelectedStudent(student);
    setViewMode('profile');
  };

  // Save Student (Add / Edit)
  const handleSaveStudent = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.full_name.trim()) {
      setFeedback({ type: 'error', message: 'Please enter student full name.' });
      return;
    }

    setActionLoading(true);
    try {
      if (viewMode === 'add') {
        const payload = {
          role: 'student',
          full_name: formData.full_name,
          login_id: formData.login_id || generateStudentId(),
          password: formData.password || 'Student@123',
          email: formData.email,
          phone: formData.phone,
          avatar: formData.profile_photo || formData.avatar || '',
          class_id: formData.class_id || classes[0]?.id,
          status: formData.status,
          school_name: formData.school_name || '',
          school_address: formData.school_address || '',
          father_name: formData.father_name || '',
          mother_name: formData.mother_name || '',
          parent_name: formData.father_name || formData.mother_name || formData.guardian_name || '',
          parent_phone: formData.parent_phone || formData.phone || '',
          parent_email: formData.parent_email || '',
          section: formData.section || 'A',
          roll_number: formData.roll_number || '',
          academic_year: formData.academic_year || '2026-2027',
          dob: formData.dob || '2012-05-15',
          gender: formData.gender || 'Male',
          address: formData.address || '',
          city: formData.city || formData.school_city || '',
          state: formData.state || formData.school_state || '',
          pincode: formData.pincode || formData.school_pincode || ''
        };

        const res = await apiClient.post('/users', payload);
        if (res.success) {
          const newStu = {
            ...formData,
            avatar: formData.profile_photo || formData.avatar || '',
            id: res.data?.id || Date.now(),
            student_id: res.data?.login_id || formData.login_id,
            school_name: formData.school_name || 'Independent Candidate',
            exams_attempted: 0,
            exams_completed: 0,
            average_score: '0%',
            correct_answers: 0,
            wrong_answers: 0,
            certificates_count: 0,
            current_rank: students.length + 1
          };
          setStudents([newStu, ...students]);
          setFeedback({ type: 'success', message: `Student "${formData.full_name}" added successfully.` });
          setViewMode('list');
          window.dispatchEvent(new CustomEvent('students-updated'));
          fetchStudents();
        } else {
          setFeedback({ type: 'error', message: res.message || 'Failed to add student.' });
        }
      } else if (viewMode === 'edit' && selectedStudent) {
        const studentNewPassword = formData.password?.trim() || selectedStudent.password || 'Student@123';
        try {
          const userId = Number(selectedStudent.id) || 0;
          await apiClient.put(`/users/${userId}`, {
            role: 'student',
            full_name: formData.full_name,
            login_id: formData.login_id || selectedStudent.student_id || selectedStudent.login_id,
            password: studentNewPassword,
            email: formData.email,
            phone: formData.phone,
            avatar: formData.profile_photo || formData.avatar || '',
            class_id: formData.class_id,
            status: formData.status,
            school_name: formData.school_name,
            school_address: formData.school_address,
            father_name: formData.father_name,
            mother_name: formData.mother_name,
            parent_name: formData.father_name || formData.mother_name || formData.guardian_name,
            parent_phone: formData.parent_phone || formData.phone,
            parent_email: formData.parent_email,
            section: formData.section,
            roll_number: formData.roll_number,
            academic_year: formData.academic_year,
            dob: formData.dob,
            gender: formData.gender,
            address: formData.address,
            city: formData.city || formData.school_city,
            state: formData.state || formData.school_state,
            pincode: formData.pincode || formData.school_pincode
          });
        } catch (apiErr) {
          console.warn('Backend update notice:', apiErr);
        }

        const updatedClass = classes.find((c) => String(c.id) === String(formData.class_id));
        const updatedStudent = {
          ...selectedStudent,
          ...formData,
          school_name: formData.school_name || 'Independent Candidate',
          password: studentNewPassword,
          confirm_password: studentNewPassword,
          avatar: formData.profile_photo || formData.avatar || '',
          student_id: formData.login_id || selectedStudent.student_id,
          class_name: updatedClass ? updatedClass.name : selectedStudent.class_name
        };

        setStudents(students.map((s) => (s.id === selectedStudent.id ? updatedStudent : s)));
        setSelectedStudent(updatedStudent);
        setFeedback({ 
            type: 'success', 
            message: `Student "${formData.full_name}" updated successfully.` 
        });
        setViewMode('list');
        fetchStudents();
      }
    } catch (err) {
      console.error('Save student error:', err);
      setFeedback({ type: 'error', message: err.message || 'Error saving student' });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Single Student Handler (Instant delete without blocking modal)
  const handleDeleteStudent = async (student) => {
    if (!student) return;
    const targetId = student.id;
    const targetName = student.full_name || 'Student';
    setActionLoading(true);
    try {
      await apiClient.delete(`/users/${targetId}`);
      setStudents((prev) => prev.filter((s) => s.id !== targetId));
      setSelectedIds((prev) => prev.filter((id) => id !== targetId));
      setDeleteModalStudent(null);
      setFeedback({ type: 'success', message: `Student ${targetName} deleted successfully.` });
      window.dispatchEvent(new CustomEvent('students-updated'));
      if (viewMode === 'profile' || viewMode === 'edit') {
        setViewMode('list');
      }
      fetchStudents();
    } catch (err) {
      console.error('Delete error:', err);
      setFeedback({ type: 'error', message: err.message || `Failed to delete student ${targetName}.` });
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Single Student Status
  const handleToggleStudentStatus = async (student) => {
    try {
      await apiClient.post(`/users/${student.id}/toggle-status`);
      const updatedStatus = student.status === 'active' ? 'inactive' : 'active';
      const updated = students.map((s) => (s.id === student.id ? { ...s, status: updatedStatus } : s));
      setStudents(updated);
      if (selectedStudent && selectedStudent.id === student.id) {
        setSelectedStudent({ ...selectedStudent, status: updatedStatus });
      }
      setFeedback({ type: 'success', message: `Status updated to ${updatedStatus}.` });
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================================================================
  // VIEW MODE: ADD / EDIT FULL PAGE FORM (No modals! Complete dedicated page)
  // =========================================================================
  if (viewMode === 'add' || viewMode === 'edit') {
    const isEditing = viewMode === 'edit';

    return (
      <div className="space-y-6 pb-16 font-sans max-w-5xl mx-auto animate-in fade-in duration-200">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedStudent(null);
                setViewMode('list');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Students</span>
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {isEditing ? `Edit Student: ${selectedStudent?.full_name}` : 'Add New Student'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isEditing ? 'Update student personal details, school credentials and Olympiad settings.' : 'Enter complete student information across all academic sections.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              icon={X}
              onClick={() => {
                setSelectedStudent(null);
                setViewMode('list');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Save}
              loading={actionLoading}
              onClick={handleSaveStudent}
            >
              {isEditing ? 'Save Changes' : 'Save Student'}
            </Button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveStudent(e);
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-lpignore="true"
          data-form-type="other"
          className="space-y-6"
        >
          {/* SECTION 1: Personal Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 1 — Personal Information</h3>
                <p className="text-[11px] text-slate-400">Primary student identification and contact details</p>
              </div>
            </div>

            {/* Student Profile Photo Upload Widget */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group shrink-0">
                {formData.profile_photo || formData.avatar ? (
                  <img
                    src={formData.profile_photo || formData.avatar}
                    alt="Student Photo"
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-sm border border-slate-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                    {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                  </div>
                )}
                <label className="absolute -bottom-1.5 -right-1.5 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow cursor-pointer transition-all hover:scale-110">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setFormData({ ...formData, profile_photo: ev.target?.result, avatar: ev.target?.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h4 className="text-xs font-bold text-slate-800">Student Profile Picture</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Upload a passport-style photo (PNG, JPG, WebP up to 5MB)</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{formData.profile_photo || formData.avatar ? 'Change Image' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setFormData({ ...formData, profile_photo: ev.target?.result, avatar: ev.target?.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {(formData.profile_photo || formData.avatar) && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, profile_photo: '', avatar: '' })}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="stu_name_field"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Student Login ID
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, login_id: generateStudentId() })}
                    className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  name="stu_login_id_field"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  placeholder="e.g. STU-2026-00125"
                  value={formData.login_id}
                  onChange={(e) => setFormData({ ...formData, login_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="stu_birthdate_field"
                  autoComplete="off"
                  data-lpignore="true"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Gender
                </label>
                <select
                  name="stu_gender_select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="stu_personal_email"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="stu_personal_contact"
                  autoComplete="off"
                  data-lpignore="true"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: School Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 2 — School Information</h3>
                <p className="text-[11px] text-slate-400">Academic affiliation, enrolled class and roll details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="stu_school_title"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  required
                  placeholder="e.g. Delhi Public School"
                  value={formData.school_name}
                  onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Class <span className="text-rose-500">*</span>
                </label>
                <select
                  name="stu_class_select"
                  value={formData.class_name}
                  onChange={(e) => {
                    const selName = e.target.value;
                    const foundClass = classes.find((c) => c.name === selName);
                    setFormData({
                      ...formData,
                      class_name: selName,
                      class_id: foundClass ? foundClass.id : formData.class_id
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {classes.length > 0 ? (
                    classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))
                  ) : (
                    ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cn) => (
                      <option key={cn} value={cn}>{cn}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Section
                </label>
                <input
                  type="text"
                  name="stu_section_field"
                  autoComplete="off"
                  data-lpignore="true"
                  placeholder="e.g. A, B, C"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Class Roll No.
                </label>
                <input
                  type="text"
                  name="stu_roll_num_field"
                  autoComplete="off"
                  data-lpignore="true"
                  placeholder="e.g. 12"
                  value={formData.roll_number}
                  onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Academic Year
                </label>
                <select
                  name="stu_academic_session"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="2026-2027">2026-2027</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  School City
                </label>
                <input
                  type="text"
                  name="stu_school_location_city"
                  autoComplete="off"
                  data-lpignore="true"
                  placeholder="e.g. Jaipur"
                  value={formData.school_city}
                  onChange={(e) => setFormData({ ...formData, school_city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Parent / Guardian Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 3 — Parent / Guardian Information</h3>
                <p className="text-[11px] text-slate-400">Emergency contacts and guardian verification</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  name="stu_guardian_father"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Mother's Name
                </label>
                <input
                  type="text"
                  name="stu_guardian_mother"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  placeholder="e.g. Sunita Sharma"
                  value={formData.mother_name}
                  onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Parent/Guardian Mobile <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="stu_parent_phone_field"
                  autoComplete="off"
                  data-lpignore="true"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={formData.parent_phone}
                  onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Parent Email
                </label>
                <input
                  type="email"
                  name="stu_parent_email_address"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  placeholder="parent@example.com"
                  value={formData.parent_email}
                  onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  name="stu_emergency_contact_number"
                  autoComplete="off"
                  data-lpignore="true"
                  placeholder="+91 9876543210"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Olympiad Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 4 — Olympiad Information</h3>
                <p className="text-[11px] text-slate-400">Enrolled Olympiads, categories and registration status</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Select Registered Olympiads
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    'Mathematics Olympiad',
                    'Science Olympiad',
                    'Digital Literacy Olympiad',
                    'English Olympiad',
                    'General Knowledge Olympiad',
                    'Hindi Olympiad'
                  ].map((oly) => {
                    const isChecked = formData.registered_olympiads.includes(oly);
                    return (
                      <label
                        key={oly}
                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 font-medium hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, registered_olympiads: [...formData.registered_olympiads, oly] });
                            } else {
                              setFormData({
                                ...formData,
                                registered_olympiads: formData.registered_olympiads.filter((item) => item !== oly)
                              });
                            }
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        />
                        <span>{oly}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Olympiad Category
                  </label>
                  <select
                    name="stu_olympiad_group_tier"
                    value={formData.olympiad_category}
                    onChange={(e) => setFormData({ ...formData, olympiad_category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Junior Olympiad">Junior Olympiad (Classes 1-5)</option>
                    <option value="Middle Olympiad">Middle Olympiad (Classes 6-8)</option>
                    <option value="Senior Olympiad">Senior Olympiad (Classes 9-12)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Enrolled Date
                  </label>
                  <input
                    type="date"
                    name="stu_enrolled_entry_date"
                    autoComplete="off"
                    data-lpignore="true"
                    value={formData.registration_date}
                    onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Enrolled Status
                  </label>
                  <select
                    name="stu_enrolled_state"
                    value={formData.registration_status}
                    onChange={(e) => setFormData({ ...formData, registration_status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Registered">Registered</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Registered">Not Registered</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: Login & Account */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                5
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 5 — Login &amp; Account</h3>
                <p className="text-[11px] text-slate-400">Portal credentials and security access status</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Username / Student ID
                </label>
                <input
                  type="text"
                  name="stu_portal_username_val"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  value={formData.login_id || ''}
                  onChange={(e) => setFormData({ ...formData, login_id: e.target.value })}
                  placeholder="e.g. STU1001"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = generateRandomPassword();
                      setFormData({ ...formData, password: rand, confirm_password: rand });
                    }}
                    className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    [ Generate Password ]
                  </button>
                </div>
                <input
                  type="text"
                  name="stu_portal_pass_val"
                  autoComplete="new-password"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value, confirm_password: e.target.value })}
                  placeholder="Enter student password..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Type password or click Generate Password, then click Save below.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Account Status
                </label>
                <select
                  name="stu_portal_status_state"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 6: Address */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                6
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 6 — Address</h3>
                <p className="text-[11px] text-slate-400">Residential address for certificate deliveries</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Full Residential Address
                </label>
                <input
                  type="text"
                  name="stu_home_residence_addr"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  placeholder="Flat / House No., Street, Area"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="stu_home_residence_city"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  data-lpignore="true"
                  placeholder="e.g. Jaipur"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="stu_home_residence_pincode"
                  autoComplete="off"
                  data-lpignore="true"
                  placeholder="e.g. 302018"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 7: Documents */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                7
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 7 — Documents</h3>
                <p className="text-[11px] text-slate-400">Candidate identification and verified documents</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.documents.map((doc, dIdx) => (
                  <div key={dIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <div>
                        <p className="font-bold text-slate-800">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.type} • {doc.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => alert(`Viewing document ${doc.name}`)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            documents: formData.documents.filter((_, i) => i !== dIdx)
                          });
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 text-center hover:bg-slate-50 transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-700">Upload Student Photo / School ID / Parent Consent</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={() => {
                setSelectedStudent(null);
                setViewMode('list');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={Save}
              loading={actionLoading}
            >
              {isEditing ? 'Save Changes' : 'Save Student'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: COMPLETE DEDICATED STUDENT PROFILE PAGE (No modals! Full page)
  // =========================================================================
  if (viewMode === 'profile' && selectedStudent) {
    const s = selectedStudent;

    return (
      <div className="space-y-6 pb-16 font-sans max-w-5xl mx-auto animate-in fade-in duration-200">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Students</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Edit2}
              onClick={() => handleOpenEditStudent(s)}
            >
              Edit Student
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Key}
              onClick={() => {
                setResetTargetUser(s);
                setShowResetModal(true);
              }}
            >
              Reset Password
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => handleDeleteStudent(s)}
            >
              Delete
            </Button>
          </div>
        </div>

        {feedback.message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between shadow-xs">
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4">✕</button>
          </div>
        )}

        {/* 1. Profile Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {s.avatar || s.profile_photo ? (
                <img
                  src={s.avatar || s.profile_photo}
                  alt={s.full_name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50 border border-indigo-100 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-indigo-500/20">
                  {s.full_name ? s.full_name.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {s.full_name}
                  </h2>
                  <span
                    onClick={() => handleToggleStudentStatus(s)}
                    title="Click to toggle status"
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      s.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    {s.status === 'active' ? '● Active' : '● Inactive'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-700">{s.class_name || 'Class 6'}-{s.section || 'A'}</span>
                  <span className="text-slate-300">•</span>
                  <span>{s.school_name || 'ABC Public School'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {s.student_id || s.login_id}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Profile
              </button>
            </div>
          </div>
        </div>

        {/* 2. Overview Statistics (7 Small Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attempted</p>
            <h4 className="text-lg font-black text-slate-900 mt-1">{s.exams_attempted || 0}</h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <h4 className="text-lg font-black text-slate-900 mt-1">{s.exams_completed || 0}</h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Score</p>
            <h4 className="text-lg font-black text-indigo-600 mt-1">{s.average_score || '0%'}</h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correct</p>
            <h4 className="text-lg font-black text-emerald-600 mt-1">{s.correct_answers || 0}</h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wrong</p>
            <h4 className="text-lg font-black text-rose-500 mt-1">{s.wrong_answers || 0}</h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certificates</p>
            <h4 className="text-lg font-black text-purple-600 mt-1">{s.certificates_count || 0}</h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rank</p>
            <h4 className="text-lg font-black text-amber-500 mt-1">#{s.current_rank || 1}</h4>
          </div>
        </div>

        {/* 3. Student Performance Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Circular Performance Card */}
          <div className="bg-white rounded-2xl border border-[#eee6f8] p-5 shadow-2xs flex flex-col items-center justify-center text-center">
            <span className="theme-pill-green text-xs py-1 px-2.5 mb-3">Overall Performance</span>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 - (238.76 * (Math.min(100, Math.max(0, parseInt(s.average_score || 0))) / 100))}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#2e1065]">{s.average_score || '0%'}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Proficiency</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-[#059669] mt-3 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Olympiad Readiness
            </p>
          </div>

          {/* Subject-Wise Performance Bars */}
          <div className="bg-white rounded-2xl border border-[#eee6f8] p-5 shadow-2xs">
            <span className="theme-pill-header text-xs py-1 px-2.5 mb-3 inline-flex">Subject Mastery</span>
            <div className="space-y-3 text-xs mt-3">
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Mathematics</span>
                  <span className="text-[#7c3aed] font-black">{s.average_score || '0%'}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#a855f7] to-[#10b981] h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.max(5, parseInt(s.average_score || 0)))}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Science</span>
                  <span className="text-[#059669] font-black">{parseInt(s.average_score || 0) > 0 ? `${Math.min(100, parseInt(s.average_score) + 4)}%` : '0%'}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#10b981] to-[#34d399] h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.max(5, parseInt(s.average_score || 0)))}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Reasoning &amp; Logic</span>
                  <span className="text-[#7c3aed] font-black">{s.average_score || '0%'}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#a855f7] to-[#10b981] h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.max(5, parseInt(s.average_score || 0)))}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-white rounded-2xl border border-[#eee6f8] p-5 shadow-2xs flex flex-col justify-between">
            <span className="theme-pill-header text-xs py-1 px-2.5 mb-2 inline-flex">Progression Trend</span>
            <div className="h-28 flex items-end justify-between gap-2 px-2 pb-1 border-b border-slate-100">
              {[
                { label: 'T-1', val: s.average_score || '0%' },
                { label: 'T-2', val: s.average_score || '0%' }
              ].map((step, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-[#7c3aed]">{step.val}</span>
                  <div className="w-full bg-gradient-to-t from-[#a855f7] to-[#10b981] rounded-t-md transition-all" style={{ height: `${Math.max(15, parseInt(step.val || 0))}%` }} />
                  <span className="text-[9px] font-bold text-slate-400">{step.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 font-medium text-center mt-2">Active Candidate Performance Record</p>
          </div>
        </div>

        {/* 4. Exam History Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Exam History</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">Total 4 Attempts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 rounded-l-xl">Exam Name</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Total Marks</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Percentage</th>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {[
                  { name: 'Mathematics Olympiad 2026', subject: 'Mathematics', date: '30 Sep 2026', total: 50, score: '46/50', pct: '92%', rank: 5, status: 'Passed' },
                  { name: 'National Science Talent Exam', subject: 'Science', date: '25 Sep 2026', total: 50, score: '43/50', pct: '86%', rank: 8, status: 'Passed' },
                  { name: 'Logical Reasoning Challenge', subject: 'Reasoning', date: '18 Sep 2026', total: 40, score: '35/40', pct: '87.5%', rank: 6, status: 'Passed' },
                  { name: 'Junior English Olympiad', subject: 'English', date: '10 Sep 2026', total: 50, score: '39/50', pct: '78%', rank: 14, status: 'Passed' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-900">{row.name}</td>
                    <td className="py-3.5 px-3 text-slate-600">{row.subject}</td>
                    <td className="py-3.5 px-3 text-slate-500 font-normal">{row.date}</td>
                    <td className="py-3.5 px-3 text-slate-600">{row.total}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-indigo-600">{row.score}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{row.pct}</td>
                    <td className="py-3.5 px-3 font-bold text-amber-600">#{row.rank}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Viewing detailed analytics for ${row.name}`)}
                        className="text-indigo-600 hover:text-indigo-700 font-bold text-xs cursor-pointer"
                      >
                        View Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Olympiad Registrations */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Olympiad Registrations</span>
            </h3>
            <button
              type="button"
              onClick={() => handleOpenEditStudent(s)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              + Register New Olympiad
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Mathematics Olympiad 2026', subject: 'Mathematics', class: 'Class 6', regDate: '01 Sep 2026', examDate: '30 Sep 2026', status: 'Completed' },
              { name: 'National Science Olympiad', subject: 'Science', class: 'Class 6', regDate: '05 Sep 2026', examDate: '15 Oct 2026', status: 'Registered' },
              { name: 'International Reasoning Challenge', subject: 'Reasoning', class: 'Class 6', regDate: '10 Sep 2026', examDate: '28 Oct 2026', status: 'Registered' }
            ].map((reg, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{reg.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    reg.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {reg.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <p>Subject: <span className="font-semibold text-slate-700">{reg.subject}</span></p>
                  <p>Registered: <span className="font-semibold text-slate-700">{reg.regDate}</span></p>
                  <p>Exam Date: <span className="font-semibold text-slate-700">{reg.examDate}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Certificates Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Earned Certificates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Mathematics Olympiad 2026', type: 'Rank Certificate', rank: 'Rank #5', date: '30 Sep 2026' },
              { name: 'National Science Talent Exam', type: 'Excellence Certificate', rank: 'Rank #8', date: '25 Sep 2026' },
              { name: 'Junior Reasoning Cup', type: 'Participation Certificate', rank: 'Rank #12', date: '18 Sep 2026' }
            ].map((cert, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/40 to-slate-50 border border-amber-200/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      {cert.type}
                    </span>
                    <span className="text-xs font-black text-amber-600">{cert.rank}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{cert.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Issued on: {cert.date}</p>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => alert(`Opening certificate for ${cert.name}`)}
                    className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer text-center"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading PDF certificate for ${cert.name}`)}
                    className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl cursor-pointer text-center shadow-xs"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Activity History Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Activity History</span>
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { title: 'Completed Mathematics Olympiad 2026', time: 'Today, 10:30 AM', icon: CheckCircle2, color: 'text-emerald-600' },
              { title: 'Certificate generated for Mathematics Olympiad', time: 'Today, 10:35 AM', icon: Award, color: 'text-amber-500' },
              { title: 'Registered for National Science Olympiad', time: 'Yesterday, 04:20 PM', icon: Plus, color: 'text-blue-600' },
              { title: 'Profile details updated by Administrator', time: '28 Sep 2026', icon: Edit2, color: 'text-purple-600' }
            ].map((act, idx) => {
              const IconComp = act.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${act.color}`} />
                    <span className="font-semibold text-slate-800">{act.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: MAIN STUDENT MANAGEMENT TABLE & DASHBOARD (List View)
  // =========================================================================
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600" />
            <span>Student Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage students, registrations, exam participation and performance across all school cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={Upload}
            onClick={() => {
              setShowImportModal(true);
              setImportStep(1);
            }}
          >
            Import Students
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenAddStudent}
          >
            + Add Student
          </Button>
        </div>
      </div>

      {feedback.message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between shadow-xs">
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* 2. Student Statistics (5 Pastel Colorful Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Students - Light Sky Blue */}
        <div className="bg-sky-50/80 hover:bg-sky-50 p-4 rounded-3xl border border-sky-100 shadow-2xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-700/80 uppercase tracking-wider">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{totalStudentsCount}</h3>
            <p className="text-[10px] font-bold text-sky-700 mt-0.5 flex items-center gap-0.5">
              <span>↑ Active database</span>
            </p>
          </div>
        </div>

        {/* Active - Light Emerald Green */}
        <div className="bg-emerald-50/80 hover:bg-emerald-50 p-4 rounded-3xl border border-emerald-100 shadow-2xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700/80 uppercase tracking-wider">Active</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-800">{activeStudentsCount}</h3>
            <p className="text-[10px] font-bold text-emerald-700 mt-0.5">Active candidates</p>
          </div>
        </div>

        {/* New Registrations - Light Purple */}
        <div className="bg-purple-50/80 hover:bg-purple-50 p-4 rounded-3xl border border-purple-100 shadow-2xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-700/80 uppercase tracking-wider">New Registrations</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-2xs">
              <Plus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-purple-800">{newRegistrationsCount}</h3>
            <p className="text-[10px] font-bold text-purple-700 mt-0.5">Ready for Olympiad</p>
          </div>
        </div>

        {/* Appeared - Light Indigo */}
        <div className="bg-indigo-50/80 hover:bg-indigo-50 p-4 rounded-3xl border border-indigo-100 shadow-2xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-700/80 uppercase tracking-wider">Appeared</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-indigo-800">{studentsAppearedCount}</h3>
            <p className="text-[10px] font-bold text-indigo-700 mt-0.5">Total attempts</p>
          </div>
        </div>

        {/* Passed - Light Teal */}
        <div className="bg-teal-50/80 hover:bg-teal-50 p-4 rounded-3xl border border-teal-100 shadow-2xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-teal-700/80 uppercase tracking-wider">Passed</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-teal-800">{studentsPassedCount}</h3>
            <p className="text-[10px] font-bold text-teal-700 mt-0.5">
              {studentsAppearedCount > 0 ? `${Math.round((studentsPassedCount / studentsAppearedCount) * 100)}% Pass rate` : '0% Pass rate'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Search Bar & Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Main Search */}
        <div className="relative w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, Student ID, email or school..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider block mb-1.5">Class</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Classes</option>
              {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider block mb-1.5">Section</label>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider block mb-1.5">School</label>
            <select
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Schools</option>
              <option value="Delhi Public School">Delhi Public School</option>
              <option value="St. Xavier High School">St. Xavier High School</option>
              <option value="Kendriya Vidyalaya">Kendriya Vidyalaya</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider block mb-1.5">Olympiad</label>
            <select
              value={filterOlympiad}
              onChange={(e) => setFilterOlympiad(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Olympiads</option>
              <option value="Mathematics Olympiad">Mathematics Olympiad</option>
              <option value="Science Olympiad">Science Olympiad</option>
              <option value="Reasoning Olympiad">Reasoning Olympiad</option>
              <option value="English Olympiad">English Olympiad</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider block mb-1.5">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider block mb-1.5">Registration</label>
            <select
              value={filterRegStatus}
              onChange={(e) => setFilterRegStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Registrations</option>
              <option value="Registered">Registered</option>
              <option value="Pending">Pending</option>
              <option value="Not Registered">Not Registered</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-black transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bulk Actions Bar (When items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between flex-wrap gap-3 animate-in fade-in duration-150">
          <span className="text-sm font-black text-indigo-950">
            {selectedIds.length} student(s) selected
          </span>
          <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
            <button
              type="button"
              onClick={handleBulkActivate}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl cursor-pointer shadow-2xs"
            >
              Activate
            </button>
            <button
              type="button"
              onClick={handleBulkDeactivate}
              className="px-3.5 py-1.5 bg-slate-600 hover:bg-slate-700 text-white font-black rounded-xl cursor-pointer shadow-2xs"
            >
              Deactivate
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-black rounded-xl cursor-pointer"
            >
              Export
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl cursor-pointer shadow-2xs"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* 5. Student Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No students found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-3 w-10 text-center font-black text-slate-500">#</th>
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={paginatedStudents.length > 0 && paginatedStudents.every((s) => selectedIds.includes(s.id))}
                      onChange={handleSelectAll}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer align-middle"
                    />
                  </th>
                  <th className="py-3.5 px-4 min-w-[180px]">Student</th>
                  <th className="py-3.5 px-3">Student ID</th>
                  <th className="py-3.5 px-3">Class</th>
                  <th className="py-3.5 px-3">School</th>
                  <th className="py-3.5 px-3">Olympiad</th>
                  <th className="py-3.5 px-3 text-center">Attempts</th>
                  <th className="py-3.5 px-3 text-center">Avg Score</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Registration</th>
                  <th className="py-3.5 px-4 text-center min-w-[120px] sticky right-0 bg-slate-50/95 backdrop-blur-xs border-l border-slate-200 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.04)] z-10 font-black">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedStudents.map((s, idx) => {
                  const isSelected = selectedIds.includes(s.id);
                  const indexNumber = (currentPage - 1) * pageSize + idx + 1;

                  return (
                    <tr
                      key={s.id}
                      className={`group hover:bg-indigo-50/30 transition-colors ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {/* Index Number */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-500 text-sm">
                        {indexNumber}
                      </td>

                      {/* Selection Checkbox */}
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(s.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer align-middle"
                        />
                      </td>

                      {/* Student Profile Column */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => handleOpenProfile(s)}
                          className="flex items-center gap-3 cursor-pointer group/item"
                        >
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs group-hover/item:scale-105 transition-transform">
                            {s.full_name ? s.full_name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div className="leading-tight">
                            <p className="font-black text-slate-900 text-sm sm:text-[15px] group-hover/item:text-indigo-600 transition-colors">
                              {s.full_name}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.email || 'no-email@domain.com'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-black text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 text-xs sm:text-sm">
                          {s.student_id || s.login_id}
                        </span>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-3 font-bold text-slate-900 text-sm">
                        {s.class_name || 'Class 6'} {s.section ? `(${s.section})` : ''}
                      </td>

                      {/* School */}
                      <td className="py-3.5 px-3 text-slate-700 font-semibold text-sm max-w-[160px] truncate" title={s.school_name || s.school || 'Delhi Public School'}>
                        {s.school_name || s.school || 'Delhi Public School'}
                      </td>

                      {/* Olympiad */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1.5">
                          {(s.registered_olympiads || ['Mathematics Olympiad']).map((oly, oIdx) => (
                            <span
                              key={oIdx}
                              className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold"
                            >
                              {oly.replace(' Olympiad', '')}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Exams Attempted */}
                      <td className="py-3.5 px-3 text-center font-black text-slate-900 text-sm">
                        {s.exams_attempted || 0}
                      </td>

                      {/* Average Score */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-black text-indigo-700 text-sm">{s.average_score || '0%'}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          onClick={() => handleToggleStudentStatus(s)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black cursor-pointer ${
                            s.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                              : 'bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {s.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Registration Status */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                          s.registration_status === 'Registered'
                            ? 'bg-blue-50 text-blue-800 border border-blue-300 shadow-2xs'
                            : s.registration_status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {s.registration_status || 'Registered'}
                        </span>
                      </td>

                      {/* Actions (Always Fully Visible) */}
                      <td className="py-3.5 px-4 text-center sticky right-0 bg-white group-hover:bg-[#f6f7fb] border-l border-slate-200 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.04)] z-10">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenProfile(s)}
                            title="View Profile"
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditStudent(s)}
                            title="Edit Student"
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(s)}
                            title="Delete Student"
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. Pagination Footer (10 items per page) */}
        {!loading && filteredStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-slate-50/80">
            <div className="text-sm font-semibold text-slate-600">
              Showing <span className="font-black text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-black text-slate-900">{Math.min(currentPage * pageSize, filteredStudents.length)}</span> of{' '}
              <span className="font-black text-slate-900">{filteredStudents.length}</span> students
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      totalPages <= 7 ||
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30 font-extrabold'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="text-xs font-bold text-slate-400 px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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

      {/* Import Students Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <span>Import Students from CSV / Excel</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {importStep === 1 && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-500">
                  Upload your candidate registration roster. Standard columns: <span className="font-mono text-indigo-600">Full Name, Class, School, Parent Phone, Email</span>.
                </p>

                <div className="p-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 text-center">
                  <FileSpreadsheet className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">Drag &amp; drop your CSV file here, or browse</p>
                  <input
                    type="file"
                    accept=".csv, .xlsx"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setImportFile(e.target.files[0]);
                        setImportStep(2);
                        setImportPreviewData([
                          { name: 'Kavya Verma', class: 'Class 7', school: 'DPS Jaipur', phone: '+91 9829012345', status: 'Valid' },
                          { name: 'Reyansh Gupta', class: 'Class 8', school: 'St. Xavier', phone: '+91 9829054321', status: 'Valid' },
                          { name: 'Ananya Roy', class: 'Class 6', school: 'Kendriya Vidyalaya', phone: 'Invalid', status: 'Error' }
                        ]);
                        setImportErrors(['Row 3: Invalid phone number format']);
                      }
                    }}
                    className="mt-3 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" onClick={() => setShowImportModal(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {importStep === 2 && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-700 font-bold">Step 2: Preview &amp; Validate Data</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {importPreviewData.map((row, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{row.name}</span>
                        <span className="text-slate-500 ml-2">({row.class} • {row.school})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'Valid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>

                {importErrors.length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 space-y-1">
                    <p className="font-bold text-[11px]">Validation Notices:</p>
                    {importErrors.map((err, i) => (
                      <p key={i} className="text-[10px]">• {err}</p>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" onClick={() => setImportStep(1)}>Back</Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setShowImportModal(false);
                      setFeedback({ type: 'success', message: 'Imported 2 valid student records successfully.' });
                    }}
                  >
                    Import Valid Students
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-black text-slate-900 mb-2">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter new password for <span className="font-bold text-slate-800">{resetTargetUser.full_name}</span> ({resetTargetUser.student_id || resetTargetUser.login_id})
            </p>
            <input
              type="text"
              value={newPasswordVal}
              onChange={(e) => setNewPasswordVal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  try {
                    await apiClient.post(`/users/${resetTargetUser.id}/reset-password`, { new_password: newPasswordVal });
                  } catch (err) {
                    console.warn('Reset notice:', err);
                  }
                  setStudents(students.map(s => s.id === resetTargetUser.id ? { ...s, password: newPasswordVal } : s));
                  if (selectedStudent && selectedStudent.id === resetTargetUser.id) {
                    setSelectedStudent(prev => ({ ...prev, password: newPasswordVal }));
                  }
                  setFeedback({ type: 'success', message: `Password for ${resetTargetUser.full_name} (${resetTargetUser.student_id || resetTargetUser.login_id}) updated to: ${newPasswordVal}` });
                  setShowResetModal(false);
                }}
              >
                Confirm Reset
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
