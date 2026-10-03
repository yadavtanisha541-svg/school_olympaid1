import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShoppingBag,
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  User,
  BookOpen,
  Sparkles,
  Download,
  Printer,
  Flame,
  Percent,
  Tag,
  HelpCircle,
  Info
} from 'lucide-react';

const CLASSES_LIST = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

const SUBJECTS_LIST = [
  { code: 'ALL', name: 'All Olympiads Combined' },
  { code: 'IMO', name: 'IMO (Mathematics Olympiad)' },
  { code: 'ISO', name: 'ISO (Science Olympiad)' },
  { code: 'ICSO', name: 'ICSO (Cyber & AI Olympiad)' },
  { code: 'IEO', name: 'IEO (English Olympiad)' },
  { code: 'IGKO', name: 'IGKO (General Knowledge)' },
  { code: 'ISSO', name: 'ISSO (Social Studies & Reasoning)' }
];

const COLOR_OPTIONS = [
  { name: 'Sky Blue (Standard)', hex: '#4895d9' },
  { name: 'Ocean Cyan', hex: '#0284c7' },
  { name: 'Royal Purple', hex: '#7c3aed' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Sunset Amber', hex: '#d97706' },
  { name: 'Ruby Coral', hex: '#ea580c' }
];

export const SuperAdminPackagesManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('packages'); // 'orders' | 'packages'

  // Orders State
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_revenue: 0,
    total_orders: 0,
    today_revenue: 0,
    active_packages: 0
  });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderClassFilter, setOrderClassFilter] = useState('All');

  // Packages State
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [packageClassFilter, setPackageClassFilter] = useState('All');

  // Create / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [modalActiveTab, setModalActiveTab] = useState('basic'); // 'basic' | 'sub_items' | 'discounts' | 'preview'

  // Form Basic States
  const [formTitle, setFormTitle] = useState('');
  const [formClass, setFormClass] = useState('Class 6');
  const [formSubjectCode, setFormSubjectCode] = useState('ALL');
  const [formSubjectName, setFormSubjectName] = useState('All Olympiads Combined');
  const [formPrice, setFormPrice] = useState('1499');
  const [formOriginalPrice, setFormOriginalPrice] = useState('1999');
  const [formBadge, setFormBadge] = useState('Popular Choice');
  const [formColor, setFormColor] = useState('#4895d9');
  const [formPoints, setFormPoints] = useState([
    '5 Grand Level-2 National Mock Tests',
    'Advanced HOTS & Tie-Breaker Problem Sets',
    'Detailed Video Solutions & Step-by-Step Analysis',
    'National Benchmark Percentile & AIR Ranking',
    'Unlimited Test Retake Attempts for 365 Days'
  ]);
  const [newPointInput, setNewPointInput] = useState('');

  // Sub-Packages / Items State (Image 1 replica builder)
  const [formSubItems, setFormSubItems] = useState([]);
  const [formBundleOffersText, setFormBundleOffersText] = useState(
    'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2'
  );
  const [formDiscountTiers, setFormDiscountTiers] = useState([
    { count: 2, discount_pct: 5 },
    { count: 3, discount_pct: 10 },
    { count: 4, discount_pct: 15 },
    { count: 5, discount_pct: 20 }
  ]);

  // Sub-item Quick Add Modal/Form
  const [newSubTitle, setNewSubTitle] = useState('');
  const [newSubSubject, setNewSubSubject] = useState('IGKO');
  const [newSubPrice, setNewSubPrice] = useState('400');
  const [newSubOrigPrice, setNewSubOrigPrice] = useState('600');
  const [newSubPointsText, setNewSubPointsText] = useState(
    '10 Online Mock Tests\nAligned with the SOF Exam Pattern - 2026\nSame Test Duration as the SOF Exam\nMatching Syllabus & Difficulty Level\nInteractive and Downloadable'
  );
  const [newSubDefaultSelected, setNewSubDefaultSelected] = useState(true);

  const [savingPackage, setSavingPackage] = useState(false);
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState(null);

  // Live Student Preview in Super Admin
  const [previewSelectedIds, setPreviewSelectedIds] = useState([]);

  // Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `/api/packages/admin-orders?class=${encodeURIComponent(orderClassFilter)}&search=${encodeURIComponent(orderSearch)}`,
        {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        }
      );
      const data = await res.json();
      if (data && data.success && data.data) {
        setOrders(data.data.orders || []);
        if (data.data.analytics) {
          setAnalytics(data.data.analytics);
        }
      }
    } catch (e) {
      console.warn('Error fetching orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Packages
  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const res = await fetch(`/api/packages?class=${encodeURIComponent(packageClassFilter)}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setPackages(data.data);
      }
    } catch (e) {
      console.warn('Error fetching packages:', e);
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchPackages();
    }
  }, [activeTab, orderClassFilter, orderSearch, packageClassFilter]);

  // Default standard sub-items generator
  const generateDefaultSubItems = (cls) => [
    {
      id: `mock_igko_${Date.now()}`,
      title: `Mock Test Series - IGKO ${cls}`,
      subject: 'IGKO',
      original_price: 600.00,
      price: 400.00,
      offer_text: 'Special Offer: 600.00 - 400.00',
      points: [
        '10 IGKO Online Mock Tests',
        'Aligned with the SOF Exam Pattern - 2026',
        'Same Test Duration as the SOF IGKO Exam',
        'Same Number of Questions and Pattern',
        'Matching Syllabus & Difficulty Level',
        'Interactive and Downloadable'
      ],
      is_default_selected: true
    },
    {
      id: `pyp_ieo_l1_${Date.now()}`,
      title: `Previous Years Papers with Solutions - Level-1 - IEO ${cls}`,
      subject: 'IEO',
      original_price: 899.00,
      price: 600.00,
      offer_text: 'Special Offer: 899.00 - 600.00',
      points: [
        '6 IEO Previous Years Papers',
        'Answer keys of all questions',
        'Explanation of all questions',
        'Identify Important Topics',
        'Prepare for Different Difficulty Levels',
        'Interactive and Downloadable'
      ],
      is_default_selected: true
    },
    {
      id: `pyp_icso_${Date.now()}`,
      title: `Previous Years Papers with Solutions - ICSO ${cls}`,
      subject: 'ICSO',
      original_price: 899.00,
      price: 600.00,
      offer_text: 'Special Offer: 899.00 - 600.00',
      points: [
        '6 ICSO Previous Years Papers',
        'Answer keys of all questions',
        'Explanation of all questions',
        'Identify Important Topics',
        'Prepare for Different Difficulty Levels',
        'Interactive and Downloadable'
      ],
      is_default_selected: false
    },
    {
      id: `mock_ieo_l1_${Date.now()}`,
      title: `Mock Test Series - Level-1 - IEO ${cls}`,
      subject: 'IEO',
      original_price: 899.00,
      price: 600.00,
      offer_text: 'Special Offer: 899.00 - 600.00',
      points: [
        '6 IEO Online Mock Tests',
        'Aligned with the SOF Exam Pattern - 2026',
        'Same Test Duration as the SOF IEO Exam',
        'Same Number of Questions and Pattern',
        'Matching Syllabus & Difficulty Level',
        'Interactive and Downloadable'
      ],
      is_default_selected: false
    },
    {
      id: `pyp_imo_${Date.now()}`,
      title: `Previous Years Papers with Solutions - IMO ${cls}`,
      subject: 'IMO',
      original_price: 899.00,
      price: 600.00,
      offer_text: 'Special Offer: 899.00 - 600.00',
      points: [
        '6 IMO Previous Years Papers',
        'Step-by-step Mathematical Explanations',
        'Answer keys of all questions',
        'Achievers HOTS Math Section Included',
        'Interactive and Downloadable'
      ],
      is_default_selected: false
    },
    {
      id: `mock_imo_${Date.now()}`,
      title: `Mock Test Series - IMO ${cls}`,
      subject: 'IMO',
      original_price: 899.00,
      price: 600.00,
      offer_text: 'Special Offer: 899.00 - 600.00',
      points: [
        '10 IMO Full Length Online Mock Tests',
        'Real Exam Countdown Clock and Scoring',
        'Detailed Speed & Accuracy Analysis',
        'Interactive and Downloadable'
      ],
      is_default_selected: false
    }
  ];

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPackage(null);
    setModalActiveTab('basic');
    setFormTitle('Olympiads Power Prep Package - Class 6');
    setFormClass('Class 6');
    setFormSubjectCode('ALL');
    setFormSubjectName('All Olympiads Combined');
    setFormPrice('1499');
    setFormOriginalPrice('1999');
    setFormBadge('Bestseller');
    setFormColor('#0284c7');
    setFormPoints([
      '5 Grand Level-2 National Mock Tests',
      'Advanced HOTS & Tie-Breaker Problem Sets',
      'Detailed Video Solutions & Step-by-Step Analysis',
      'National Benchmark Percentile & AIR Ranking',
      'Unlimited Test Retake Attempts for 365 Days'
    ]);
    const defaultSubs = generateDefaultSubItems('Class 6');
    setFormSubItems(defaultSubs);
    setPreviewSelectedIds(
      defaultSubs.filter((i) => i.is_default_selected).map((i) => i.id || i.title)
    );
    setFormBundleOffersText(
      'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2'
    );
    setFormDiscountTiers([
      { count: 2, discount_pct: 5 },
      { count: 3, discount_pct: 10 },
      { count: 4, discount_pct: 15 },
      { count: 5, discount_pct: 20 }
    ]);
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setModalActiveTab('basic');
    setFormTitle(pkg.title || '');
    setFormClass(pkg.class_name || 'Class 6');
    setFormSubjectCode(pkg.subject_code || 'ALL');
    setFormSubjectName(pkg.subject_name || 'All Olympiads Combined');
    setFormPrice(String(pkg.price || '1499'));
    setFormOriginalPrice(String(pkg.original_price || '1999'));
    setFormBadge(pkg.badge_text || 'Popular');
    setFormColor(pkg.header_color || '#4895d9');
    setFormPoints(Array.isArray(pkg.points) ? pkg.points : []);

    const subs = Array.isArray(pkg.sub_items) && pkg.sub_items.length > 0
      ? pkg.sub_items
      : generateDefaultSubItems(pkg.class_name || 'Class 6');

    setFormSubItems(subs);
    setPreviewSelectedIds(
      subs.filter((i) => i.is_default_selected).map((i) => i.id || i.title)
    );
    setFormBundleOffersText(
      pkg.bundle_offers_text ||
        'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2'
    );
    setFormDiscountTiers(
      Array.isArray(pkg.discount_tiers) && pkg.discount_tiers.length > 0
        ? pkg.discount_tiers
        : [
            { count: 2, discount_pct: 5 },
            { count: 3, discount_pct: 10 },
            { count: 4, discount_pct: 15 },
            { count: 5, discount_pct: 20 }
          ]
    );
    setShowModal(true);
  };

  // Add Point to Package Card
  const handleAddPoint = () => {
    if (!newPointInput.trim()) return;
    setFormPoints([...formPoints, newPointInput.trim()]);
    setNewPointInput('');
  };

  // Remove Point
  const handleRemovePoint = (idx) => {
    setFormPoints(formPoints.filter((_, i) => i !== idx));
  };

  // Add Sub-Item to Sub-Packages list
  const handleAddSubItem = (e) => {
    e.preventDefault();
    if (!newSubTitle.trim()) {
      alert('Please enter a sub-package title');
      return;
    }

    const pointsArr = newSubPointsText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const newSub = {
      id: `sub_${Date.now()}`,
      title: newSubTitle.trim(),
      subject: newSubSubject,
      price: parseFloat(newSubPrice) || 400.0,
      original_price: parseFloat(newSubOrigPrice) || 600.0,
      offer_text: `Special Offer: ${parseFloat(newSubOrigPrice || 600).toFixed(2)} - ${parseFloat(newSubPrice || 400).toFixed(2)}`,
      points: pointsArr.length > 0 ? pointsArr : ['Online Mock Tests & Solved Papers'],
      is_default_selected: newSubDefaultSelected
    };

    setFormSubItems([...formSubItems, newSub]);
    setNewSubTitle('');
    alert('✓ Sub-package item added to selection grid!');
  };

  // Delete Sub-Item
  const handleDeleteSubItem = (id) => {
    setFormSubItems(formSubItems.filter((item) => item.id !== id && item.title !== id));
  };

  // Save Package (with Sub-Items & Discount Tiers to MySQL)
  const handleSavePackage = async (e) => {
    if (e) e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a package title.');
      return;
    }

    setSavingPackage(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: formTitle.trim(),
        class_name: formClass,
        subject_code: formSubjectCode,
        subject_name: formSubjectName,
        price: parseFloat(formPrice) || 1499,
        original_price: parseFloat(formOriginalPrice) || 1999,
        points: formPoints,
        sub_items: formSubItems,
        bundle_offers_text: formBundleOffersText,
        discount_tiers: formDiscountTiers,
        badge_text: formBadge.trim(),
        header_color: formColor,
        status: 'active'
      };

      const url = editingPackage ? `/api/packages/${editingPackage.id}` : '/api/packages/create';
      const method = editingPackage ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        setShowModal(false);
        fetchPackages();
        alert(
          editingPackage
            ? '✓ Package & Sub-items updated successfully in MySQL!'
            : '✓ Package & Sub-items created and published successfully!'
        );
      } else {
        alert(data.message || 'Error saving package.');
      }
    } catch (e) {
      console.warn('Save package error:', e);
      alert('Network error while saving package.');
    } finally {
      setSavingPackage(false);
    }
  };

  // Delete Package
  const handleDeletePackage = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      const data = await res.json();
      if (data && data.success) {
        fetchPackages();
      }
    } catch (e) {
      console.warn('Delete package error:', e);
    }
  };

  // Calculations for Preview Tab inside Super Admin
  const previewSelectedItems = useMemo(() => {
    return formSubItems.filter((i) => previewSelectedIds.includes(i.id || i.title));
  }, [formSubItems, previewSelectedIds]);

  const previewCount = previewSelectedItems.length;
  const previewBaseTotal = useMemo(() => {
    return previewSelectedItems.reduce((acc, i) => acc + (Number(i.price) || 0), 0);
  }, [previewSelectedItems]);

  const previewDiscountPct = useMemo(() => {
    if (previewCount < 2) return 0;
    const matched = [...formDiscountTiers]
      .filter((t) => previewCount >= t.count)
      .sort((a, b) => b.discount_pct - a.discount_pct);
    return matched[0]?.discount_pct || 0;
  }, [previewCount, formDiscountTiers]);

  const previewDiscountAmt = Math.round((previewBaseTotal * previewDiscountPct) / 100);
  const previewFinalPayable = Math.max(0, previewBaseTotal - previewDiscountAmt);

  return (
    <div className="space-y-6 animate-in fade-in duration-150 font-sans pb-16">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#4e2a4a] via-[#6d3a68] to-[#8c4e8b] rounded-2xl p-4 sm:p-5 text-white shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[#e7b84b] text-[10px] font-bold uppercase tracking-wider mb-1">
              <ShoppingBag className="w-3 h-3 text-[#e7b84b]" />
              <span>Super Admin Commerce &amp; Packages Studio</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
              Subject Packages, Multi-Item Bundles &amp; Orders
            </h1>
            <p className="text-xs text-pink-100/90 mt-0.5 max-w-2xl font-medium">
              Author and customize study packages, sub-package selectable items (Mock Tests, Solved Papers), and bundle volume discounts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Package</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-[#edd6ed] p-1.5 flex items-center gap-2 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'packages'
              ? 'bg-[#4e2a4a] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Package Creator &amp; Cards Manager ({packages.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#4e2a4a] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Student Purchases &amp; Orders ({orders.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PACKAGES MANAGER & CREATOR (Screenshot 3 layout)                   */}
      {/* ========================================================================= */}
      {activeTab === 'packages' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#edd6ed] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1">Filter By Grade:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setPackageClassFilter('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    packageClassFilter === 'All'
                      ? 'bg-[#4e2a4a] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {CLASSES_LIST.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPackageClassFilter(c)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      packageClassFilter === c
                        ? 'bg-[#4e2a4a] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Package Card</span>
            </button>
          </div>

          {/* Cards Grid: Rendered in exact format from user's image 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border-2 border-sky-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  {/* Top Curved Header Banner (Screenshot 3 style) */}
                  <div
                    className="text-white text-center py-2.5 px-3 rounded-t-xl -mt-5 -mx-5 font-black text-xs sm:text-sm shadow-xs mb-3"
                    style={{ backgroundColor: pkg.header_color || '#4895d9' }}
                  >
                    {pkg.title}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {pkg.class_name} • {pkg.subject_code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {Array.isArray(pkg.sub_items) ? pkg.sub_items.length : 6} Selectable Items
                    </span>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 text-xs text-slate-700 min-h-[140px]">
                    {(pkg.points || []).map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11px] font-medium text-slate-800">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="text-center text-xs font-bold text-slate-500">
                    Price : <span className="font-black text-[#6d3a68]">₹{parseFloat(pkg.price).toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 line-through ml-1.5">
                      ₹{parseFloat(pkg.original_price || pkg.price * 1.3).toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(pkg)}
                      className="w-full py-2 bg-[#537b99] hover:bg-[#43647d] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>EDIT / ITEMS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="w-full py-2 bg-[#eb4d4b] hover:bg-[#d63031] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>DELETE</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDENT PURCHASES & ORDERS LIST                                    */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student, email, order ID, package..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#6d3a68] outline-none"
                />
              </div>

              <select
                value={orderClassFilter}
                onChange={(e) => setOrderClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white cursor-pointer"
              >
                <option value="All">All Grades</option>
                {CLASSES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              className="px-4 py-2 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              ↻ Refresh Orders
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf5fa] text-[#6d3a68] border-b border-[#edd6ed] uppercase text-[10px] font-black tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Order ID &amp; Date</th>
                  <th className="py-3 px-4">Student Name &amp; Contact</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Package Purchased</th>
                  <th className="py-3 px-4">Price Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center rounded-r-xl">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4ebf4]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-bold text-xs">
                      No student purchases found.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#fff9f2] transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-black text-[#6d3a68] block">{o.order_id}</span>
                        <span className="text-[10px] text-slate-400">{o.created_at}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{o.student_name}</span>
                        <span className="text-[11px] text-slate-500 block">{o.student_email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f4ebf4] text-[#6d3a68] font-black text-[10px]">
                          {o.student_class}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#4e2a4a] block">{o.package_title}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm font-black text-emerald-700">₹{parseFloat(o.price).toFixed(2)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                          <Check className="w-3 h-3" />
                          <span>COMPLETED</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderReceipt(o)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: COMPREHENSIVE PACKAGE & SUB-ITEMS CREATOR / EDITOR                  */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-[#edd6ed] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95">
            {/* Modal Header & Tabs */}
            <div className="bg-[#4e2a4a] p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#e7b84b]">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {editingPackage ? 'Edit Package & Sub-Items' : 'Create New Study Package Card'}
                  </h3>
                  <p className="text-[11px] text-pink-200">
                    Customize package cards, sub-item checklist (Image 1), and volume bundle discounts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Tabs Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
              {[
                { id: 'basic', label: '1. Card Details & Bullets' },
                { id: 'sub_items', label: `2. Selectable Sub-Items (${formSubItems.length})` },
                { id: 'discounts', label: '3. Offers & Volume Discounts' },
                { id: 'preview', label: '4. Live Student Modal Preview 👁️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModalActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    modalActiveTab === tab.id
                      ? 'bg-[#6d3a68] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: BASIC DETAILS */}
              {modalActiveTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Package Title *</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Olympiads Power Prep Package - Class 6"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#6d3a68] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Grade Level *</label>
                      <select
                        value={formClass}
                        onChange={(e) => setFormClass(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white cursor-pointer"
                      >
                        {CLASSES_LIST.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subject Association</label>
                      <select
                        value={formSubjectCode}
                        onChange={(e) => {
                          setFormSubjectCode(e.target.value);
                          const sObj = SUBJECTS_LIST.find((s) => s.code === e.target.value);
                          if (sObj) setFormSubjectName(sObj.name);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white cursor-pointer"
                      >
                        {SUBJECTS_LIST.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.code} - {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="e.g. Bestseller / Complete Prep"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Card Header Color</label>
                      <div className="flex items-center gap-2">
                        <select
                          value={formColor}
                          onChange={(e) => setFormColor(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white cursor-pointer"
                        >
                          {COLOR_OPTIONS.map((c) => (
                            <option key={c.hex} value={c.hex}>
                              {c.name} ({c.hex})
                            </option>
                          ))}
                        </select>
                        <span
                          className="w-8 h-8 rounded-xl border shadow-xs"
                          style={{ backgroundColor: formColor }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Base Price (₹) *</label>
                        <input
                          type="number"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black text-emerald-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={formOriginalPrice}
                          onChange={(e) => setFormOriginalPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700">
                      Package Card Bullet Features (Displayed on main catalog card)
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {formPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0" />
                          <span className="text-xs text-slate-800 flex-1">{pt}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePoint(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add another feature point..."
                        value={newPointInput}
                        onChange={(e) => setNewPointInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPoint();
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddPoint}
                        className="px-3.5 py-2 bg-[#6d3a68] hover:bg-[#5c3158] text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        + Add Point
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SELECTABLE SUB-ITEMS (IMAGE 1 MULTI-ITEM BUILDER) */}
              {modalActiveTab === 'sub_items' && (
                <div className="space-y-5">
                  <div className="p-3.5 bg-[#fcf8fb] rounded-2xl border border-[#edd6ed] text-xs text-slate-600 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#6d3a68] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Sub-Package Items Checklist</span>
                      Jab student is package ke <strong>BUY</strong> button par click karega, toh yahi items checklist (Mock Tests, Solved Papers etc.) unke samne khulegi jisme se wo select karke Add to Cart kar sakte hain.
                    </div>
                  </div>

                  {/* Add New Sub-Item Form */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Add New Sub-Item to Checklist</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Item Title *</label>
                        <input
                          type="text"
                          value={newSubTitle}
                          onChange={(e) => setNewSubTitle(e.target.value)}
                          placeholder="e.g. Mock Test Series - IGKO Class 6"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Subject Code</label>
                        <input
                          type="text"
                          value={newSubSubject}
                          onChange={(e) => setNewSubSubject(e.target.value)}
                          placeholder="e.g. IGKO / IMO"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Offer Price (₹)</label>
                        <input
                          type="number"
                          value={newSubPrice}
                          onChange={(e) => setNewSubPrice(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-black text-emerald-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Original Price (₹)</label>
                        <input
                          type="number"
                          value={newSubOrigPrice}
                          onChange={(e) => setNewSubOrigPrice(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-400 outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newSubDefaultSelected}
                            onChange={(e) => setNewSubDefaultSelected(e.target.checked)}
                            className="w-4 h-4 rounded text-[#6d3a68]"
                          />
                          <span>Default Selected</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                        Bullet Points (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={newSubPointsText}
                        onChange={(e) => setNewSubPointsText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSubItem}
                      className="px-4 py-1.5 bg-[#00b074] hover:bg-[#009260] text-white rounded-lg text-xs font-black cursor-pointer shadow-xs"
                    >
                      + Save Sub-Item
                    </button>
                  </div>

                  {/* List of Configured Sub-Items */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-800">
                      Configured Sub-Items in this Package ({formSubItems.length})
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                      {formSubItems.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2 relative"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-xs text-slate-900 block leading-tight">
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">
                                {item.subject} • Offer: ₹{item.price} (Orig: ₹{item.original_price})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[10px] text-slate-500 space-y-0.5">
                            {(item.points || []).slice(0, 2).map((p, pIdx) => (
                              <div key={pIdx} className="truncate">• {p}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: OFFERS & VOLUME DISCOUNT TIERS */}
              {modalActiveTab === 'discounts' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bottom Offer Banner Text (Image 1 footer text)
                    </label>
                    <input
                      type="text"
                      value={formBundleOffersText}
                      onChange={(e) => setFormBundleOffersText(e.target.value)}
                      placeholder="e.g. Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Automatic Volume Discount Rules
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {formDiscountTiers.map((tier, tIdx) => (
                        <div key={tIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-center">
                          <span className="text-[11px] font-bold text-slate-500 block">
                            {tier.count}+ Items Selected
                          </span>
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              value={tier.discount_pct}
                              onChange={(e) => {
                                const newTiers = [...formDiscountTiers];
                                newTiers[tIdx].discount_pct = parseInt(e.target.value) || 0;
                                setFormDiscountTiers(newTiers);
                              }}
                              className="w-14 px-2 py-1 text-center rounded border font-black text-emerald-700 text-xs bg-white"
                            />
                            <span className="font-bold text-xs">% OFF</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LIVE STUDENT MODAL PREVIEW */}
              {modalActiveTab === 'preview' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-amber-300 rounded-2xl p-4 bg-amber-50/50">
                    <span className="text-xs font-black text-amber-800 block mb-2">
                      Live Preview: Exactly how students see this package when clicking BUY
                    </span>

                    {/* Image 1 exact preview layout */}
                    <div className="bg-[#fcf8fb] rounded-2xl border border-[#edd6ed] shadow-md overflow-hidden">
                      <div className="bg-[#f5e6ce] px-4 py-2.5 border-b border-[#e9d2b2] flex items-center justify-between">
                        <span className="font-black text-xs sm:text-sm text-slate-900">{formTitle}</span>
                        <div className="px-3 py-1 bg-[#f5b82e] text-slate-950 font-black rounded-lg text-[10px] flex items-center gap-1">
                          <span>ADD TO CART</span>
                          <ShoppingBag className="w-3 h-3" />
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {formSubItems.map((item, idx) => {
                          const itemId = item.id || item.title;
                          const isChecked = previewSelectedIds.includes(itemId);
                          return (
                            <div
                              key={itemId || idx}
                              className={`p-3 bg-white rounded-xl border flex flex-col justify-between space-y-2 ${
                                isChecked ? 'border-[#2563eb] ring-1 ring-blue-100' : 'border-slate-200'
                              }`}
                            >
                              <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    setPreviewSelectedIds((prev) =>
                                      prev.includes(itemId)
                                        ? prev.filter((id) => id !== itemId)
                                        : [...prev, itemId]
                                    );
                                  }}
                                  className="mt-0.5"
                                />
                                <span className="font-bold text-xs text-slate-900">{item.title}</span>
                              </label>

                              <div className="bg-[#fef3c7] px-2 py-1 rounded flex items-center justify-between text-[11px] font-bold">
                                <span className="text-amber-800">🔥 Special Offer</span>
                                <div>
                                  <span className="text-red-400 line-through mr-1 text-[10px]">
                                    {item.original_price}
                                  </span>
                                  <span className="text-emerald-700 font-black">{item.price}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-[#fcf8fb] border-t border-[#ecd0ec] px-4 py-2 text-[11px] flex items-center justify-between">
                        <span className="text-blue-700 font-bold">{formBundleOffersText}</span>
                        <span className="font-black text-slate-800">
                          Total: ₹{previewFinalPayable} ({previewSelectedItems.length} items)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500 font-medium">
                All edits save directly to MySQL database.
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingPackage}
                  onClick={handleSavePackage}
                  className="px-6 py-2 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {savingPackage ? 'Saving to Database...' : 'Save Package & Sub-Items ✓'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ORDER RECEIPT VIEW */}
      {selectedOrderReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#edd6ed] shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Student Purchase Invoice</h3>
              <button
                type="button"
                onClick={() => setSelectedOrderReceipt(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Order ID:</span>
                <span className="font-mono font-black text-[#6d3a68]">{selectedOrderReceipt.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Student:</span>
                <span className="font-bold text-slate-900">{selectedOrderReceipt.student_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Grade:</span>
                <span className="font-bold text-slate-900">{selectedOrderReceipt.student_class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Package:</span>
                <span className="font-bold text-slate-900">{selectedOrderReceipt.package_title}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#edd6ed]">
                <span className="text-slate-700 font-bold">Amount Paid:</span>
                <span className="font-black text-emerald-700">₹{parseFloat(selectedOrderReceipt.price).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderReceipt(null)}
                className="px-5 py-2 bg-[#6d3a68] text-white rounded-xl text-xs font-bold"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
