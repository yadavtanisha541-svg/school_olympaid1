import React, { useState, useEffect } from 'react';
import {
  DEFAULT_KEY_INFO_DROPDOWN,
  DEFAULT_SUPERADMIN_FAQS
} from '../../data/keyInfoMasterData';
import {
  ALL_CLASSES,
  OLYMPIAD_SUBJECT_METADATA,
  getClassSyllabus,
  generateSamplePapersCatalog,
  getSamplePaperQuestions
} from '../../data/olympiadClassData';
import {
  HelpCircle,
  Calendar,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  Save,
  RotateCcw,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Layers,
  Sparkles,
  Info,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';

export const FaqsAndKeyInfoManager = ({ onNavigateTab, onGoToPublic }) => {
  // Top Active Tab: 'menu' | 'faqs' | 'dates' | 'syllabus' | 'sample_papers' | 'pattern'
  const [activeSection, setActiveSection] = useState('menu');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // 1. DROPDOWN MENU CONFIG STATE
  // -------------------------------------------------------------
  const [dropdownItems, setDropdownItems] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_keyinfo_dropdown_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_KEY_INFO_DROPDOWN;
  });

  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [menuForm, setMenuForm] = useState({ id: '', label: '', page: '', badge: '', enabled: true });

  const saveDropdownMenu = (items) => {
    setDropdownItems(items);
    localStorage.setItem('olympiadhub_keyinfo_dropdown_v1', JSON.stringify(items));
    showToast('Dropdown menu items updated and saved successfully!');
  };

  const handleToggleMenuItem = (id) => {
    const updated = dropdownItems.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item);
    saveDropdownMenu(updated);
  };

  const handleMoveMenuItem = (index, direction) => {
    const newItems = [...dropdownItems];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    // update order property
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    saveDropdownMenu(reordered);
  };

  const handleDeleteMenuItem = (id) => {
    const filtered = dropdownItems.filter(item => item.id !== id);
    saveDropdownMenu(filtered);
    showToast('Dropdown menu item removed.');
  };

  const handleSaveMenuForm = () => {
    if (!menuForm.label.trim() || !menuForm.page.trim()) {
      showToast('Please fill in both Menu Label and Page Route', 'error');
      return;
    }
    if (editingMenuItem) {
      const updated = dropdownItems.map(item => item.id === editingMenuItem.id ? { ...item, ...menuForm } : item);
      saveDropdownMenu(updated);
      setEditingMenuItem(null);
    } else {
      const newItem = {
        ...menuForm,
        id: menuForm.id || `menu-${Date.now()}`,
        order: dropdownItems.length + 1
      };
      saveDropdownMenu([...dropdownItems, newItem]);
      setIsAddingMenuItem(false);
    }
    setMenuForm({ id: '', label: '', page: '', badge: '', enabled: true });
  };

  // -------------------------------------------------------------
  // 2. FAQS CONTENT MANAGER STATE
  // -------------------------------------------------------------
  const [faqsList, setFaqsList] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_superadmin_faqs_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SUPERADMIN_FAQS;
  });

  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('All');
  const [editingFaq, setEditingFaq] = useState(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [faqForm, setFaqForm] = useState({ id: '', category: 'General & Venue', q: '', a: '', enabled: true });

  const faqCategories = [
    'All',
    'General & Venue',
    'Integrity & Proctoring',
    'Subjects & Curriculum',
    'Registration & Fees',
    'Syllabus & Pattern',
    'Preparation & Trial',
    'Rankings & Awards',
    'Results & Answer Keys',
    'Support & Helpdesk'
  ];

  const saveFaqsList = (faqs) => {
    setFaqsList(faqs);
    localStorage.setItem('olympiadhub_superadmin_faqs_v1', JSON.stringify(faqs));
    showToast('FAQs repository updated and published successfully!');
  };

  const filteredFaqs = faqsList.filter(f => {
    if (faqCategoryFilter !== 'All' && f.category !== faqCategoryFilter) return false;
    if (faqSearch.trim()) {
      const q = faqSearch.toLowerCase();
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSaveFaqForm = () => {
    if (!faqForm.q.trim() || !faqForm.a.trim()) {
      showToast('Please enter both Question and Answer', 'error');
      return;
    }
    if (editingFaq) {
      const updated = faqsList.map(item => item.id === editingFaq.id ? { ...item, ...faqForm } : item);
      saveFaqsList(updated);
      setEditingFaq(null);
    } else {
      const newFaq = {
        ...faqForm,
        id: `faq-${Date.now()}`,
        order: faqsList.length + 1
      };
      saveFaqsList([...faqsList, newFaq]);
      setIsAddingFaq(false);
    }
    setFaqForm({ id: '', category: 'General & Venue', q: '', a: '', enabled: true });
  };

  const handleDeleteFaq = (id) => {
    const filtered = faqsList.filter(item => item.id !== id);
    saveFaqsList(filtered);
    showToast('FAQ deleted successfully.');
  };

  // -------------------------------------------------------------
  // 3. EXAM DATES & SCHEDULE MANAGER STATE
  // -------------------------------------------------------------
  const [selectedDateSubject, setSelectedDateSubject] = useState('english');
  const [datesConfig, setDatesConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_exam_dates_config_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const initial = {};
    Object.keys(OLYMPIAD_SUBJECT_METADATA).forEach(key => {
      initial[key] = { ...OLYMPIAD_SUBJECT_METADATA[key].examDates2026_2027 };
    });
    return initial;
  });

  const handleSaveDates = () => {
    localStorage.setItem('olympiadhub_exam_dates_config_v1', JSON.stringify(datesConfig));
    showToast(`Exam dates for ${OLYMPIAD_SUBJECT_METADATA[selectedDateSubject]?.fullName} updated successfully!`);
  };

  // -------------------------------------------------------------
  // 4. EXAM SYLLABUS MANAGER STATE
  // -------------------------------------------------------------
  const [selectedSyllabusSubject, setSelectedSyllabusSubject] = useState('math');
  const [selectedSyllabusClass, setSelectedSyllabusClass] = useState('Class 1');
  const [customSyllabusStore, setCustomSyllabusStore] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_custom_syllabus_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const syllabusKey = `${selectedSyllabusSubject}_${selectedSyllabusClass}`;
  const activeSyllabusData = customSyllabusStore[syllabusKey] || getClassSyllabus(selectedSyllabusSubject, selectedSyllabusClass);
  const [currentSyllabusEdit, setCurrentSyllabusEdit] = useState(activeSyllabusData);

  useEffect(() => {
    setCurrentSyllabusEdit(customSyllabusStore[syllabusKey] || getClassSyllabus(selectedSyllabusSubject, selectedSyllabusClass));
  }, [selectedSyllabusSubject, selectedSyllabusClass, customSyllabusStore]);

  const handleSaveSyllabus = () => {
    const updated = {
      ...customSyllabusStore,
      [syllabusKey]: currentSyllabusEdit
    };
    setCustomSyllabusStore(updated);
    localStorage.setItem('olympiadhub_custom_syllabus_v1', JSON.stringify(updated));
    showToast(`Syllabus for ${selectedSyllabusSubject.toUpperCase()} - ${selectedSyllabusClass} saved successfully!`);
  };

  // -------------------------------------------------------------
  // 5. SAMPLE PAPERS & MOCK TESTS MANAGER STATE
  // -------------------------------------------------------------
  const [samplePapersStore, setSamplePapersStore] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_sample_papers_config_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      durationMins: 60,
      totalQuestions: 35,
      totalMarks: 60,
      passingMarks: 40,
      instructions: 'Each question carries 1 mark in Section 1 and 2 marks in Achievers Section. There is no negative marking.'
    };
  });

  const handleSaveSamplePapers = () => {
    localStorage.setItem('olympiadhub_sample_papers_config_v1', JSON.stringify(samplePapersStore));
    showToast('Sample Papers & Mock Test settings updated successfully!');
  };

  // -------------------------------------------------------------
  // 6. MARKING SCHEME & EXAM PATTERN MANAGER STATE
  // -------------------------------------------------------------
  const [selectedPatternBand, setSelectedPatternBand] = useState('primary');
  const [patternConfigStore, setPatternConfigStore] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_pattern_config_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      early: { duration: 40, totalQ: 25, totalMarks: 40, sec1: 20, sec2: 5, sec1Marks: 1, sec2Marks: 4, negMarking: 'No' },
      primary: { duration: 60, totalQ: 35, totalMarks: 60, sec1: 30, sec2: 5, sec1Marks: 1, sec2Marks: 6, negMarking: 'No' },
      middle: { duration: 60, totalQ: 50, totalMarks: 60, sec1: 45, sec2: 5, sec1Marks: 1, sec2Marks: 3, negMarking: 'No' },
      secondary: { duration: 60, totalQ: 50, totalMarks: 60, sec1: 45, sec2: 5, sec1Marks: 1, sec2Marks: 3, negMarking: 'No' },
      senior: { duration: 60, totalQ: 50, totalMarks: 60, sec1: 45, sec2: 5, sec1Marks: 1, sec2Marks: 3, negMarking: 'No' }
    };
  });

  const handleSavePattern = () => {
    localStorage.setItem('olympiadhub_pattern_config_v1', JSON.stringify(patternConfigStore));
    showToast('Exam Pattern & Marking Scheme updated successfully!');
  };

  const handleResetAllToDefaults = () => {
    localStorage.removeItem('olympiadhub_keyinfo_dropdown_v1');
    localStorage.removeItem('olympiadhub_superadmin_faqs_v1');
    localStorage.removeItem('olympiadhub_exam_dates_config_v1');
    localStorage.removeItem('olympiadhub_custom_syllabus_v1');
    localStorage.removeItem('olympiadhub_sample_papers_config_v1');
    localStorage.removeItem('olympiadhub_pattern_config_v1');
    setDropdownItems(DEFAULT_KEY_INFO_DROPDOWN);
    setFaqsList(DEFAULT_SUPERADMIN_FAQS);
    showToast('All Key Info data reset to system defaults!');
  };

  const subjectKeys = Object.keys(OLYMPIAD_SUBJECT_METADATA);

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#e7b84b]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#e7b84b]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-[#80497D]/10 text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-xs">
            <Sparkles className="w-7 h-7 text-[#80497D]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#422240] tracking-tight">
              FAQs &amp; Key Info Content Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Manage the 5 key dropdown items (FAQs, Exam Dates, Syllabus, Sample Papers, Marking Scheme) across all subjects and grades.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onGoToPublic && (
            <button
              type="button"
              onClick={onGoToPublic}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4 text-[#80497D]" />
              <span>Preview Public Website</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleResetAllToDefaults}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* 6 Sub-Section Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-[#edd6ed] shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-thin">
        {[
          { id: 'menu', label: '1. Dropdown Menu Items', icon: Layers, desc: 'Manage 5 navbar links' },
          { id: 'faqs', label: '2. FAQs Repository', icon: HelpCircle, desc: 'All Q&A pairs' },
          { id: 'dates', label: '3. Exam Dates & Schedule', icon: Calendar, desc: 'Level 1, L2 & fee' },
          { id: 'syllabus', label: '4. Exam Syllabus', icon: BookOpen, desc: 'Class-wise topics' },
          { id: 'sample_papers', label: '5. Sample Papers & Mock Tests', icon: FileSpreadsheet, desc: 'Papers & MCQs' },
          { id: 'pattern', label: '6. Marking Scheme & Pattern', icon: FileText, desc: 'Duration & weightage' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2.5 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-md shadow-blue-950/20 border border-[#7854d6]/30'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#e7b84b]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DROPDOWN MENU CONFIGURATION                        */}
      {/* ========================================================= */}
      {activeSection === 'menu' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-[#4e2a4a]">
                  Navbar FAQs &amp; Key Info Dropdown Items
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control which items appear in the "FAQs &amp; Key Info" dropdown, their labels, badges, display order, and active visibility.
                </p>
              </div>

              <button
                onClick={() => {
                  setMenuForm({ id: '', label: '', page: '', badge: '', enabled: true });
                  setEditingMenuItem(null);
                  setIsAddingMenuItem(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white transition-all cursor-pointer shadow-md shadow-blue-950/20 w-fit border border-[#7854d6]/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Menu Item</span>
              </button>
            </div>

            {/* Menu Items Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#faf5fa] text-[#6d3a68] border-b border-[#edd6ed] uppercase text-[11px] font-black tracking-wider">
                    <th className="py-3 px-4 w-16 text-center">Order</th>
                    <th className="py-3 px-4">Menu Label</th>
                    <th className="py-3 px-4">Target Page Route</th>
                    <th className="py-3 px-4">Badge / Tag</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4ebf4]">
                  {dropdownItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-[#fff9f2] transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-slate-500">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleMoveMenuItem(index, -1)}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-[#6d3a68] disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <span>{index + 1}</span>
                          <button
                            onClick={() => handleMoveMenuItem(index, 1)}
                            disabled={index === dropdownItems.length - 1}
                            className="p-1 text-slate-400 hover:text-[#6d3a68] disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-black text-[#4e2a4a]">
                        {item.label}
                      </td>
                      <td className="py-3 px-4">
                        <code className="px-2 py-0.5 rounded bg-[#faf5fa] border border-[#edd6ed] text-[11px] text-[#6d3a68] font-mono">
                          {item.page}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        {item.badge ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#faf4e0] text-[#d9775b] border border-[#e7b84b]/40">
                            {item.badge}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleMenuItem(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            item.enabled !== false
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-500 border border-slate-300'
                          }`}
                        >
                          {item.enabled !== false ? 'Active (Visible)' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingMenuItem(item);
                              setMenuForm({
                                id: item.id,
                                label: item.label,
                                page: item.page,
                                badge: item.badge || '',
                                enabled: item.enabled !== false
                              });
                              setIsAddingMenuItem(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-[#faf5fa] hover:text-[#6d3a68] transition-colors cursor-pointer"
                            title="Edit Menu Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Menu Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add / Edit Menu Item Modal Form */}
            {isAddingMenuItem && (
              <div className="mt-6 p-6 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-[#4e2a4a]">
                    {editingMenuItem ? 'Edit Dropdown Item' : 'Add New Dropdown Item'}
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddingMenuItem(false);
                      setEditingMenuItem(null);
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Menu Label *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Exam Syllabus"
                      value={menuForm.label}
                      onChange={(e) => setMenuForm({ ...menuForm, label: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Page Route / ID *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. syllabus, schedule, pattern"
                      value={menuForm.page}
                      onChange={(e) => setMenuForm({ ...menuForm, page: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Optional Badge / Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New, Updated"
                      value={menuForm.badge}
                      onChange={(e) => setMenuForm({ ...menuForm, badge: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsAddingMenuItem(false);
                      setEditingMenuItem(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-[#edd6ed] hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMenuForm}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] transition-colors cursor-pointer shadow-sm"
                  >
                    Save Menu Item
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FAQS REPOSITORY MANAGER                             */}
      {/* ========================================================= */}
      {activeSection === 'faqs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-[#4e2a4a]">
                  Frequently Asked Questions (FAQs) Repository
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total {faqsList.length} FAQs configured across {faqCategories.length - 1} categories.
                </p>
              </div>

              <button
                onClick={() => {
                  setFaqForm({ id: '', category: 'General & Venue', q: '', a: '', enabled: true });
                  setEditingFaq(null);
                  setIsAddingFaq(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white hover:bg-[#5c3158] transition-colors cursor-pointer shadow-sm w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>Add New FAQ Question</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed]">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search questions or answers..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>

              <div>
                <select
                  value={faqCategoryFilter}
                  onChange={(e) => setFaqCategoryFilter(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-bold text-[#4e2a4a]"
                >
                  {faqCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      Category: {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add / Edit FAQ Form */}
            {isAddingFaq && (
              <div className="mb-6 p-6 rounded-2xl bg-[#fff9f2] border border-[#edd6ed] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-[#4e2a4a]">
                    {editingFaq ? 'Edit FAQ Question' : 'Create New FAQ Question'}
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddingFaq(false);
                      setEditingFaq(null);
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={faqForm.category}
                      onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-bold text-[#4e2a4a]"
                    >
                      {faqCategories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                    Question (Heading) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. What will be the venue of the exams?"
                    value={faqForm.q}
                    onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                    Detailed Answer Text *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter complete explanatory answer..."
                    value={faqForm.a}
                    onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-medium text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsAddingFaq(false);
                      setEditingFaq(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-[#edd6ed] hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveFaqForm}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] transition-colors cursor-pointer shadow-sm"
                  >
                    Save FAQ
                  </button>
                </div>
              </div>
            )}

            {/* FAQs List Accordion / Card View */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => (
                <div key={faq.id || idx} className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed]">
                        {faq.category || 'General'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">#{idx + 1}</span>
                    </div>
                    <h4 className="text-xs font-black text-[#4e2a4a]">
                      {faq.q}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingFaq(faq);
                        setFaqForm({
                          id: faq.id,
                          category: faq.category || 'General & Venue',
                          q: faq.q,
                          a: faq.a,
                          enabled: faq.enabled !== false
                        });
                        setIsAddingFaq(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-[#6d3a68] transition-colors cursor-pointer"
                      title="Edit FAQ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: EXAM DATES & SCHEDULE MANAGER                       */}
      {/* ========================================================= */}
      {activeSection === 'dates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-[#4e2a4a]">
                  Exam Dates, Slots &amp; Registration Timelines (Session 2026-27)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select an Olympiad subject below to customize Level 1 and Level 2 exam schedules, registration deadlines, and fee structures.
                </p>
              </div>

              <button
                onClick={handleSaveDates}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white hover:bg-[#5c3158] transition-colors cursor-pointer shadow-md shadow-[#6d3a68]/20 w-fit"
              >
                <Save className="w-4 h-4 text-[#e7b84b]" />
                <span>Save All Date Changes</span>
              </button>
            </div>

            {/* Subject Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin mb-6">
              {subjectKeys.map((key) => {
                const meta = OLYMPIAD_SUBJECT_METADATA[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDateSubject(key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedDateSubject === key
                        ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-sm'
                        : 'bg-[#faf5fa] text-[#4e2a4a] hover:bg-[#f4ebf4]'
                    }`}
                  >
                    {meta.shortName} ({meta.code})
                  </button>
                );
              })}
            </div>

            {/* Dates Form for Selected Subject */}
            {datesConfig[selectedDateSubject] && (
              <div className="bg-[#faf5fa] rounded-2xl p-6 border border-[#edd6ed] space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white">
                    {OLYMPIAD_SUBJECT_METADATA[selectedDateSubject]?.code}
                  </span>
                  <h4 className="text-sm font-black text-[#4e2a4a]">
                    {OLYMPIAD_SUBJECT_METADATA[selectedDateSubject]?.fullName} Exam Schedule
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Level 1 Examination Dates (Slot 1 &amp; Slot 2)
                    </label>
                    <input
                      type="text"
                      value={datesConfig[selectedDateSubject]?.level1Dates || ''}
                      onChange={(e) => {
                        const updated = {
                          ...datesConfig,
                          [selectedDateSubject]: {
                            ...datesConfig[selectedDateSubject],
                            level1Dates: e.target.value
                          }
                        };
                        setDatesConfig(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Level 2 Grand Finale Dates
                    </label>
                    <input
                      type="text"
                      value={datesConfig[selectedDateSubject]?.level2Dates || ''}
                      onChange={(e) => {
                        const updated = {
                          ...datesConfig,
                          [selectedDateSubject]: {
                            ...datesConfig[selectedDateSubject],
                            level2Dates: e.target.value
                          }
                        };
                        setDatesConfig(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Last Date of Registration
                    </label>
                    <input
                      type="text"
                      value={datesConfig[selectedDateSubject]?.lastDateReg || ''}
                      onChange={(e) => {
                        const updated = {
                          ...datesConfig,
                          [selectedDateSubject]: {
                            ...datesConfig[selectedDateSubject],
                            lastDateReg: e.target.value
                          }
                        };
                        setDatesConfig(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Level 1 Answer Key Release Date
                    </label>
                    <input
                      type="text"
                      value={datesConfig[selectedDateSubject]?.level1AnswerKey || ''}
                      onChange={(e) => {
                        const updated = {
                          ...datesConfig,
                          [selectedDateSubject]: {
                            ...datesConfig[selectedDateSubject],
                            level1AnswerKey: e.target.value
                          }
                        };
                        setDatesConfig(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Level 1 Result Announcement Timeline
                    </label>
                    <input
                      type="text"
                      value={datesConfig[selectedDateSubject]?.level1Result || ''}
                      onChange={(e) => {
                        const updated = {
                          ...datesConfig,
                          [selectedDateSubject]: {
                            ...datesConfig[selectedDateSubject],
                            level1Result: e.target.value
                          }
                        };
                        setDatesConfig(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Fee (India &amp; International)
                    </label>
                    <input
                      type="text"
                      value={datesConfig[selectedDateSubject]?.feeIndia || 'INR ₹250 per student / USD $15'}
                      onChange={(e) => {
                        const updated = {
                          ...datesConfig,
                          [selectedDateSubject]: {
                            ...datesConfig[selectedDateSubject],
                            feeIndia: e.target.value
                          }
                        };
                        setDatesConfig(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleSaveDates}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] transition-colors cursor-pointer shadow-sm"
                  >
                    Save {OLYMPIAD_SUBJECT_METADATA[selectedDateSubject]?.code} Dates
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: EXAM SYLLABUS MANAGER                              */}
      {/* ========================================================= */}
      {activeSection === 'syllabus' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-[#4e2a4a]">
                  Exam Syllabus &amp; Curriculum Breakdown Manager
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a Subject and Class to review and modify chapters, topics, and question weightages.
                </p>
              </div>

              <button
                onClick={handleSaveSyllabus}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white hover:bg-[#5c3158] transition-colors cursor-pointer shadow-md shadow-[#6d3a68]/20 w-fit"
              >
                <Save className="w-4 h-4 text-[#e7b84b]" />
                <span>Save Syllabus Updates</span>
              </button>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                  Olympiad Subject
                </label>
                <select
                  value={selectedSyllabusSubject}
                  onChange={(e) => setSelectedSyllabusSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a]"
                >
                  {subjectKeys.map(k => (
                    <option key={k} value={k}>
                      {OLYMPIAD_SUBJECT_METADATA[k].fullName} ({OLYMPIAD_SUBJECT_METADATA[k].code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                  Class / Grade Level
                </label>
                <select
                  value={selectedSyllabusClass}
                  onChange={(e) => setSelectedSyllabusClass(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a]"
                >
                  {ALL_CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Syllabus Sections */}
            <div className="space-y-4">
              {Array.isArray(currentSyllabusEdit) ? (
                currentSyllabusEdit.map((sec, sIdx) => (
                  <div key={sIdx} className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={sec.sectionName || ''}
                        onChange={(e) => {
                          const updated = [...currentSyllabusEdit];
                          updated[sIdx] = { ...updated[sIdx], sectionName: e.target.value };
                          setCurrentSyllabusEdit(updated);
                        }}
                        className="font-black text-xs text-[#4e2a4a] bg-white px-3 py-1.5 rounded-lg border border-[#edd6ed] w-full max-w-md"
                      />
                      <span className="text-[11px] font-bold text-[#8c4e8b] bg-[#f4ebf4] px-2.5 py-1 rounded-full">
                        Section {sIdx + 1}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Topics &amp; Concepts (Comma or newline separated)
                      </label>
                      <textarea
                        rows={3}
                        value={Array.isArray(sec.topics) ? sec.topics.join(', ') : (sec.topics || '')}
                        onChange={(e) => {
                          const updated = [...currentSyllabusEdit];
                          const topicsArr = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                          updated[sIdx] = { ...updated[sIdx], topics: topicsArr };
                          setCurrentSyllabusEdit(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-medium text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                  Syllabus for this class is loaded from master curriculum defaults.
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveSyllabus}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] transition-colors cursor-pointer shadow-md shadow-[#6d3a68]/20"
              >
                Save Syllabus for {selectedSyllabusClass}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: SAMPLE PAPERS & MOCK TESTS MANAGER                 */}
      {/* ========================================================= */}
      {activeSection === 'sample_papers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-[#4e2a4a]">
                  Sample Papers &amp; Interactive Mock Tests Config
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure default mock test duration, total questions, marks distribution, and candidate form instructions.
                </p>
              </div>

              <button
                onClick={handleSaveSamplePapers}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white hover:bg-[#5c3158] transition-colors cursor-pointer shadow-md shadow-[#6d3a68]/20 w-fit"
              >
                <Save className="w-4 h-4 text-[#e7b84b]" />
                <span>Save Sample Paper Settings</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#faf5fa] border border-[#edd6ed]">
              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                  Default Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={samplePapersStore.durationMins || 60}
                  onChange={(e) => setSamplePapersStore({ ...samplePapersStore, durationMins: parseInt(e.target.value) || 60 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                  Total Questions
                </label>
                <input
                  type="number"
                  value={samplePapersStore.totalQuestions || 35}
                  onChange={(e) => setSamplePapersStore({ ...samplePapersStore, totalQuestions: parseInt(e.target.value) || 35 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                  Total Maximum Marks
                </label>
                <input
                  type="number"
                  value={samplePapersStore.totalMarks || 60}
                  onChange={(e) => setSamplePapersStore({ ...samplePapersStore, totalMarks: parseInt(e.target.value) || 60 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                  Passing Benchmark (%)
                </label>
                <input
                  type="number"
                  value={samplePapersStore.passingMarks || 40}
                  onChange={(e) => setSamplePapersStore({ ...samplePapersStore, passingMarks: parseInt(e.target.value) || 40 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a]"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4">
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                  Candidate Instructions &amp; Marking Rules
                </label>
                <textarea
                  rows={3}
                  value={samplePapersStore.instructions || ''}
                  onChange={(e) => setSamplePapersStore({ ...samplePapersStore, instructions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-medium text-[#4e2a4a]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: MARKING SCHEME & EXAM PATTERN MANAGER              */}
      {/* ========================================================= */}
      {activeSection === 'pattern' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-[#4e2a4a]">
                  Marking Scheme &amp; Section Weightage Manager
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure question count, duration, Section 1 (Fundamentals) and Section 2 (Achievers / HOTS) weightages for each class band.
                </p>
              </div>

              <button
                onClick={handleSavePattern}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white hover:bg-[#5c3158] transition-colors cursor-pointer shadow-md shadow-[#6d3a68]/20 w-fit"
              >
                <Save className="w-4 h-4 text-[#e7b84b]" />
                <span>Save Marking Scheme</span>
              </button>
            </div>

            {/* Class Bands Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin mb-6">
              {[
                { id: 'early', label: 'Early Years (Nursery, LKG, UKG)' },
                { id: 'primary', label: 'Primary (Class 1 to 4)' },
                { id: 'middle', label: 'Middle (Class 5 to 8)' },
                { id: 'secondary', label: 'Secondary (Class 9 & 10)' },
                { id: 'senior', label: 'Senior Secondary (Class 11 & 12)' }
              ].map(band => (
                <button
                  key={band.id}
                  onClick={() => setSelectedPatternBand(band.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedPatternBand === band.id
                      ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-sm'
                      : 'bg-[#faf5fa] text-[#4e2a4a] hover:bg-[#f4ebf4]'
                  }`}
                >
                  {band.label}
                </button>
              ))}
            </div>

            {/* Pattern Band Form */}
            {patternConfigStore[selectedPatternBand] && (
              <div className="p-6 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Exam Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={patternConfigStore[selectedPatternBand].duration}
                      onChange={(e) => {
                        const updated = {
                          ...patternConfigStore,
                          [selectedPatternBand]: {
                            ...patternConfigStore[selectedPatternBand],
                            duration: parseInt(e.target.value) || 60
                          }
                        };
                        setPatternConfigStore(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Total Questions
                    </label>
                    <input
                      type="number"
                      value={patternConfigStore[selectedPatternBand].totalQ}
                      onChange={(e) => {
                        const updated = {
                          ...patternConfigStore,
                          [selectedPatternBand]: {
                            ...patternConfigStore[selectedPatternBand],
                            totalQ: parseInt(e.target.value) || 35
                          }
                        };
                        setPatternConfigStore(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Total Max Marks
                    </label>
                    <input
                      type="number"
                      value={patternConfigStore[selectedPatternBand].totalMarks}
                      onChange={(e) => {
                        const updated = {
                          ...patternConfigStore,
                          [selectedPatternBand]: {
                            ...patternConfigStore[selectedPatternBand],
                            totalMarks: parseInt(e.target.value) || 60
                          }
                        };
                        setPatternConfigStore(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Section 1 Questions (Fundamentals)
                    </label>
                    <input
                      type="number"
                      value={patternConfigStore[selectedPatternBand].sec1}
                      onChange={(e) => {
                        const updated = {
                          ...patternConfigStore,
                          [selectedPatternBand]: {
                            ...patternConfigStore[selectedPatternBand],
                            sec1: parseInt(e.target.value) || 30
                          }
                        };
                        setPatternConfigStore(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Section 2 Questions (Achievers / HOTS)
                    </label>
                    <input
                      type="number"
                      value={patternConfigStore[selectedPatternBand].sec2}
                      onChange={(e) => {
                        const updated = {
                          ...patternConfigStore,
                          [selectedPatternBand]: {
                            ...patternConfigStore[selectedPatternBand],
                            sec2: parseInt(e.target.value) || 5
                          }
                        };
                        setPatternConfigStore(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-semibold text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1">
                      Negative Marking
                    </label>
                    <select
                      value={patternConfigStore[selectedPatternBand].negMarking}
                      onChange={(e) => {
                        const updated = {
                          ...patternConfigStore,
                          [selectedPatternBand]: {
                            ...patternConfigStore[selectedPatternBand],
                            negMarking: e.target.value
                          }
                        };
                        setPatternConfigStore(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-white text-xs font-bold text-[#4e2a4a]"
                    >
                      <option value="No">No Negative Marking</option>
                      <option value="Yes (-0.25)">Yes (-0.25 marks)</option>
                      <option value="Yes (-0.50)">Yes (-0.50 marks)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleSavePattern}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] transition-colors cursor-pointer shadow-sm"
                  >
                    Save Marking Scheme for this Band
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
