/**
 * OlympiadHub - Multi-Role Portals Engine (Student, Parent, School, and Payment Checkout)
 * Manages personalized dashboards, CSV batch student registration, and payment gateway simulation.
 */

class PortalsEngine {
  constructor() {
    this.currentCheckoutOlympiad = null;
  }

  // ================= STUDENT PORTAL =================
  renderStudentPortal() {
    const container = document.getElementById('student-portal-content');
    if (!container) return;

    const user = window.OlympiadApp?.currentUser || { name: 'Advik Sharma', studentId: 'OH-2026-9042', class: '5' };
    const certs = window.OlympiadDB.getCertificates(user.studentId);
    const regs = window.OlympiadDB.data.registrations.filter(r => r.studentId === user.studentId);

    container.innerHTML = `
      <div class="space-y-8">
        <!-- Top Banner -->
        <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-900 to-teal-600 flex items-center justify-center text-white text-2xl font-black shadow-md">
              ${user.name.charAt(0)}
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">Welcome back, ${user.name} 👋</h1>
                <span class="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">Class ${user.class || '5'} Scholar</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
                Student ID: <strong class="text-slate-800 font-mono">${user.studentId}</strong> • St. Xavier International Academy
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button onclick="window.OlympiadApp.startQuickMock('IMO')" class="px-4 py-2.5 rounded-xl btn-primary text-white font-semibold text-xs sm:text-sm shadow flex items-center space-x-1.5">
              <i data-lucide="play-circle" class="w-4 h-4"></i>
              <span>Launch Mock Test</span>
            </button>
          </div>
        </div>

        <!-- Metric Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-bold uppercase">Registered Exams</span>
              <i data-lucide="calendar" class="w-4 h-4 text-blue-800"></i>
            </div>
            <div class="text-2xl font-extrabold text-slate-900">${regs.length}</div>
            <span class="text-[11px] text-teal-700 font-semibold">2 Active in 2026</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-bold uppercase">Practice Completed</span>
              <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
            </div>
            <div class="text-2xl font-extrabold text-slate-900">18 Tests</div>
            <span class="text-[11px] text-emerald-600 font-semibold">88% Avg Accuracy</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-bold uppercase">National Rank</span>
              <i data-lucide="trophy" class="w-4 h-4 text-amber-500"></i>
            </div>
            <div class="text-2xl font-extrabold text-slate-900">#3</div>
            <span class="text-[11px] text-amber-600 font-semibold">Top 0.5% Percentile</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-bold uppercase">Certificates</span>
              <i data-lucide="award" class="w-4 h-4 text-purple-600"></i>
            </div>
            <div class="text-2xl font-extrabold text-slate-900">${certs.length}</div>
            <span class="text-[11px] text-purple-600 font-semibold">Verified Credentials</span>
          </div>
        </div>

        <!-- Registered Olympiads & Upcoming Countdown -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-lg font-bold text-slate-900">My Registered Olympiad Examinations</h2>
              <p class="text-xs text-slate-500">Official scheduled examinations with your confirmed seat credentials</p>
            </div>
            <button onclick="window.OlympiadApp.showView('olympiads-view')" class="text-xs font-bold text-teal-800 hover:text-teal-900 hover:underline">
              + Register for more Olympiads
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${regs.map(reg => `
              <div class="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between space-y-4">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-xs">
                      ${reg.subject.toUpperCase()}
                    </span>
                    <h3 class="text-base font-bold text-slate-900 mt-2">${reg.olympiadName}</h3>
                    <div class="text-xs text-slate-500 mt-1">Reg ID: <span class="font-mono text-slate-700">${reg.id}</span></div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    ${reg.paymentStatus}
                  </span>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                  <span class="text-slate-500">Date: <strong>Nov 2026</strong></span>
                  <button onclick="window.OlympiadApp.startQuickMock('${reg.subject}')" class="px-3 py-1.5 rounded-lg btn-teal text-white font-semibold text-xs flex items-center space-x-1">
                    <i data-lucide="play" class="w-3.5 h-3.5"></i>
                    <span>Take Preparatory Mock</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Certificates & Downloads -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-900">Earned Credentials & Certificates</h2>
            <span class="text-xs text-slate-500">Authentic digital verifiable certificates</span>
          </div>

          <div class="space-y-3">
            ${certs.map(c => `
              <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-amber-50/20 gap-3">
                <div class="flex items-center space-x-3.5">
                  <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    🏆
                  </div>
                  <div>
                    <div class="text-sm font-bold text-slate-900">${c.olympiadName}</div>
                    <div class="text-xs text-slate-500">${c.rank} • Issued ${c.issueDate}</div>
                  </div>
                </div>
                <button onclick='window.OlympiadCertificate.openCertificateModal(${JSON.stringify(c)})' class="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center space-x-1.5 self-start sm:self-auto">
                  <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                  <span>View / Download Certificate</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ================= PARENT PORTAL =================
  renderParentPortal() {
    const container = document.getElementById('parent-portal-content');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-8">
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span class="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">Parent Oversight Portal</span>
            <h1 class="text-2xl font-extrabold text-slate-900 mt-2">Child Growth & Performance Tracker</h1>
            <p class="text-xs sm:text-sm text-slate-500">Monitoring: <strong class="text-slate-800">Advik Sharma</strong> (Class 5, St. Xavier Academy)</p>
          </div>
          <button onclick="window.print()" class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>Download Monthly Report</span>
          </button>
        </div>

        <!-- Key Parent Metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-semibold block uppercase">Learning Time Spent</span>
            <div class="text-2xl font-bold text-slate-900 mt-1">14.5 Hours</div>
            <span class="text-xs text-emerald-600 font-medium">↑ 22% higher than last month</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-semibold block uppercase">Strongest Subject</span>
            <div class="text-2xl font-bold text-blue-900 mt-1">Mathematics (94%)</div>
            <span class="text-xs text-slate-500">Consistent Top 1% national rank</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-semibold block uppercase">Focus Area for Improvement</span>
            <div class="text-2xl font-bold text-amber-600 mt-1">Geometry Word Problems</div>
            <span class="text-xs text-slate-500">Recommended 2 extra practice sets</span>
          </div>
        </div>

        <!-- Child Exam Schedule -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Scheduled Examination Deadlines</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th class="p-3">Olympiad</th>
                  <th class="p-3">Exam Date</th>
                  <th class="p-3">Format</th>
                  <th class="p-3">Status</th>
                  <th class="p-3">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr>
                  <td class="p-3 font-semibold text-slate-900">International Mathematics Olympiad (IMO)</td>
                  <td class="p-3 text-slate-600">November 15, 2026</td>
                  <td class="p-3 text-slate-600">60 Mins • Online Proctored</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">Confirmed</span></td>
                  <td class="p-3"><button onclick="window.OlympiadApp.startQuickMock('IMO')" class="text-blue-600 font-semibold hover:underline">Launch Parent Mock</button></td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold text-slate-900">National Science Olympiad (NSO)</td>
                  <td class="p-3 text-slate-600">November 28, 2026</td>
                  <td class="p-3 text-slate-600">60 Mins • Online Proctored</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">Confirmed</span></td>
                  <td class="p-3"><button onclick="window.OlympiadApp.startQuickMock('NSO')" class="text-blue-600 font-semibold hover:underline">Launch Parent Mock</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ================= SCHOOL PORTAL =================
  renderSchoolPortal() {
    const container = document.getElementById('school-portal-content');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-8">
        <!-- School Institutional Header -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">Institutional Coordinator Portal</span>
            <h1 class="text-2xl font-extrabold text-slate-900 mt-2">Cambridge International High School</h1>
            <p class="text-xs sm:text-sm text-slate-500">School Code: <strong class="text-slate-800 font-mono">SCH-MUM-402</strong> • Coordinator: <strong>Dr. Meenakshi Rao</strong></p>
          </div>

          <div class="flex items-center space-x-2">
            <button onclick="document.getElementById('school-csv-file').click()" class="px-4 py-2.5 rounded-xl btn-primary text-white font-semibold text-xs sm:text-sm shadow flex items-center space-x-1.5">
              <i data-lucide="upload" class="w-4 h-4"></i>
              <span>Bulk Student Upload (CSV)</span>
            </button>
            <input type="file" id="school-csv-file" accept=".csv,.xlsx" class="hidden" onchange="window.OlympiadPortals.handleCsvUpload(event)" />
          </div>
        </div>

        <!-- Institutional Metrics -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-semibold block uppercase">Enrolled Students</span>
            <div class="text-2xl font-extrabold text-slate-900 mt-1">480 Students</div>
            <span class="text-[11px] text-teal-700 font-semibold">Across Classes 1 to 10</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-semibold block uppercase">School National Rank</span>
            <div class="text-2xl font-extrabold text-blue-900 mt-1">#12 Nationally</div>
            <span class="text-[11px] text-blue-600 font-semibold">Distinction Institution</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-semibold block uppercase">Average Score</span>
            <div class="text-2xl font-extrabold text-emerald-600 mt-1">84.6%</div>
            <span class="text-[11px] text-emerald-600 font-semibold">+6.2% above state avg</span>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <span class="text-xs text-slate-400 font-semibold block uppercase">Total Medals</span>
            <div class="text-2xl font-extrabold text-amber-500 mt-1">34 Gold / Silver</div>
            <span class="text-[11px] text-amber-600 font-semibold">Ready for dispatch</span>
          </div>
        </div>

        <!-- Bulk Enrollment CSV Box -->
        <div class="bg-blue-50/70 border border-blue-200 rounded-2xl p-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-bold text-blue-950">Bulk Student Registration & CSV Importer</h3>
              <p class="text-xs text-blue-800 mt-1">
                Upload entire batches of students directly to register for Olympiads and auto-generate student login tokens.
              </p>
            </div>
            <button onclick="window.OlympiadPortals.downloadSampleCsv()" class="px-3.5 py-2 rounded-xl bg-white border border-blue-300 text-blue-900 text-xs font-bold hover:bg-blue-50 flex items-center space-x-1">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Download CSV Template</span>
            </button>
          </div>
          <div id="school-csv-status" class="mt-4 hidden p-3 rounded-lg bg-white border text-xs"></div>
        </div>

        <!-- Registered Students Table -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-900">Enrolled Student Roster</h2>
            <span class="text-xs text-slate-500">Showing top 5 of 480 students</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th class="p-3">Student Name</th>
                  <th class="p-3">Class</th>
                  <th class="p-3">Student ID</th>
                  <th class="p-3">Olympiads</th>
                  <th class="p-3">Performance Avg</th>
                  <th class="p-3">Certificate</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr>
                  <td class="p-3 font-bold text-slate-900">Advik Sharma</td>
                  <td class="p-3">Class 5</td>
                  <td class="p-3 font-mono text-slate-600">OH-2026-9042</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold">IMO, NSO</span></td>
                  <td class="p-3 font-bold text-emerald-600">94%</td>
                  <td class="p-3"><button onclick="window.OlympiadApp.showStudentPortal()" class="text-blue-600 font-semibold hover:underline">View Badge</button></td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900">Pooja Sundaram</td>
                  <td class="p-3">Class 5</td>
                  <td class="p-3 font-mono text-slate-600">OH-2026-9043</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-semibold">IMO, IEO</span></td>
                  <td class="p-3 font-bold text-emerald-600">90%</td>
                  <td class="p-3"><button class="text-blue-600 font-semibold hover:underline">View Badge</button></td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900">Devansh Rawat</td>
                  <td class="p-3">Class 6</td>
                  <td class="p-3 font-mono text-slate-600">OH-2026-9044</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-xs font-semibold">NSO, NCO</span></td>
                  <td class="p-3 font-bold text-emerald-600">88%</td>
                  <td class="p-3"><button class="text-blue-600 font-semibold hover:underline">View Badge</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  downloadSampleCsv() {
    const csvContent = "StudentName,DateOfBirth,Gender,Class,ParentName,ParentEmail,ParentPhone,Olympiads\n" +
      "Aarav Patel,2015-06-14,Male,5,Sunil Patel,sunil@example.com,+919800011122,IMO;NSO\n" +
      "Diya Sen,2015-09-22,Female,5,Ananya Sen,ananya@example.com,+919800033344,IEO;NCO";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "olympiadhub_student_bulk_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  handleCsvUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('school-csv-status');
    if (statusEl) {
      statusEl.classList.remove('hidden');
      statusEl.className = 'mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold';
      statusEl.innerHTML = `✅ Successfully parsed and enrolled <strong>28 students</strong> from "${file.name}". Unique student IDs and exam access passes generated!`;
    }
    if (window.OlympiadApp) {
      window.OlympiadApp.showToast(`Batch registration complete: 28 students added!`, 'success');
    }
  }

  // ================= PAYMENT CHECKOUT SIMULATOR =================
  openCheckoutModal(olympiadId) {
    const o = window.OlympiadDB.getOlympiadById(olympiadId) || window.OlympiadDB.getOlympiads()[0];
    this.currentCheckoutOlympiad = o;

    const modal = document.getElementById('checkout-modal');
    const container = document.getElementById('checkout-modal-content');
    if (!modal || !container) return;

    container.innerHTML = `
      <div class="space-y-5">
        <div class="border-b border-slate-200 pb-4">
          <span class="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded uppercase">Secure Checkout</span>
          <h2 class="text-xl font-bold text-slate-900 mt-2">${o.name}</h2>
          <p class="text-xs text-slate-500">Official Olympiad Examination Registration (2026-2027)</p>
        </div>

        <!-- Price Breakdown -->
        <div class="bg-slate-50 p-4 rounded-xl space-y-2 text-xs sm:text-sm">
          <div class="flex justify-between text-slate-600">
            <span>Examination & Proctored Seat Fee</span>
            <span class="font-semibold text-slate-900">$${o.fee || 250}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Study Material & 5 Mock Papers</span>
            <span class="text-emerald-600 font-semibold">FREE ($40 Value)</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>GST / Processing Tax (18%)</span>
            <span class="font-semibold text-slate-900">$0.00 (Waived)</span>
          </div>
          <div class="border-t border-slate-200 pt-2 flex justify-between text-base font-extrabold text-slate-900">
            <span>Total Payable Amount</span>
            <span class="text-blue-900">$${o.fee || 250}</span>
          </div>
        </div>

        <!-- Student details check -->
        <div class="space-y-3 text-xs">
          <label class="block font-bold text-slate-700">Participating Candidate Name</label>
          <input type="text" id="checkout-candidate-name" value="Advik Sharma" class="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 font-medium" />
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Class</label>
              <select id="checkout-candidate-class" class="w-full p-2.5 rounded-lg border border-slate-300 font-medium bg-white">
                <option value="5" selected>Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Payment Method</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 font-medium bg-white">
                <option>UPI / QR Instant Pay</option>
                <option>Credit / Debit Card</option>
                <option>Net Banking</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Pay Action Button -->
        <div class="pt-3">
          <button onclick="window.OlympiadPortals.processPayment()" class="w-full py-3 rounded-xl btn-teal font-bold text-sm text-white shadow-lg flex items-center justify-center space-x-2">
            <i data-lucide="lock" class="w-4 h-4"></i>
            <span>Pay $${o.fee || 250} & Confirm Registration</span>
          </button>
          <p class="text-[11px] text-center text-slate-400 mt-2">🔒 256-bit Encrypted Academic Payment Gateway</p>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('hidden');
  }

  processPayment() {
    const o = this.currentCheckoutOlympiad;
    const nameInput = document.getElementById('checkout-candidate-name');
    const classInput = document.getElementById('checkout-candidate-class');
    
    const candidateName = nameInput ? nameInput.value : 'Advik Sharma';
    const candidateClass = classInput ? classInput.value : '5';

    const newReg = {
      id: 'REG-' + Math.floor(10000 + Math.random() * 90000),
      orderId: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      studentId: window.OlympiadApp?.currentUser?.studentId || 'OH-2026-9042',
      studentName: candidateName,
      olympiadId: o.id,
      olympiadName: o.name,
      class: candidateClass,
      subject: o.subject,
      amount: o.fee || 250,
      paymentMethod: 'Instant Gateway Verified',
      paymentStatus: 'Paid',
      registeredAt: new Date().toISOString(),
      examStatus: 'Scheduled'
    };

    window.OlympiadDB.addRegistration(newReg);
    this.closeCheckoutModal();

    if (window.OlympiadApp) {
      window.OlympiadApp.showToast(`Registration Successful! Order ID: ${newReg.orderId}`, 'success');
      window.OlympiadApp.showStudentPortal();
    }
  }
}

window.OlympiadPortals = new PortalsEngine();
