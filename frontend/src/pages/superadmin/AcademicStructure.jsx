import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Layers, BookOpen, Plus, Edit2, Trash2, FolderTree, Tag, Hash, Check } from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';

export const AcademicStructure = () => {
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'subjects' | 'chapters' | 'topics'
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for chapters/topics
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');

  // Modals
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);

  // Editing state
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [classForm, setClassForm] = useState({ name: '', code: '', order_no: 1 });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', icon: 'BookOpen', color: '#4F46E5' });
  const [chapterForm, setChapterForm] = useState({ class_id: '', subject_id: '', name: '', code: '', order_no: 1 });
  const [topicForm, setTopicForm] = useState({ chapter_id: '', name: '', description: '', order_no: 1 });

  const [actionLoading, setActionLoading] = useState(false);

  const fetchClasses = async () => {
    const res = await apiClient.get('/academic/classes');
    if (res.success) setClasses(res.data || []);
  };

  const fetchSubjects = async () => {
    const res = await apiClient.get('/academic/subjects');
    if (res.success) setSubjects(res.data || []);
  };

  const fetchChapters = async () => {
    const res = await apiClient.get('/academic/chapters', {
      class_id: selectedClassId,
      subject_id: selectedSubjectId
    });
    if (res.success) setChapters(res.data || []);
  };

  const fetchTopics = async () => {
    const res = await apiClient.get('/academic/topics', {
      chapter_id: selectedChapterId
    });
    if (res.success) setTopics(res.data || []);
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchClasses(), fetchSubjects()]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (activeTab === 'chapters') {
      fetchChapters();
    } else if (activeTab === 'topics') {
      fetchChapters();
      fetchTopics();
    }
  }, [activeTab, selectedClassId, selectedSubjectId, selectedChapterId]);

  // Classes Handlers
  const handleSaveClass = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        await apiClient.put(`/academic/classes/${editingItem.id}`, classForm);
      } else {
        await apiClient.post('/academic/classes', classForm);
      }
      setShowClassModal(false);
      fetchClasses();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!confirm('Are you sure? Deleting a class cascades related student mappings.')) return;
    try {
      await apiClient.delete(`/academic/classes/${id}`);
      fetchClasses();
    } catch (err) {
      alert(err.message);
    }
  };

  // Subject Handlers
  const handleSaveSubject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        await apiClient.put(`/academic/subjects/${editingItem.id}`, subjectForm);
      } else {
        await apiClient.post('/academic/subjects', subjectForm);
      }
      setShowSubjectModal(false);
      fetchSubjects();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      await apiClient.delete(`/academic/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      alert(err.message);
    }
  };

  // Chapter Handlers
  const handleSaveChapter = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        await apiClient.put(`/academic/chapters/${editingItem.id}`, chapterForm);
      } else {
        await apiClient.post('/academic/chapters', chapterForm);
      }
      setShowChapterModal(false);
      fetchChapters();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Topic Handlers
  const handleSaveTopic = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await apiClient.post('/academic/topics', topicForm);
      setShowTopicModal(false);
      fetchTopics();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Academic Curriculum Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage hierarchical structure: Class (1–12) → Subject → Chapter → Topics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'classes' && (
            <Button variant="primary" size="sm" icon={Plus} onClick={() => { setEditingItem(null); setClassForm({ name: '', code: '', order_no: classes.length + 1 }); setShowClassModal(true); }}>
              Add Class
            </Button>
          )}
          {activeTab === 'subjects' && (
            <Button variant="primary" size="sm" icon={Plus} onClick={() => { setEditingItem(null); setSubjectForm({ name: '', code: '', icon: 'BookOpen', color: '#4F46E5' }); setShowSubjectModal(true); }}>
              Add Subject
            </Button>
          )}
          {activeTab === 'chapters' && (
            <Button variant="primary" size="sm" icon={Plus} onClick={() => { setEditingItem(null); setChapterForm({ class_id: selectedClassId || classes[0]?.id || '', subject_id: selectedSubjectId || subjects[0]?.id || '', name: '', code: '', order_no: 1 }); setShowChapterModal(true); }}>
              Add Chapter
            </Button>
          )}
          {activeTab === 'topics' && (
            <Button variant="primary" size="sm" icon={Plus} onClick={() => { setEditingItem(null); setTopicForm({ chapter_id: selectedChapterId || chapters[0]?.id || '', name: '', description: '', order_no: 1 }); setShowTopicModal(true); }}>
              Add Topic
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs max-w-xl">
        {[
          { id: 'classes', label: 'Classes 1–12', icon: Layers },
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'chapters', label: 'Chapters', icon: FolderTree },
          { id: 'topics', label: 'Topics', icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CLASSES */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                    {cls.code}
                  </span>
                  <Badge variant={cls.status === 'active' ? 'active' : 'inactive'} size="sm">
                    {cls.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-2">{cls.name}</h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span>{cls.student_count || 0} Students</span>
                  <span>•</span>
                  <span>{cls.question_count || 0} Questions</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingItem(cls); setClassForm({ name: cls.name, code: cls.code, order_no: cls.order_no }); setShowClassModal(true); }}
                  className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClass(cls.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: sub.color || '#4F46E5' }}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">{sub.code}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{sub.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{sub.chapter_count || 0} Chapters • {sub.question_count || 0} Questions</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingItem(sub); setSubjectForm({ name: sub.name, code: sub.code, icon: sub.icon, color: sub.color }); setShowSubjectModal(true); }}
                  className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSubject(sub.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CHAPTERS */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              <option value="">All Academic Classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Chapter Name & Code</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Topics Count</th>
                  <th className="py-3.5 px-4">Questions</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chapters.length === 0 ? (
                  <tr><td colSpan="6" className="py-8 text-center text-slate-400">No chapters found for selected criteria.</td></tr>
                ) : (
                  chapters.map((ch) => (
                    <tr key={ch.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{ch.name}</p>
                        <p className="text-[11px] font-mono text-slate-400">{ch.code || 'CH-' + ch.id}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{ch.class_name}</td>
                      <td className="py-3.5 px-4 font-semibold text-brand-600">{ch.subject_name}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{ch.topic_count || 0} topics</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{ch.question_count || 0}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => { setEditingItem(ch); setChapterForm({ class_id: ch.class_id, subject_id: ch.subject_id, name: ch.name, code: ch.code || '', order_no: ch.order_no }); setShowChapterModal(true); }}
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
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

      {/* TAB 4: TOPICS */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
            <label className="text-xs font-bold text-slate-600 mr-2">Filter by Chapter:</label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold min-w-[240px]"
            >
              <option value="">All Chapters</option>
              {chapters.map((ch) => <option key={ch.id} value={ch.id}>{ch.class_name} - {ch.subject_name}: {ch.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((tp) => (
              <div key={tp.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                  {tp.chapter_name}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{tp.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{tp.description || 'No description provided.'}</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{tp.question_count || 0} Questions</span>
                  <span>Order: #{tp.order_no}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLASS MODAL */}
      <Modal isOpen={showClassModal} onClose={() => setShowClassModal(false)} title={editingItem ? 'Edit Academic Class' : 'Add New Class'} maxWidth="max-w-md" footer={<Button variant="primary" loading={actionLoading} onClick={handleSaveClass}>Save Class</Button>}>
        <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Class Name *</label>
            <input type="text" required value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} placeholder="e.g. Class 10" className="w-full px-3 py-2 border rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Code *</label>
              <input type="text" required value={classForm.code} onChange={(e) => setClassForm({ ...classForm, code: e.target.value })} placeholder="e.g. CLASS-10" className="w-full px-3 py-2 border rounded-xl font-mono" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Order #</label>
              <input type="number" value={classForm.order_no} onChange={(e) => setClassForm({ ...classForm, order_no: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-xl" />
            </div>
          </div>
        </form>
      </Modal>

      {/* SUBJECT MODAL */}
      <Modal isOpen={showSubjectModal} onClose={() => setShowSubjectModal(false)} title={editingItem ? 'Edit Subject' : 'Add New Subject'} maxWidth="max-w-md" footer={<Button variant="primary" loading={actionLoading} onClick={handleSaveSubject}>Save Subject</Button>}>
        <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Subject Name *</label>
            <input type="text" required value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} placeholder="e.g. Mathematics" className="w-full px-3 py-2 border rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Code *</label>
              <input type="text" required value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} placeholder="e.g. MATH" className="w-full px-3 py-2 border rounded-xl font-mono" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Accent Color</label>
              <input type="color" value={subjectForm.color} onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })} className="w-full h-10 p-1 border rounded-xl" />
            </div>
          </div>
        </form>
      </Modal>

      {/* CHAPTER MODAL */}
      <Modal isOpen={showChapterModal} onClose={() => setShowChapterModal(false)} title={editingItem ? 'Edit Chapter' : 'Add New Chapter'} maxWidth="max-w-md" footer={<Button variant="primary" loading={actionLoading} onClick={handleSaveChapter}>Save Chapter</Button>}>
        <form onSubmit={handleSaveChapter} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Class *</label>
              <select required value={chapterForm.class_id} onChange={(e) => setChapterForm({ ...chapterForm, class_id: e.target.value })} className="w-full px-3 py-2 border rounded-xl">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Subject *</label>
              <select required value={chapterForm.subject_id} onChange={(e) => setChapterForm({ ...chapterForm, subject_id: e.target.value })} className="w-full px-3 py-2 border rounded-xl">
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Chapter Title *</label>
            <input type="text" required value={chapterForm.name} onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })} placeholder="e.g. Real Numbers & Polynomials" className="w-full px-3 py-2 border rounded-xl" />
          </div>
        </form>
      </Modal>

      {/* TOPIC MODAL */}
      <Modal isOpen={showTopicModal} onClose={() => setShowTopicModal(false)} title="Add New Topic" maxWidth="max-w-md" footer={<Button variant="primary" loading={actionLoading} onClick={handleSaveTopic}>Save Topic</Button>}>
        <form onSubmit={handleSaveTopic} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Chapter *</label>
            <select required value={topicForm.chapter_id} onChange={(e) => setTopicForm({ ...topicForm, chapter_id: e.target.value })} className="w-full px-3 py-2 border rounded-xl">
              <option value="">Select Chapter</option>
              {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.class_name} - {ch.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Topic Name *</label>
            <input type="text" required value={topicForm.name} onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })} placeholder="e.g. Euclid Division Lemma" className="w-full px-3 py-2 border rounded-xl" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea value={topicForm.description} onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-xl" />
          </div>
        </form>
      </Modal>
    </div>
  );
};
