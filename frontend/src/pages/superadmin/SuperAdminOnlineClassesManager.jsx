import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../api/client';
import { useCart } from '../../contexts/CartContext';
import {
  Video,
  Play,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  Calendar,
  Users,
  Building,
  Tag,
  DollarSign,
  Save,
  X,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Star,
  Zap,
  Check,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

const CLASSES_LIST = [
  'All Classes',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

const SUBJECTS_LIST = [
  'All Subjects',
  'Mathematics (IMO)',
  'Science (ISO/NSO)',
  'Digital Literacy (IDLO)',
  'English (IEO)',
  'General Knowledge (IGKO)',
  'Hindi (IHO)'
];

export const SuperAdminOnlineClassesManager = ({ onNavigateTab }) => {
  const { addToCart, openCart } = useCart();
  // Active Management Section
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'hero_banner' | 'lectures' | 'batches'

  // Data States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [heroBanner, setHeroBanner] = useState({
    badge: 'FEATURED',
    title: 'Reasoning Online Classes for IMO, ISO(NSO) & IEO',
    subtitle: 'Get expert guidance and improve your problem-solving skills.',
    button_text: 'ENROLL NOW →',
    button_action: 'packages',
    is_active: true
  });

  const [packages, setPackages] = useState([]);
  const [batches, setBatches] = useState([]);
  const [lectures, setLectures] = useState([]);

  // Filters
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({
    title: '',
    class_name: 'Class 6',
    subject: 'Reasoning (ISSO)',
    subject_code: 'ISSO',
    package_type: 'self_paced',
    price: 2499,
    original_price: 3499,
    badge_text: 'Bestseller',
    header_color: '#80497D',
    status: 'active',
    special_offer_text: 'Special Offer: 3499.00 — 2499.00',
    featuresText: 'Watch, rewind, pause, replay and revise anytime at your own pace\nStructured series of Recorded Concept classes.\nChapter-wise Presentation Videos for self-paced study\nChapter-wise Assignments for additional practice\nChapter-wise Quiz for quick revision\nPrevious Year Papers (2024 & 2025) for practice and pattern understanding\nReasoning Skill Development Program (RSDP) with Reasoning Recorded Concept classes.\nLogical Reasoning Previous Year\'s Questions\nIntelligent Olympiad Test Generator built for smart Olympiad preparation.',
    sec1_title: 'Recorded Classes',
    sec1_items: 'Total 25 Recorded Classes – Learn, Revisit & Revise Anytime\nRecorded classes covering the entire syllabus - Chapter-wise\n2 Previous Year Papers (2024 & 2025)',
    sec2_title: 'Practice & Tests',
    sec2_items: 'Chapter-wise Presentation Videos for practice and reinforcement\nChapter-wise Assignments for additional practice\nChapter-wise Quizzes for quick revision\n2 Level-1 Previous Year Papers (2024 & 2025)',
    sec3_title: 'Intelligent Olympiad Test Generator',
    sec3_items: 'A bigger, "Intelligent" question bank\nSmart Question Selection\nGenerate upto 10 personalised tests'
  });

  // Batch Modal
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchForm, setBatchForm] = useState({
    name: '',
    class_name: 'Class 6',
    subject: 'Mathematics (IMO)',
    faculty_name: 'Senior Olympiad Faculty',
    schedule: 'Mon, Wed, Fri • 5:00 PM - 6:30 PM',
    meeting_link: 'https://meet.google.com/oly-live',
    max_capacity: 50
  });

  // Import / Export State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importLoading, setImportLoading] = useState(false);

  const handleDownloadClassesTemplate = () => {
    const headers = ['title', 'class_name', 'subject', 'price', 'original_price', 'badge_text', 'package_type', 'status'];
    const sample = [
      'Master Reasoning & Problem Solving 2026', 'Class 6', 'Reasoning (ISSO)', '2499', '3499', 'Bestseller', 'self_paced', 'active'
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sample.map(s => `"${s}"`).join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'online_classes_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportClassesCSV = () => {
    if (!packages || packages.length === 0) {
      alert('No course packages available to export.');
      return;
    }
    const headers = ['ID', 'Package Title', 'Class', 'Subject', 'Price (INR)', 'Original Price', 'Badge', 'Type', 'Status'];
    const rows = packages.map(p => [
      p.id || '',
      `"${(p.title || '').toString().replace(/"/g, '""')}"`,
      `"${(p.class_name || '').toString().replace(/"/g, '""')}"`,
      `"${(p.subject || '').toString().replace(/"/g, '""')}"`,
      p.price || 0,
      p.original_price || 0,
      `"${(p.badge_text || '').toString().replace(/"/g, '""')}"`,
      p.package_type || 'self_paced',
      p.status || 'active'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `online_classes_packages_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback({ type: 'success', message: `Successfully exported ${packages.length} course packages to CSV!` });
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) {
      alert('Please paste CSV or JSON data to import.');
      return;
    }
    setImportLoading(true);
    try {
      let imported = [];
      const trimmed = importText.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        imported = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error('CSV must contain a header row and at least 1 record.');
        const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/^["']|["']$/g, '').trim());
          const obj = {};
          headers.forEach((h, idx) => {
            obj[h] = values[idx] || '';
          });
          imported.push({
            id: `cls_pkg_${Date.now()}_${i}`,
            title: obj.title || 'Special Online Concept Masterclass',
            class_name: obj.class_name || 'Class 6',
            subject: obj.subject || 'Reasoning (ISSO)',
            price: Number(obj.price) || 2499,
            original_price: Number(obj.original_price) || 3499,
            badge_text: obj.badge_text || 'Featured',
            package_type: obj.package_type || 'self_paced',
            status: obj.status || 'active',
            header_color: '#80497D'
          });
        }
      }
      if (imported.length === 0) throw new Error('No valid class packages found.');
      const updated = [...imported, ...packages];
      setPackages(updated);
      try {
        localStorage.setItem('olympiadhub_online_packages_v1', JSON.stringify(updated));
      } catch (e) {}
      setShowImportModal(false);
      setImportText('');
      setFeedback({ type: 'success', message: `Successfully imported ${imported.length} new course packages!` });
    } catch (err) {
      alert(err.message || 'Failed to parse import data.');
    } finally {
      setImportLoading(false);
    }
  };

  // Bank & Payment Settings State
  const [bankSettings, setBankSettings] = useState({
    bank_name: 'State Bank of India',
    account_holder_name: 'OlympiadHub Official Organization',
    account_number: '398450123984',
    ifsc_code: 'SBIN0005432',
    branch_name: 'Central Hub Branch, New Delhi',
    account_type: 'Current Account',
    upi_id: 'olympiadhub.edu@okaxis',
    upi_phone: '+91 98765 43210',
    instructions: 'Please transfer the exact total payable amount via UPI / IMPS / NEFT. After completing payment, enter your 12-digit UTR / Transaction Reference Number below to confirm and activate your package immediately.',
    is_active: 1
  });
  const [bankSaveLoading, setBankSaveLoading] = useState(false);

  // Student Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Lecture Modal
  const [lectureModalOpen, setLectureModalOpen] = useState(false);
  const [lectureForm, setLectureForm] = useState({
    title: '',
    subject: 'Mathematics (IMO)',
    class_name: 'Class 6',
    category: 'CONCEPT LECTURE',
    duration: '45 mins',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    desc: ''
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/online-classes');
      if (res.success && res.data) {
        setHeroBanner(res.data.hero_banner || heroBanner);
        setPackages(res.data.packages || []);
        setBatches(res.data.batches || []);
        setLectures(res.data.lectures || []);
      }
      fetchBankSettings();
      fetchOrders();
    } catch (err) {
      console.error('Failed to load online classes studio:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankSettings = async () => {
    try {
      const res = await apiClient.get('/payment/bank-settings');
      if (res?.data) {
        setBankSettings(res.data);
      }
    } catch (e) {
      console.warn('Bank settings load error:', e);
    }
  };

  const handleSaveBankSettings = async (e) => {
    if (e) e.preventDefault();
    setBankSaveLoading(true);
    try {
      const res = await apiClient.post('/payment/bank-settings', bankSettings);
      if (res?.success) {
        setFeedback({ type: 'success', message: 'Bank details and UPI settings saved in MySQL successfully!' });
      }
    } catch (err) {
      alert(err.message || 'Error saving bank settings');
    } finally {
      setBankSaveLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await apiClient.get('/payment/orders');
      if (res?.data) {
        setOrders(res.data);
      }
    } catch (e) {
      console.warn('Orders load error:', e);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/payment/orders/${orderId}/status`, { status: newStatus });
      setFeedback({ type: 'success', message: `Order #${orderId} status updated to ${newStatus}.` });
      fetchOrders();
    } catch (e) {
      alert(e.message || 'Failed to update order status');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchClass = selectedClass === 'All Classes' || pkg.class_name === selectedClass;
      const matchSubject = selectedSubject === 'All Subjects' || 
        pkg.subject?.toLowerCase().includes(selectedSubject.toLowerCase()) ||
        pkg.title?.toLowerCase().includes(selectedSubject.toLowerCase());
      const matchSearch = !searchQuery || 
        pkg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.class_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSubject && matchSearch;
    });
  }, [packages, selectedClass, selectedSubject, searchQuery]);

  // Open Create Modal
  const handleOpenCreatePackage = () => {
    setEditingPackage(null);
    setPackageForm({
      title: 'Olympiads Self-Paced Recorded Concept Classes - Class 6',
      class_name: selectedClass !== 'All Classes' ? selectedClass : 'Class 6',
      subject: 'Reasoning (ISSO)',
      subject_code: 'ISSO',
      package_type: 'self_paced',
      price: 2499,
      original_price: 3499,
      badge_text: 'Bestseller',
      header_color: '#80497D',
      status: 'active',
      special_offer_text: 'Special Offer: 3499.00 — 2499.00',
      featuresText: 'Watch, rewind, pause, replay and revise anytime at your own pace\nStructured series of Recorded Concept classes.\nChapter-wise Presentation Videos for self-paced study\nChapter-wise Assignments for additional practice\nChapter-wise Quiz for quick revision\nPrevious Year Papers (2024 & 2025) for practice and pattern understanding\nReasoning Skill Development Program (RSDP) with Reasoning Recorded Concept classes.\nLogical Reasoning Previous Year\'s Questions\nIntelligent Olympiad Test Generator built for smart Olympiad preparation.',
      sec1_title: 'Recorded Classes',
      sec1_items: 'Total 25 Recorded Classes – Learn, Revisit & Revise Anytime\nRecorded classes covering the entire syllabus - Chapter-wise\n2 Previous Year Papers (2024 & 2025)',
      sec2_title: 'Practice & Tests',
      sec2_items: 'Chapter-wise Presentation Videos for practice and reinforcement\nChapter-wise Assignments for additional practice\nChapter-wise Quizzes for quick revision\n2 Level-1 Previous Year Papers (2024 & 2025)',
      sec3_title: 'Intelligent Olympiad Test Generator',
      sec3_items: 'A bigger, "Intelligent" question bank\nSmart Question Selection\nGenerate upto 10 personalised tests'
    });
    setPackageModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditPackage = (pkg) => {
    setEditingPackage(pkg);
    const sec1 = pkg.sections?.[0] || { title: 'Recorded Classes', items: [] };
    const sec2 = pkg.sections?.[1] || { title: 'Practice & Tests', items: [] };
    const sec3 = pkg.sections?.[2] || { title: 'Intelligent Olympiad Test Generator', items: [] };

    setPackageForm({
      title: pkg.title || '',
      class_name: pkg.class_name || 'Class 6',
      subject: pkg.subject || 'Reasoning (ISSO)',
      subject_code: pkg.subject_code || 'ISSO',
      package_type: pkg.package_type || 'self_paced',
      price: pkg.price || 2499,
      original_price: pkg.original_price || 3499,
      badge_text: pkg.badge_text || 'Special Offer',
      header_color: pkg.header_color || '#80497D',
      status: pkg.status || 'active',
      special_offer_text: pkg.special_offer_text || '',
      featuresText: Array.isArray(pkg.features) ? pkg.features.join('\n') : '',
      sec1_title: sec1.title || 'Recorded Classes',
      sec1_items: Array.isArray(sec1.items) ? sec1.items.join('\n') : '',
      sec2_title: sec2.title || 'Practice & Tests',
      sec2_items: Array.isArray(sec2.items) ? sec2.items.join('\n') : '',
      sec3_title: sec3.title || 'Intelligent Olympiad Test Generator',
      sec3_items: Array.isArray(sec3.items) ? sec3.items.join('\n') : ''
    });
    setPackageModalOpen(true);
  };

  // Save Package Handler
  const handleSavePackage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!packageForm.title.trim()) {
      alert('Please enter package title');
      return;
    }

    const payload = {
      title: packageForm.title.trim(),
      class_name: packageForm.class_name,
      subject: packageForm.subject,
      subject_code: packageForm.subject_code,
      package_type: packageForm.package_type,
      price: parseFloat(packageForm.price) || 0,
      original_price: parseFloat(packageForm.original_price) || 0,
      badge_text: packageForm.badge_text,
      header_color: packageForm.header_color,
      status: packageForm.status,
      special_offer_text: packageForm.special_offer_text,
      features: packageForm.featuresText.split('\n').map(s => s.trim()).filter(Boolean),
      sections: [
        {
          title: packageForm.sec1_title,
          color: 'blue',
          items: packageForm.sec1_items.split('\n').map(s => s.trim()).filter(Boolean)
        },
        {
          title: packageForm.sec2_title,
          color: 'purple',
          items: packageForm.sec2_items.split('\n').map(s => s.trim()).filter(Boolean)
        },
        {
          title: packageForm.sec3_title,
          color: 'green',
          items: packageForm.sec3_items.split('\n').map(s => s.trim()).filter(Boolean)
        }
      ]
    };

    setActionLoading(true);
    try {
      if (editingPackage) {
        await apiClient.put(`/online-classes/${editingPackage.id}`, payload);
        setFeedback({ type: 'success', message: `Course Package "${payload.title}" updated successfully.` });
      } else {
        await apiClient.post('/online-classes', payload);
        setFeedback({ type: 'success', message: `New Course Package "${payload.title}" published successfully.` });
      }
      setPackageModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error saving package');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Package Handler
  const handleDeletePackage = async (pkg) => {
    try {
      await apiClient.delete(`/online-classes/${pkg.id}`);
      setFeedback({ type: 'success', message: 'Course package deleted successfully.' });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete package');
    }
  };

  // Save Hero Banner
  const handleSaveHeroBanner = async () => {
    setActionLoading(true);
    try {
      await apiClient.post('/online-classes/hero', heroBanner);
      setFeedback({ type: 'success', message: 'Featured Hero Banner configuration saved successfully.' });
    } catch (err) {
      alert(err.message || 'Error saving hero banner');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Batch
  const handleSaveBatch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setActionLoading(true);
    try {
      await apiClient.post('/online-classes/batches', batchForm);
      setFeedback({ type: 'success', message: 'Live Batch created successfully.' });
      setBatchModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error creating batch');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      await apiClient.delete(`/online-classes/batches/${batchId}`);
      fetchData();
    } catch (e) {
      alert(e.message);
    }
  };

  // Save Lecture
  const handleSaveLecture = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setActionLoading(true);
    try {
      await apiClient.post('/online-classes/lectures', lectureForm);
      setFeedback({ type: 'success', message: 'Concept lecture video uploaded successfully.' });
      setLectureModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error creating lecture');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLecture = async (lecId) => {
    try {
      await apiClient.delete(`/online-classes/lectures/${lecId}`);
      fetchData();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans max-w-7xl mx-auto">
      {/* 1. Header Banner & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#ebd7eb]/60">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#80497D]/10 text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-xs">
            <Video className="w-6 h-6 sm:w-7 sm:h-7 text-[#80497D]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#422240] tracking-tight">
              Online Classes &amp; Course Packages Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Create, customize, price, and manage interactive concept batches, self-paced recorded packages, and video lectures.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80">
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleDownloadClassesTemplate}
            >
              Template
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Upload}
              onClick={() => setShowImportModal(true)}
            >
              Import CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportClassesCSV}
            >
              Export CSV
            </Button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setBatchModalOpen(true)}
          >
            Live Batch
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Video}
            onClick={() => setLectureModalOpen(true)}
          >
            Video Lecture
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreatePackage}
          >
            + Create Course Package
          </Button>
        </div>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-2xl border text-sm flex items-center justify-between shadow-xs ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span className="font-bold">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4 text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* 2. Rich Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Packages */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebd7eb] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f4eaf4] text-[#80497D] flex items-center justify-center border border-[#ebd7eb] shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Packages</p>
            <h3 className="text-2xl font-black text-[#80497D] mt-0.5 font-mono">{packages.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Self-paced &amp; bundles</p>
          </div>
        </div>

        {/* Live Batches */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebd7eb] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#C35B3F] flex items-center justify-center border border-orange-100 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Batches</p>
            <h3 className="text-2xl font-black text-[#C35B3F] mt-0.5 font-mono">{batches.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Interactive sessions</p>
          </div>
        </div>

        {/* Video Lectures */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebd7eb] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Video Lectures</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5 font-mono">{lectures.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Chapter-wise topics</p>
          </div>
        </div>

        {/* Total Enrollments */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebd7eb] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrollments</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
              {packages.reduce((acc, p) => acc + (p.enrolled_students || 0), 0) + 120}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Students enrolled</p>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2.5 border-b border-[#ebd7eb] pb-3 overflow-x-auto">
        {[
          { id: 'packages', label: 'Course Packages & Bundles', icon: Layers, count: packages.length },
          { id: 'hero_banner', label: 'Featured Hero Banner', icon: Sparkles },
          { id: 'lectures', label: 'Video Lectures & Recordings', icon: Video, count: lectures.length },
          { id: 'batches', label: 'Live Batches & Timetable', icon: Calendar, count: batches.length },
          { id: 'bank_settings', label: '💳 Bank & UPI Details', icon: Building },
          { id: 'orders', label: '📑 Student Orders & UTRs', icon: DollarSign, count: orders.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-md shadow-blue-950/20 border border-[#7854d6]/30'
                  : 'bg-white text-slate-600 border border-[#ebd7eb] hover:bg-slate-50 hover:text-[#16327a]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#16327a]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: COURSE PACKAGES & BUNDLES (Matches Image 2 & Image 3) */}
      {/* ========================================================================= */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#ebd7eb] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search packages by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                />
              </div>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
              >
                {CLASSES_LIST.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
              >
                {SUBJECTS_LIST.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-bold text-slate-500">
                Showing <span className="text-[#80497D] font-black">{filteredPackages.length}</span> packages
              </span>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleOpenCreatePackage}
              >
                Create Package
              </Button>
            </div>
          </div>

          {/* Packages Grid (Exact visual match with Image 2 & Image 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => {
              const sec1 = pkg.sections?.[0];
              const sec2 = pkg.sections?.[1];
              const sec3 = pkg.sections?.[2];

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl border-2 border-[#ebd7eb] hover:border-[#80497D] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Header Tag / Bar */}
                  <div
                    className="p-4 text-white font-black text-center text-sm sm:text-base flex items-center justify-between"
                    style={{ backgroundColor: pkg.header_color || '#d49b28' }}
                  >
                    <div className="text-left">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                        {pkg.badge_text || 'Olympiad Course'}
                      </span>
                      <h3 className="text-sm sm:text-base font-black mt-0.5 leading-snug">
                        {pkg.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-white/20 px-2 py-1 rounded-xl">
                      <button
                        onClick={() => handleOpenEditPackage(pkg)}
                        className="p-1 hover:bg-white/30 rounded text-white transition-colors cursor-pointer"
                        title="Edit Package"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg)}
                        className="p-1 hover:bg-rose-500/80 rounded text-white transition-colors cursor-pointer"
                        title="Delete Package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 text-xs flex-1">
                    {/* If package has structured colorful sections (Blue, Purple, Green boxes like in Image 3) */}
                    {pkg.sections && pkg.sections.length > 0 ? (
                      <div className="space-y-3">
                        {sec1 && (
                          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-950">
                            <p className="font-bold flex items-center gap-1.5 text-blue-900 mb-1.5 text-xs">
                              <span>📖</span> {sec1.title}
                            </p>
                            <ul className="space-y-1 text-[11px] text-blue-800 list-disc pl-4">
                              {sec1.items?.map((it, i) => (
                                <li key={i}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {sec2 && (
                          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-purple-950">
                            <p className="font-bold flex items-center gap-1.5 text-purple-900 mb-1.5 text-xs">
                              <span>📝</span> {sec2.title}
                            </p>
                            <ul className="space-y-1 text-[11px] text-purple-800 list-disc pl-4">
                              {sec2.items?.map((it, i) => (
                                <li key={i}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {sec3 && (
                          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950">
                            <p className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1.5 text-xs">
                              <span>✨</span> {sec3.title}
                            </p>
                            <ul className="space-y-1 text-[11px] text-emerald-800 list-disc pl-4">
                              {sec3.items?.map((it, i) => (
                                <li key={i}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Flat Checkmark List (Matches Image 2) */
                      <div className="space-y-2.5">
                        {(pkg.features || []).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug text-xs">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Special Offer Banner (Yellow box like in Image 3) */}
                    {pkg.special_offer_text && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">🏷️ Special Offer</span>
                        <span className="font-mono">{pkg.special_offer_text}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Pricing Footer */}
                  <div className="p-5 bg-slate-50/80 border-t border-[#ebd7eb] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 line-through text-xs font-bold mr-2 font-mono">
                          ₹ {pkg.original_price}
                        </span>
                        <span className="text-slate-700 text-xs font-bold mr-1">Price :</span>
                        <span className="text-xl font-black text-slate-900 font-mono">
                          ₹ {pkg.price}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                        {pkg.status === 'active' ? '● Active in Portal' : 'Draft'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPackage(pkg)}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#422240] hover:bg-[#321630] text-white transition-all cursor-pointer text-center"
                      >
                        VIEW DETAILS (EDIT)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart({
                            id: pkg.id,
                            name: pkg.title,
                            price: pkg.price,
                            originalPrice: pkg.original_price,
                            grade: pkg.class_name,
                            category: pkg.subject,
                            quantity: 1
                          });
                          openCart();
                        }}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#C35B3F] hover:bg-[#a6472d] text-white transition-all cursor-pointer text-center font-black"
                      >
                        BUY PREVIEW
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: FEATURED HERO BANNER (Matches Image 1) */}
      {/* ========================================================================= */}
      {activeTab === 'hero_banner' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#ebd7eb] shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900">Featured Online Classes Banner Customizer</h2>
              <p className="text-xs text-slate-500">
                Configure the primary prominent banner shown at the top of the Online Classes portal (as shown in student dashboard).
              </p>
            </div>

            {/* Live Visual Preview (Matches Image 1) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Live Student Preview:</p>
              <div className="rounded-3xl p-6 bg-white border border-[#ebd7eb] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-[#80497D] shrink-0">
                    <BookOpen className="w-7 h-7 text-[#80497D]" />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#f4eaf4] text-[#80497D] border border-[#ebd7eb] mb-1">
                      {heroBanner.badge || 'FEATURED'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                      {heroBanner.title || 'Reasoning Online Classes for IMO, ISO(NSO) & IEO'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {heroBanner.subtitle || 'Get expert guidance and improve your problem-solving skills.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white text-xs font-black tracking-wide shrink-0 transition-all shadow-md shadow-blue-950/20 cursor-pointer border border-[#7854d6]/30"
                >
                  {heroBanner.button_text || 'ENROLL NOW →'}
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={heroBanner.badge}
                  onChange={(e) => setHeroBanner({ ...heroBanner, badge: e.target.value })}
                  placeholder="e.g. FEATURED"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={heroBanner.button_text}
                  onChange={(e) => setHeroBanner({ ...heroBanner, button_text: e.target.value })}
                  placeholder="e.g. ENROLL NOW →"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  value={heroBanner.title}
                  onChange={(e) => setHeroBanner({ ...heroBanner, title: e.target.value })}
                  placeholder="e.g. Reasoning Online Classes for IMO, ISO(NSO) & IEO"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={heroBanner.subtitle}
                  onChange={(e) => setHeroBanner({ ...heroBanner, subtitle: e.target.value })}
                  placeholder="e.g. Get expert guidance and improve your problem-solving skills."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="md"
                icon={Save}
                loading={actionLoading}
                onClick={handleSaveHeroBanner}
              >
                Save Hero Banner Configuration
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: VIDEO LECTURES REPOSITORY */}
      {/* ========================================================================= */}
      {activeTab === 'lectures' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">Recorded Video Lectures Bank</h2>
              <p className="text-xs text-slate-500">Manage recorded masterclasses, presentation videos, and chapter-wise concepts.</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setLectureModalOpen(true)}
            >
              + Add Video Lecture
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lectures.map(lec => (
              <div key={lec.id} className="bg-white rounded-3xl border border-[#ebd7eb] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700">
                      {lec.subject}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lec.duration}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{lec.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lec.desc || 'Comprehensive conceptual lesson covering full chapter syllabus.'}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={lec.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#80497D] hover:underline"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Watch Lecture
                  </a>
                  <button
                    onClick={() => handleDeleteLecture(lec.id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: LIVE BATCHES & TIMETABLE */}
      {/* ========================================================================= */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">Live Interactive Batches &amp; Timetable</h2>
              <p className="text-xs text-slate-500">Configure online live batch schedules, faculty assignments, and meeting URLs.</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setBatchModalOpen(true)}
            >
              + Create Live Batch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {batches.map(batch => (
              <div key={batch.id} className="bg-white rounded-3xl border border-[#ebd7eb] p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f4eaf4] text-[#80497D] border border-[#ebd7eb]">
                    {batch.class_name} • {batch.subject}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    ● Active Live
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{batch.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#80497D]" /> Faculty: {batch.faculty_name}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C35B3F]" /> {batch.schedule}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-500 font-mono text-[11px] truncate max-w-xs">{batch.meeting_link}</span>
                  <a
                    href={batch.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#80497D] font-bold hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    Join Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-600">
                    Enrolled: <span className="text-[#80497D] font-black">{batch.enrolled_count || 0}</span> / {batch.max_capacity}
                  </span>
                  <button
                    onClick={() => handleDeleteBatch(batch.id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    Delete Batch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: BANK & UPI PAYMENT SETTINGS (Admin Configuration)              */}
      {/* ========================================================================= */}
      {activeTab === 'bank_settings' && (
        <div className="bg-white rounded-3xl border border-[#ebd7eb] p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-[#422240] tracking-tight">
              Official Bank &amp; UPI Payment Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details are displayed to students during package checkout for direct UPI / IMPS / NEFT payment.
            </p>
          </div>

          <form onSubmit={handleSaveBankSettings} className="space-y-5 text-xs max-w-3xl">
            {/* Bank Information Grid */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-4">
              <h3 className="font-black text-indigo-950 text-xs flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>Bank Account Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankSettings.bank_name}
                    onChange={(e) => setBankSettings({ ...bankSettings, bank_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={bankSettings.account_holder_name}
                    onChange={(e) => setBankSettings({ ...bankSettings, account_holder_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankSettings.account_number}
                    onChange={(e) => setBankSettings({ ...bankSettings, account_number: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={bankSettings.ifsc_code}
                    onChange={(e) => setBankSettings({ ...bankSettings, ifsc_code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold uppercase text-indigo-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={bankSettings.branch_name}
                    onChange={(e) => setBankSettings({ ...bankSettings, branch_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Account Type</label>
                  <select
                    value={bankSettings.account_type}
                    onChange={(e) => setBankSettings({ ...bankSettings, account_type: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Current Account">Current Account</option>
                    <option value="Savings Account">Savings Account</option>
                  </select>
                </div>
              </div>
            </div>

            {/* UPI Information Grid */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-4">
              <h3 className="font-black text-amber-950 text-xs flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-600" />
                <span>UPI &amp; QR Code Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Official UPI ID</label>
                  <input
                    type="text"
                    value={bankSettings.upi_id}
                    onChange={(e) => setBankSettings({ ...bankSettings, upi_id: e.target.value })}
                    placeholder="e.g. olympiadhub@okaxis"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">UPI Phone Number</label>
                  <input
                    type="text"
                    value={bankSettings.upi_phone}
                    onChange={(e) => setBankSettings({ ...bankSettings, upi_phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Instructions for Student</label>
                <textarea
                  rows={2}
                  value={bankSettings.instructions}
                  onChange={(e) => setBankSettings({ ...bankSettings, instructions: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={Save}
              loading={bankSaveLoading}
            >
              Save Bank &amp; UPI Settings in MySQL
            </Button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: STUDENT ORDERS & PAYMENT UTR VERIFICATION                      */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#ebd7eb] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-black text-[#422240] tracking-tight">
                Student Orders &amp; Payment Verifications
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review student purchases, entered Transaction IDs / UTR codes, billing addresses, and order status.
              </p>
            </div>

            <Button variant="secondary" size="sm" onClick={fetchOrders} loading={ordersLoading}>
              Refresh Orders
            </Button>
          </div>

          {/* Orders Table */}
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-bold">No orders recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Student / Billing Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Package Details</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">UTR / Txn ID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-bold text-slate-900">{ord.order_id}</td>
                      <td className="p-3 font-bold">{ord.billing_name || ord.student_name}</td>
                      <td className="p-3 text-[11px] text-slate-500">
                        <div>{ord.student_email}</div>
                        <div>{ord.student_phone || ord.mobile_number}</div>
                      </td>
                      <td className="p-3 text-[11px]">{ord.package_title}</td>
                      <td className="p-3 font-mono font-black text-emerald-700">₹{Number(ord.price || ord.total_amount).toFixed(2)}</td>
                      <td className="p-3 font-mono font-bold text-indigo-700 bg-indigo-50/40 rounded">
                        {ord.transaction_id || 'N/A'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        {ord.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT PACKAGE */}
      {/* ========================================================================= */}
      {packageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingPackage ? 'Edit Course Package' : 'Create New Course Package'}
                </h3>
                <p className="text-xs text-slate-400">Configure online class package details, pricing, and structured sections.</p>
              </div>
              <button onClick={() => setPackageModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Package Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Olympiads Self-Paced Recorded Concept Classes - Class 6"
                  value={packageForm.title}
                  onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Class / Grade
                  </label>
                  <select
                    value={packageForm.class_name}
                    onChange={(e) => setPackageForm({ ...packageForm, class_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                  >
                    {CLASSES_LIST.filter(c => c !== 'All Classes').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Subject
                  </label>
                  <select
                    value={packageForm.subject}
                    onChange={(e) => setPackageForm({ ...packageForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                  >
                    {SUBJECTS_LIST.filter(s => s !== 'All Subjects').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Header Color
                  </label>
                  <select
                    value={packageForm.header_color}
                    onChange={(e) => setPackageForm({ ...packageForm, header_color: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                  >
                    <option value="#80497D">Brand Plum (#80497D)</option>
                    <option value="#C35B3F">Brand Terracotta (#C35B3F)</option>
                    <option value="#d49b28">Gold Ochre (#d49b28)</option>
                    <option value="#059669">Emerald (#059669)</option>
                    <option value="#0284c7">Sky Blue (#0284c7)</option>
                    <option value="#7c3aed">Purple (#7c3aed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Offer Price (₹)
                  </label>
                  <input
                    type="number"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={packageForm.original_price}
                    onChange={(e) => setPackageForm({ ...packageForm, original_price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={packageForm.badge_text}
                    onChange={(e) => setPackageForm({ ...packageForm, badge_text: e.target.value })}
                    placeholder="e.g. Bestseller, Special Offer"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Special Offer Text Banner (Yellow pill)
                </label>
                <input
                  type="text"
                  value={packageForm.special_offer_text}
                  onChange={(e) => setPackageForm({ ...packageForm, special_offer_text: e.target.value })}
                  placeholder="e.g. Special Offer: 3499.00 — 2499.00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                />
              </div>

              {/* Structured Section 1: Blue Box (Recorded Classes) */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <p className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                  <span>📖</span> Section 1: Recorded Classes (Blue Box)
                </p>
                <input
                  type="text"
                  value={packageForm.sec1_title}
                  onChange={(e) => setPackageForm({ ...packageForm, sec1_title: e.target.value })}
                  placeholder="Section Title"
                  className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-900"
                />
                <textarea
                  rows={3}
                  value={packageForm.sec1_items}
                  onChange={(e) => setPackageForm({ ...packageForm, sec1_items: e.target.value })}
                  placeholder="Enter 1 point per line..."
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs text-blue-950 font-medium"
                />
              </div>

              {/* Structured Section 2: Purple Box (Practice & Tests) */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <p className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                  <span>📝</span> Section 2: Practice &amp; Tests (Purple Box)
                </p>
                <input
                  type="text"
                  value={packageForm.sec2_title}
                  onChange={(e) => setPackageForm({ ...packageForm, sec2_title: e.target.value })}
                  placeholder="Section Title"
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-bold text-purple-900"
                />
                <textarea
                  rows={3}
                  value={packageForm.sec2_items}
                  onChange={(e) => setPackageForm({ ...packageForm, sec2_items: e.target.value })}
                  placeholder="Enter 1 point per line..."
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-xs text-purple-950 font-medium"
                />
              </div>

              {/* Structured Section 3: Green Box (Test Generator) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <p className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <span>✨</span> Section 3: Intelligent Test Generator (Green Box)
                </p>
                <input
                  type="text"
                  value={packageForm.sec3_title}
                  onChange={(e) => setPackageForm({ ...packageForm, sec3_title: e.target.value })}
                  placeholder="Section Title"
                  className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs font-bold text-emerald-900"
                />
                <textarea
                  rows={3}
                  value={packageForm.sec3_items}
                  onChange={(e) => setPackageForm({ ...packageForm, sec3_items: e.target.value })}
                  placeholder="Enter 1 point per line..."
                  className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-xs text-emerald-950 font-medium"
                />
              </div>

              {/* Flat Features Checklist */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  General Checklist Features (1 bullet per line)
                </label>
                <textarea
                  rows={4}
                  value={packageForm.featuresText}
                  onChange={(e) => setPackageForm({ ...packageForm, featuresText: e.target.value })}
                  placeholder="Enter 1 feature per line..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button variant="secondary" size="md" onClick={() => setPackageModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" loading={actionLoading} icon={Save}>
                  {editingPackage ? 'Save Changes' : 'Publish Course Package'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE LIVE BATCH */}
      {/* ========================================================================= */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">Create Live Interactive Batch</h3>
              <button onClick={() => setBatchModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveBatch} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Batch Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={batchForm.name}
                  onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                  placeholder="e.g. Reasoning Achievers Batch"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Class
                  </label>
                  <select
                    value={batchForm.class_name}
                    onChange={(e) => setBatchForm({ ...batchForm, class_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {CLASSES_LIST.filter(c => c !== 'All Classes').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={batchForm.subject}
                    onChange={(e) => setBatchForm({ ...batchForm, subject: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Faculty Name
                </label>
                <input
                  type="text"
                  value={batchForm.faculty_name}
                  onChange={(e) => setBatchForm({ ...batchForm, faculty_name: e.target.value })}
                  placeholder="e.g. Mrs. Komal Rajput"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Schedule (Days &amp; Time)
                </label>
                <input
                  type="text"
                  value={batchForm.schedule}
                  onChange={(e) => setBatchForm({ ...batchForm, schedule: e.target.value })}
                  placeholder="e.g. Mon, Wed, Fri • 5:00 PM - 6:30 PM"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Meeting Link (Google Meet / Zoom)
                </label>
                <input
                  type="url"
                  value={batchForm.meeting_link}
                  onChange={(e) => setBatchForm({ ...batchForm, meeting_link: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setBatchModalOpen(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit" loading={actionLoading}>Save Batch</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD VIDEO LECTURE */}
      {/* ========================================================================= */}
      {lectureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">Add Concept Video Lecture</h3>
              <button onClick={() => setLectureModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Lecture Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lectureForm.title}
                  onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                  placeholder="e.g. Mastering Fractions: Simplified for IMO"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Class
                  </label>
                  <select
                    value={lectureForm.class_name}
                    onChange={(e) => setLectureForm({ ...lectureForm, class_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {CLASSES_LIST.filter(c => c !== 'All Classes').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={lectureForm.duration}
                    onChange={(e) => setLectureForm({ ...lectureForm, duration: e.target.value })}
                    placeholder="e.g. 45 mins"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Video Embed URL / YouTube
                </label>
                <input
                  type="url"
                  value={lectureForm.video_url}
                  onChange={(e) => setLectureForm({ ...lectureForm, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={lectureForm.desc}
                  onChange={(e) => setLectureForm({ ...lectureForm, desc: e.target.value })}
                  placeholder="Topics covered..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setLectureModalOpen(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit" loading={actionLoading}>Save Lecture</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Classes Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-[#422240] flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#80497D]" />
                <span>Import Course Packages (CSV / JSON)</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Choose CSV File</label>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => setImportText(evt.target.result);
                    reader.readAsText(file);
                  }}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#80497D] hover:file:bg-purple-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Or Paste Raw CSV / JSON Data</label>
                <textarea
                  rows={5}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="title,class_name,subject,price,original_price,badge_text,package_type,status&#10;Master Reasoning 2026,Class 6,Reasoning (ISSO),2499,3499,Bestseller,self_paced,active"
                  className="w-full px-3 py-2 font-mono text-[11px] border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#80497D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowImportModal(false)}>Cancel</Button>
                <Button variant="primary" size="sm" loading={importLoading} onClick={handleImportSubmit}>
                  Upload &amp; Save Packages
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
