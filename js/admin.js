/**
 * OlympiadHub - Comprehensive Admin Panel Engine
 * Manages Question Bank CRUD, Exam Scheduling, Result Publishing, Metrics & System Settings.
 */

class AdminEngine {
  constructor() {
    this.activeTab = 'metrics';
  }

  renderAdminView() {
    const container = document.getElementById('admin-panel-content');
    if (!container) return;

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Admin Sidebar Navigation (3 cols) -->
        <div class="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div class="p-3 border-b border-slate-100 flex items-center space-x-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
              <i data-lucide="shield" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="text-sm font-extrabold text-slate-900">Admin Control Hub</div>
              <span class="text-[11px] text-teal-800 font-bold">SuperAdmin Access</span>
            </div>
          </div>

          <button onclick="window.OlympiadAdmin.switchTab('metrics')" class="w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2.5 transition ${this.activeTab === 'metrics' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}">
            <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
            <span>Dashboard & Metrics</span>
          </button>

          <button onclick="window.OlympiadAdmin.switchTab('questions')" class="w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2.5 transition ${this.activeTab === 'questions' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}">
            <i data-lucide="help-circle" class="w-4 h-4"></i>
            <span>Question Bank (CRUD)</span>
          </button>

          <button onclick="window.OlympiadAdmin.switchTab('exams')" class="w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2.5 transition ${this.activeTab === 'exams' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}">
            <i data-lucide="calendar" class="w-4 h-4"></i>
            <span>Exam Management</span>
          </button>

          <button onclick="window.OlympiadAdmin.switchTab('results')" class="w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2.5 transition ${this.activeTab === 'results' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}">
            <i data-lucide="award" class="w-4 h-4"></i>
            <span>Results & Certificates</span>
          </button>

          <button onclick="window.OlympiadAdmin.switchTab('students')" class="w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2.5 transition ${this.activeTab === 'students' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}">
            <i data-lucide="users" class="w-4 h-4"></i>
            <span>Students & Schools</span>
          </button>

          <button onclick="window.OlympiadAdmin.switchTab('settings')" class="w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2.5 transition ${this.activeTab === 'settings' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}">
            <i data-lucide="settings" class="w-4 h-4"></i>
            <span>Platform Settings</span>
          </button>
        </div>

        <!-- Admin Content Area (9 cols) -->
        <div id="admin-subview-zone" class="lg:col-span-9">
          <!-- Dynamic Tab Content Injected -->
        </div>
      </div>
    `;

    this.renderActiveTabContent();
    if (window.lucide) window.lucide.createIcons();
  }

  switchTab(tab) {
    this.activeTab = tab;
    this.renderAdminView();
  }

  renderActiveTabContent() {
    const zone = document.getElementById('admin-subview-zone');
    if (!zone) return;

    if (this.activeTab === 'metrics') this.renderMetricsTab(zone);
    else if (this.activeTab === 'questions') this.renderQuestionBankTab(zone);
    else if (this.activeTab === 'exams') this.renderExamsTab(zone);
    else if (this.activeTab === 'results') this.renderResultsTab(zone);
    else if (this.activeTab === 'students') this.renderStudentsTab(zone);
    else if (this.activeTab === 'settings') this.renderSettingsTab(zone);

    if (window.lucide) window.lucide.createIcons();
  }

  // ================= METRICS TAB =================
  renderMetricsTab(container) {
    const stats = window.OlympiadDB.getStats();
    const questions = window.OlympiadDB.data.questions;
    const registrations = window.OlympiadDB.data.registrations;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- 6 Main Metric Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-bold uppercase">Total Students</span>
            <div class="text-2xl font-extrabold text-slate-900 mt-1">${(stats.studentsParticipated || 265400).toLocaleString()}</div>
            <span class="text-[11px] text-teal-700 font-semibold">+1,420 this week</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-bold uppercase">Schools Enrolled</span>
            <div class="text-2xl font-extrabold text-blue-900 mt-1">${(stats.schoolsConnected || 1940).toLocaleString()}</div>
            <span class="text-[11px] text-blue-600 font-semibold">28 States & UTs</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-bold uppercase">Questions in Bank</span>
            <div class="text-2xl font-extrabold text-emerald-600 mt-1">${questions.length} Live</div>
            <span class="text-[11px] text-emerald-600 font-semibold">Verified & Tagged</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-bold uppercase">Active Registrations</span>
            <div class="text-2xl font-extrabold text-purple-600 mt-1">${registrations.length} Orders</div>
            <span class="text-[11px] text-purple-600 font-semibold">100% Paid & Verified</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-bold uppercase">Estimated Revenue</span>
            <div class="text-2xl font-extrabold text-slate-900 mt-1">$66,350</div>
            <span class="text-[11px] text-teal-700 font-semibold">2026-2027 Cycle</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-bold uppercase">Avg Pass Rate</span>
            <div class="text-2xl font-extrabold text-amber-600 mt-1">79.4%</div>
            <span class="text-[11px] text-amber-600 font-semibold">High Engagement</span>
          </div>
        </div>

        <!-- Subject Popularity Overview -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 class="text-base font-bold text-slate-900 mb-4">Olympiad Examination Participation Breakdown</h3>
          <div class="space-y-3">
            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>International Mathematics Olympiad (IMO)</span>
                <span class="text-blue-900 font-bold">42% (112,000 Candidates)</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5">
                <div class="bg-blue-900 h-2.5 rounded-full" style="width: 42%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>National Science Olympiad (NSO)</span>
                <span class="text-teal-700 font-bold">28% (74,000 Candidates)</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5">
                <div class="bg-teal-600 h-2.5 rounded-full" style="width: 28%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>International English Olympiad (IEO)</span>
                <span class="text-indigo-600 font-bold">16% (42,000 Candidates)</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5">
                <div class="bg-indigo-600 h-2.5 rounded-full" style="width: 16%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Cyber, Reasoning & GK Olympiads</span>
                <span class="text-amber-600 font-bold">14% (37,400 Candidates)</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5">
                <div class="bg-amber-500 h-2.5 rounded-full" style="width: 14%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ================= QUESTION BANK TAB (CRUD) =================
  renderQuestionBankTab(container) {
    const questions = window.OlympiadDB.getQuestions();

    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Olympiad Question Bank Repository</h2>
            <p class="text-xs text-slate-500">Add, edit, filter, or remove academic MCQ questions</p>
          </div>

          <button onclick="window.OlympiadAdmin.openAddQuestionModal()" class="px-4 py-2.5 rounded-xl btn-primary text-white font-bold text-xs sm:text-sm shadow flex items-center space-x-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>+ Create New Question</span>
          </button>
        </div>

        <!-- Questions List Table -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th class="p-3.5">ID / Code</th>
                  <th class="p-3.5">Class / Subject</th>
                  <th class="p-3.5">Question Summary</th>
                  <th class="p-3.5">Difficulty</th>
                  <th class="p-3.5">Correct Option</th>
                  <th class="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${questions.map(q => `
                  <tr class="hover:bg-slate-50">
                    <td class="p-3.5 font-mono font-bold text-slate-900">${q.id}</td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-bold">${q.subject.toUpperCase()}</span>
                      <span class="text-slate-500 ml-1">Cl ${q.class}</span>
                    </td>
                    <td class="p-3.5 max-w-xs truncate text-slate-700 font-medium">${q.question}</td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[11px] font-bold ${q.difficulty === 'Hard' ? 'bg-red-50 text-red-700' : q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}">
                        ${q.difficulty}
                      </span>
                    </td>
                    <td class="p-3.5 font-bold text-emerald-600">Option ${q.correctAnswer}</td>
                    <td class="p-3.5 text-right space-x-2">
                      <button onclick="window.OlympiadAdmin.deleteQuestion('${q.id}')" class="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  openAddQuestionModal() {
    const modal = document.getElementById('admin-question-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
  }

  closeAddQuestionModal() {
    const modal = document.getElementById('admin-question-modal');
    if (modal) modal.classList.add('hidden');
  }

  saveNewQuestion(e) {
    if (e) e.preventDefault();
    const subj = document.getElementById('q-form-subject').value;
    const cls = document.getElementById('q-form-class').value;
    const text = document.getElementById('q-form-text').value;
    const optA = document.getElementById('q-form-optA').value;
    const optB = document.getElementById('q-form-optB').value;
    const optC = document.getElementById('q-form-optC').value;
    const optD = document.getElementById('q-form-optD').value;
    const correct = document.getElementById('q-form-correct').value;
    const explanation = document.getElementById('q-form-exp').value;
    const diff = document.getElementById('q-form-diff').value;

    if (!text || !optA || !optB) {
      alert('Please fill out the question text and options.');
      return;
    }

    const qObj = {
      examCode: subj.toUpperCase(),
      subject: subj,
      class: cls,
      difficulty: diff,
      type: 'mcq',
      question: text,
      options: [
        { id: 'A', text: optA },
        { id: 'B', text: optB },
        { id: 'C', text: optC || 'None of above' },
        { id: 'D', text: optD || 'All of above' }
      ],
      correctAnswer: correct,
      explanation: explanation || 'Standard analytical principle.',
      marks: 3,
      negativeMarks: 0.5
    };

    window.OlympiadDB.addQuestion(qObj);
    this.closeAddQuestionModal();
    this.renderAdminView();
    if (window.OlympiadApp) window.OlympiadApp.showToast('New Olympiad Question Added Successfully!', 'success');
  }

  deleteQuestion(id) {
    window.OlympiadDB.deleteQuestion(id);
    this.renderAdminView();
    if (window.OlympiadApp) window.OlympiadApp.showToast('Question deleted from Question Bank', 'info');
  }

  // ================= EXAMS TAB =================
  renderExamsTab(container) {
    const olympiads = window.OlympiadDB.getOlympiads();

    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Scheduled Olympiad Examinations</h2>
            <p class="text-xs text-slate-500">Configure dates, durations, and proctoring rules</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${olympiads.map(o => `
            <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-xs">${o.code}</span>
                  <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Registration Live</span>
                </div>
                <h3 class="text-base font-bold text-slate-900 mt-2">${o.name}</h3>
                <p class="text-xs text-slate-500 mt-1">Classes: ${o.eligibleClasses.join(', ')} • Duration: ${o.durationMinutes} Mins</p>
              </div>

              <div class="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                <span class="text-slate-600">Exam Date: <strong>${o.examDate}</strong></span>
                <button onclick="window.OlympiadApp.startQuickMock('${o.code}')" class="text-blue-600 font-bold hover:underline">
                  Preview Exam Engine →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ================= RESULTS & CERTIFICATES TAB =================
  renderResultsTab(container) {
    const rankings = window.OlympiadDB.data.rankings;

    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Result & Merit Publication</h2>
            <p class="text-xs text-slate-500">Publish results, approve certificates, and review national standings</p>
          </div>
          <button onclick="window.OlympiadApp.showToast('All Class 5 Results Published and Notified to Parents!', 'success')" class="px-4 py-2 rounded-xl btn-teal text-white font-bold text-xs shadow">
            Publish All Pending Results
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th class="p-3.5">National Rank</th>
                  <th class="p-3.5">Student Name</th>
                  <th class="p-3.5">School / City</th>
                  <th class="p-3.5">Score</th>
                  <th class="p-3.5">Percentile</th>
                  <th class="p-3.5 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${rankings.map(r => `
                  <tr class="hover:bg-slate-50">
                    <td class="p-3.5 font-bold text-slate-900">#${r.rank}</td>
                    <td class="p-3.5 font-bold text-slate-800">${r.name} (Cl ${r.class})</td>
                    <td class="p-3.5 text-slate-500">${r.school}, ${r.city}</td>
                    <td class="p-3.5 font-bold text-emerald-600">${r.score}/100</td>
                    <td class="p-3.5 font-bold text-blue-900">${r.percentile}%ile</td>
                    <td class="p-3.5 text-right">
                      <button onclick="window.OlympiadCertificate.generateForAttempt({ examName: 'IMO 2026', studentName: '${r.name}', class: '${r.class}', score: ${r.score}, totalMarks: 100, percentage: ${r.percentage} })" class="text-blue-600 font-bold hover:underline">
                        Generate PDF
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ================= STUDENTS TAB =================
  renderStudentsTab(container) {
    const users = window.OlympiadDB.data.users;

    container.innerHTML = `
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 class="text-lg font-bold text-slate-900">Registered Students & Institutions Directory</h2>
        <div class="divide-y divide-slate-100">
          ${users.map(u => `
            <div class="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div>
                <strong class="text-slate-900">${u.name}</strong>
                <span class="text-slate-400 ml-2">(${u.role.toUpperCase()})</span>
                <div class="text-xs text-slate-500">${u.email} • ${u.city || 'National'}</div>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Active User</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ================= SETTINGS TAB =================
  renderSettingsTab(container) {
    const settings = window.OlympiadDB.getSettings();

    container.innerHTML = `
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 class="text-lg font-bold text-slate-900">Platform & Examination Security Configuration</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Platform Name</label>
            <input type="text" id="set-plat-name" value="${settings.platformName}" class="w-full p-2.5 rounded-lg border border-slate-300 font-medium" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Academic Session Cycle</label>
            <input type="text" id="set-acad-year" value="${settings.academicYear}" class="w-full p-2.5 rounded-lg border border-slate-300 font-medium" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Tab Switch Security Warning Limit</label>
            <input type="number" id="set-warn-limit" value="${settings.tabSwitchWarningLimit}" class="w-full p-2.5 rounded-lg border border-slate-300 font-medium" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Official Helpline</label>
            <input type="text" id="set-helpline" value="${settings.helpline}" class="w-full p-2.5 rounded-lg border border-slate-300 font-medium" />
          </div>
        </div>

        <button onclick="window.OlympiadAdmin.saveSettings()" class="px-4 py-2 rounded-xl btn-primary text-white font-bold text-xs shadow">
          Save Configuration Changes
        </button>
      </div>
    `;
  }

  saveSettings() {
    const platName = document.getElementById('set-plat-name')?.value;
    const acadYear = document.getElementById('set-acad-year')?.value;
    const warnLimit = document.getElementById('set-warn-limit')?.value;
    const helpline = document.getElementById('set-helpline')?.value;

    window.OlympiadDB.updateSettings({
      platformName: platName,
      academicYear: acadYear,
      tabSwitchWarningLimit: Number(warnLimit) || 3,
      helpline: helpline
    });

    if (window.OlympiadApp) {
      window.OlympiadApp.showToast('Platform settings successfully updated!', 'success');
    }
  }
}

window.OlympiadAdmin = new AdminEngine();
