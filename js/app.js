/**
 * OlympiadHub - Master Application & View Routing Engine
 * Coordinates public website views, interactive filters, mock test launches, auth & demo profiles.
 */

class AppEngine {
  constructor() {
    this.currentView = 'home-view';
    this.currentUser = window.OlympiadDB.data.users[0]; // Default: Student Advik Sharma
    this.selectedClassFilter = '5';
    this.selectedSubjectFilter = 'all';
    this.leaderboardSearchTerm = '';
  }

  init() {
    this.renderHeaderUserStatus();
    this.bindGlobalEvents();
    this.showView('home-view');
    this.renderPublicOlympiads();
    this.renderUpcomingExams();
    this.renderSamplePapers();
    this.renderPreviousPapers();
    this.renderLeaderboard();
    this.renderSyllabusSection();
    this.animateCounters();
    if (window.lucide) window.lucide.createIcons();
  }

  bindGlobalEvents() {
    // Navigation link clicks
    document.querySelectorAll('[data-view-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = el.getAttribute('data-view-target');
        this.showView(target);
      });
    });
  }

  showView(viewId) {
    this.currentView = viewId;
    
    // Hide all view sections
    document.querySelectorAll('.app-view').forEach(section => {
      section.classList.add('hidden');
    });

    // Show target section
    const targetEl = document.getElementById(viewId);
    if (targetEl) {
      targetEl.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Adjust navbar styling if in active exam mode
    const nav = document.getElementById('main-navbar');
    if (nav) {
      if (viewId === 'exam-active-view') {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
    }

    // Role-specific view triggers
    if (viewId === 'student-portal-view' && window.OlympiadPortals) {
      window.OlympiadPortals.renderStudentPortal();
    } else if (viewId === 'parent-portal-view' && window.OlympiadPortals) {
      window.OlympiadPortals.renderParentPortal();
    } else if (viewId === 'school-portal-view' && window.OlympiadPortals) {
      window.OlympiadPortals.renderSchoolPortal();
    } else if (viewId === 'admin-portal-view' && window.OlympiadAdmin) {
      window.OlympiadAdmin.renderAdminView();
    } else if (viewId === 'olympiads-view') {
      this.renderPublicOlympiads();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  switchUserRole(role) {
    const matched = window.OlympiadDB.data.users.find(u => u.role === role);
    if (matched) {
      this.currentUser = matched;
      this.renderHeaderUserStatus();
      this.showToast(`Switched profile to ${matched.name} (${matched.role.toUpperCase()})`, 'info');

      if (role === 'student') this.showView('student-portal-view');
      else if (role === 'parent') this.showView('parent-portal-view');
      else if (role === 'school') this.showView('school-portal-view');
      else if (role === 'admin') this.showView('admin-portal-view');
    }
  }

  renderHeaderUserStatus() {
    const el = document.getElementById('header-user-badge');
    if (!el) return;
    el.innerHTML = `
      <div class="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="font-bold text-slate-800">${this.currentUser.name}</span>
        <span class="text-[10px] uppercase font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border">
          ${this.currentUser.role}
        </span>
      </div>
    `;
  }

  showToast(message, type = 'info') {
    const toaster = document.getElementById('app-toaster');
    if (!toaster) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-800 text-white border-emerald-600' :
                    type === 'warning' ? 'bg-amber-800 text-white border-amber-600' :
                    'bg-slate-900 text-white border-slate-700';

    toast.className = `px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center space-x-2 transition-all transform duration-300 opacity-0 translate-y-2 ${bgClass}`;
    toast.innerHTML = `<span>${message}</span>`;

    toaster.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    }, 50);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ================= PUBLIC OLYMPIADS SECTION =================
  renderPublicOlympiads() {
    const containers = [
      document.getElementById('public-olympiads-grid'),
      document.getElementById('olympiads-page-grid')
    ];

    const olympiads = window.OlympiadDB.getOlympiads();
    const html = olympiads.map(o => `
      <div class="olympiad-card bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              ${o.code}
            </span>
            <span class="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              ${o.badge}
            </span>
          </div>

          <h3 class="text-lg font-bold text-slate-900 mb-2 leading-snug">${o.name}</h3>
          <p class="text-xs text-slate-600 leading-relaxed mb-4">${o.overview}</p>

          <div class="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
            <div class="flex justify-between">
              <span>Eligible Classes:</span>
              <strong class="text-slate-800">Classes ${o.eligibleClasses.join(', ')}</strong>
            </div>
            <div class="flex justify-between">
              <span>Exam Duration:</span>
              <strong class="text-slate-800">${o.durationMinutes} Minutes (${o.totalQuestions} Qs)</strong>
            </div>
            <div class="flex justify-between">
              <span>Registration Fee:</span>
              <strong class="text-blue-900 font-bold">$${o.fee}</strong>
            </div>
          </div>
        </div>

        <div class="pt-2 grid grid-cols-2 gap-2">
          <button onclick="window.OlympiadApp.openOlympiadDetailModal('${o.id}')" class="px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center transition">
            View Syllabus
          </button>
          <button onclick="window.OlympiadPortals.openCheckoutModal('${o.id}')" class="px-3 py-2.5 rounded-xl btn-teal font-bold text-xs text-white text-center shadow transition">
            Register Now
          </button>
        </div>
      </div>
    `).join('');

    containers.forEach(c => {
      if (c) c.innerHTML = html;
    });
  }

  // ================= UPCOMING EXAMS SECTION =================
  renderUpcomingExams() {
    const container = document.getElementById('upcoming-exams-list');
    if (!container) return;

    const list = window.OlympiadDB.getOlympiads().slice(0, 4);
    container.innerHTML = list.map(o => `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center font-extrabold text-sm shrink-0">
            ${o.code}
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h3 class="text-base font-bold text-slate-900">${o.name}</h3>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">Open for Cl ${o.eligibleClasses[0]}-${o.eligibleClasses[o.eligibleClasses.length-1]}</span>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>📅 Date: <strong class="text-slate-800">${o.examDate}</strong></span>
              <span>⏱️ Duration: <strong>${o.durationMinutes} Mins</strong></span>
              <span>📝 Questions: <strong>${o.totalQuestions} MCQs</strong></span>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3 self-end md:self-auto">
          <button onclick="window.OlympiadApp.startQuickMock('${o.code}')" class="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center space-x-1">
            <i data-lucide="play" class="w-3.5 h-3.5 text-blue-600"></i>
            <span>Try Free Mock</span>
          </button>
          <button onclick="window.OlympiadPortals.openCheckoutModal('${o.id}')" class="px-4 py-2.5 rounded-xl btn-primary text-white font-bold text-xs shadow flex items-center space-x-1">
            <span>Register ($${o.fee})</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  // ================= SAMPLE PAPERS =================
  renderSamplePapers() {
    const container = document.getElementById('sample-papers-grid');
    if (!container) return;

    const papers = window.OlympiadDB.getSamplePapers({ class: this.selectedClassFilter });
    container.innerHTML = (papers.length > 0 ? papers : window.OlympiadDB.data.sample_papers).map(p => `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-xs">${p.olympiadCode}</span>
            <span class="text-xs text-slate-400 font-medium">Year ${p.year}</span>
          </div>
          <h4 class="text-sm font-bold text-slate-900 mb-1 leading-snug">${p.paperName}</h4>
          <div class="text-xs text-slate-500 space-y-0.5">
            <div>Class: <strong>Class ${p.class}</strong> • Level: <strong>${p.difficulty}</strong></div>
            <div>${p.totalQuestions} Questions • ${p.totalMarks} Marks • ${p.durationMinutes} Mins</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button onclick="window.OlympiadApp.viewSamplePaper('${p.id}')" class="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center">
            View Paper
          </button>
          <button onclick="window.OlympiadApp.startQuickMock('${p.olympiadCode}')" class="px-3 py-2 rounded-lg btn-teal text-white font-bold text-xs text-center shadow">
            Start Online
          </button>
        </div>
      </div>
    `).join('');
  }

  // ================= PREVIOUS PAPERS =================
  renderPreviousPapers() {
    const container = document.getElementById('previous-papers-grid');
    if (!container) return;

    const papers = window.OlympiadDB.data.previous_papers;
    container.innerHTML = papers.map(p => `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="px-2.5 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-xs">${p.olympiadCode} Official</span>
            <span class="text-xs text-slate-400 font-medium">Exam Year ${p.year}</span>
          </div>
          <h4 class="text-sm font-bold text-slate-900 mb-1 leading-snug">${p.paperName}</h4>
          <div class="text-xs text-slate-500">
            <div>Class: <strong>Class ${p.class}</strong> • Avg National Score: <strong>${p.averageScoreRecorded}</strong></div>
            <div>Full official marking scheme & step-by-step answer key included.</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button onclick="window.OlympiadApp.viewSamplePaper('${p.id}')" class="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center">
            Official Key
          </button>
          <button onclick="window.OlympiadApp.startQuickMock('${p.olympiadCode}')" class="px-3 py-2 rounded-lg btn-primary text-white font-bold text-xs text-center shadow">
            Solve Online
          </button>
        </div>
      </div>
    `).join('');
  }

  // ================= LEADERBOARD =================
  renderLeaderboard() {
    const container = document.getElementById('leaderboard-tbody');
    if (!container) return;

    let list = window.OlympiadDB.getLeaderboard({ class: this.selectedClassFilter });
    if (this.leaderboardSearchTerm) {
      const s = this.leaderboardSearchTerm.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(s) || r.city.toLowerCase().includes(s) || r.school.toLowerCase().includes(s));
    }

    container.innerHTML = list.map((r, i) => `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3.5 font-bold text-slate-900">
          ${i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${r.rank}`}
        </td>
        <td class="p-3.5">
          <div class="font-bold text-slate-900">${r.name}</div>
          <div class="text-xs text-slate-500">${r.school}, ${r.city}</div>
        </td>
        <td class="p-3.5 text-slate-700 font-medium">Class ${r.class}</td>
        <td class="p-3.5 font-bold text-emerald-600">${r.score}/100</td>
        <td class="p-3.5 font-bold text-blue-900">${r.percentile}%ile</td>
      </tr>
    `).join('');
  }

  filterLeaderboard(searchTerm) {
    this.leaderboardSearchTerm = searchTerm;
    this.renderLeaderboard();
  }

  // ================= SYLLABUS =================
  renderSyllabusSection() {
    const container = document.getElementById('syllabus-topics-list');
    if (!container) return;

    const topics = window.OlympiadDB.getTopicsByClassAndSubject('5', 'math');
    container.innerHTML = topics.map(t => `
      <div class="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-slate-900">${t.title}</h4>
          <span class="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900">${t.weight}% Weightage</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">${t.desc}</p>
        <div class="pt-2 flex items-center space-x-3 text-xs">
          <button onclick="window.OlympiadApp.startQuickMock('IMO')" class="text-teal-800 font-bold hover:underline">
            Practice ${t.title} Questions →
          </button>
        </div>
      </div>
    `).join('');
  }

  // ================= QUICK MOCK EXAM LAUNCH =================
  startQuickMock(code = 'IMO') {
    const o = window.OlympiadDB.getOlympiadById(code) || window.OlympiadDB.getOlympiads()[0];
    const questions = window.OlympiadDB.getQuestions({ class: '5' });

    this.showView('exam-active-view');
    window.examEngine.startExam(o, questions);
    this.showToast(`Starting ${o.name} Examination Engine...`, 'info');
  }

  // ================= MODAL HELPERS =================
  openOlympiadDetailModal(id) {
    const o = window.OlympiadDB.getOlympiadById(id);
    if (!o) return;

    const modal = document.getElementById('olympiad-detail-modal');
    const content = document.getElementById('olympiad-detail-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="space-y-6">
        <div class="border-b border-slate-200 pb-4">
          <span class="px-2.5 py-1 rounded bg-blue-100 text-blue-900 font-bold text-xs uppercase">${o.code}</span>
          <h2 class="text-2xl font-extrabold text-slate-900 mt-2">${o.name}</h2>
          <p class="text-xs text-teal-800 font-semibold">${o.tagline}</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="p-3 bg-slate-50 rounded-xl border">
            <span class="text-[10px] text-slate-400 block font-semibold">ELIGIBLE CLASSES</span>
            <strong class="text-slate-900 text-xs sm:text-sm">Classes ${o.eligibleClasses.join(', ')}</strong>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border">
            <span class="text-[10px] text-slate-400 block font-semibold">DURATION</span>
            <strong class="text-slate-900 text-xs sm:text-sm">${o.durationMinutes} Minutes</strong>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border">
            <span class="text-[10px] text-slate-400 block font-semibold">QUESTIONS</span>
            <strong class="text-slate-900 text-xs sm:text-sm">${o.totalQuestions} MCQs</strong>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border">
            <span class="text-[10px] text-slate-400 block font-semibold">MARKS</span>
            <strong class="text-emerald-700 text-xs sm:text-sm">${o.totalMarks} Total</strong>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-bold text-slate-900 mb-1">Syllabus Overview</h4>
          <p class="text-xs text-slate-600 leading-relaxed">${o.syllabusSummary}</p>
        </div>

        <div>
          <h4 class="text-sm font-bold text-slate-900 mb-1">Marking Scheme</h4>
          <p class="text-xs text-slate-600 leading-relaxed">${o.markingScheme}</p>
        </div>

        <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span class="text-base font-extrabold text-slate-900">Fee: $${o.fee}</span>
          <button onclick="window.OlympiadPortals.openCheckoutModal('${o.id}'); window.OlympiadApp.closeOlympiadDetailModal();" class="px-5 py-2.5 rounded-xl btn-teal text-white font-bold text-xs sm:text-sm shadow">
            Register for Examination
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeOlympiadDetailModal() {
    const modal = document.getElementById('olympiad-detail-modal');
    if (modal) modal.classList.add('hidden');
  }

  viewSamplePaper(id) {
    const p = window.OlympiadDB.data.sample_papers.find(x => x.id === id) || window.OlympiadDB.data.previous_papers.find(x => x.id === id);
    if (!p) return;

    this.showToast(`Loaded "${p.paperName}" (Official Marking Key Ready)`, 'info');
    this.startQuickMock(p.olympiadCode);
  }

  openRegisterModal() {
    const modal = document.getElementById('auth-register-modal');
    if (modal) modal.classList.remove('hidden');
  }

  closeRegisterModal() {
    const modal = document.getElementById('auth-register-modal');
    if (modal) modal.classList.add('hidden');
  }

  handleStudentRegisterSubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('reg-student-name').value;
    const cls = document.getElementById('reg-student-class').value;
    const school = document.getElementById('reg-student-school').value;
    const email = document.getElementById('reg-student-email').value;

    if (!name || !email) {
      alert('Please provide student name and email address.');
      return;
    }

    const newStudentId = `OH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudentUser = {
      id: 'u-' + Date.now(),
      role: 'student',
      name: name,
      email: email,
      studentId: newStudentId,
      class: cls,
      school: school || 'International School',
      city: 'National Center'
    };

    window.OlympiadDB.data.users.push(newStudentUser);
    window.OlympiadDB.saveData();
    this.currentUser = newStudentUser;
    this.renderHeaderUserStatus();
    this.closeRegisterModal();

    this.showToast(`Registration Successful! Your Student ID: ${newStudentId}`, 'success');
    this.showView('student-portal-view');
  }

  animateCounters() {
    const statObj = window.OlympiadDB.getStats();
    const elStud = document.getElementById('stat-counter-students');
    const elOlym = document.getElementById('stat-counter-olympiads');
    const elQuest = document.getElementById('stat-counter-questions');
    const elSch = document.getElementById('stat-counter-schools');

    if (elStud) elStud.textContent = (statObj.studentsParticipated || 265400).toLocaleString() + '+';
    if (elOlym) elOlym.textContent = (statObj.olympiadsConducted || 52) + '+';
    if (elQuest) elQuest.textContent = (statObj.practiceQuestions || 145000).toLocaleString() + '+';
    if (elSch) elSch.textContent = (statObj.schoolsConnected || 1940).toLocaleString() + '+';
  }

  showStudentPortal() { this.showView('student-portal-view'); }
  showParentPortal() { this.showView('parent-portal-view'); }
  showSchoolPortal() { this.showView('school-portal-view'); }
  showAdminPortal() { this.showView('admin-portal-view'); }
}

window.OlympiadApp = new AppEngine();
window.addEventListener('DOMContentLoaded', () => {
  window.OlympiadApp.init();
});
