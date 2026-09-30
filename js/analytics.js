/**
 * OlympiadHub - Result Analytics & Performance Dashboard Engine
 * Computes topic breakdowns, accuracy metrics, generates solution review modals,
 * canvas confetti celebration, and connects to Certificate generation & Leaderboards.
 */

class ResultAnalytics {
  constructor() {
    this.lastResult = null;
  }

  triggerConfetti() {
    // Canvas Confetti effect
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#0F2744', '#1E3A8A', '#0D9488', '#14B8A6', '#F59E0B', '#10B981', '#6366F1'];

    for (let i = 0; i < 100; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        speedRot: Math.random() * 4 - 2
      });
    }

    let frames = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.speedRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      if (frames < 180) {
        requestAnimationFrame(render);
      } else {
        canvas.remove();
      }
    }
    render();
  }

  displayResult(resultData) {
    this.lastResult = resultData;
    
    // Switch view to Result Screen
    if (window.OlympiadApp) {
      window.OlympiadApp.showView('result-view');
    }

    if (resultData.percentage >= 70) {
      this.triggerConfetti();
    }

    const container = document.getElementById('result-dashboard-container');
    if (!container) return;

    const topicEntries = Object.entries(resultData.topicPerformance || {});

    container.innerHTML = `
      <div class="max-w-5xl mx-auto space-y-8">
        <!-- Result Hero Banner -->
        <div class="bg-gradient-to-r from-slate-900 via-blue-900 to-teal-800 rounded-3xl text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <i data-lucide="award" class="w-72 h-72"></i>
          </div>

          <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                <span>Examination Completed Successfully</span>
              </div>
              <h1 class="text-2xl sm:text-4xl font-extrabold text-white mb-2">
                ${resultData.examName}
              </h1>
              <p class="text-slate-300 text-sm">
                Candidate: <strong class="text-white">${resultData.studentName}</strong> • Standard: <strong class="text-white">${resultData.class}</strong> • ID: <span class="font-mono text-teal-200 font-bold">${resultData.studentId}</span>
              </p>
            </div>

            <!-- Main Score Badge -->
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[190px] shadow-lg">
              <span class="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-1">Total Score</span>
              <div class="text-4xl sm:text-5xl font-extrabold text-white">
                ${resultData.score} <span class="text-xl font-medium text-slate-300">/ ${resultData.totalMarks}</span>
              </div>
              <div class="mt-2 text-xs font-semibold px-2.5 py-1 rounded-full ${resultData.percentage >= 80 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'} inline-block">
                ${resultData.percentage}% Overall Score
              </div>
            </div>
          </div>
        </div>

        <!-- 6 Key Metrics Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
            <span class="text-xs text-slate-500 font-semibold block mb-1">Total Questions</span>
            <div class="text-2xl font-bold text-slate-900">${resultData.totalQuestions}</div>
            <span class="text-[11px] text-slate-400 font-medium">All Sections</span>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
            <span class="text-xs text-slate-500 font-semibold block mb-1">Attempted</span>
            <div class="text-2xl font-bold text-blue-900">${resultData.attempted}</div>
            <span class="text-[11px] text-blue-600 font-medium">${Math.round((resultData.attempted/resultData.totalQuestions)*100)}% Rate</span>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
            <span class="text-xs text-emerald-700 font-semibold block mb-1">Correct</span>
            <div class="text-2xl font-bold text-emerald-600">${resultData.correct}</div>
            <span class="text-[11px] text-emerald-600 font-medium">+${resultData.score} Marks</span>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
            <span class="text-xs text-red-700 font-semibold block mb-1">Incorrect</span>
            <div class="text-2xl font-bold text-red-600">${resultData.wrong}</div>
            <span class="text-[11px] text-red-500 font-medium">${resultData.wrong > 0 ? 'Needs Review' : 'Zero Errors!'}</span>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
            <span class="text-xs text-slate-500 font-semibold block mb-1">Accuracy</span>
            <div class="text-2xl font-bold text-teal-600">${resultData.accuracy}%</div>
            <span class="text-[11px] text-teal-700 font-medium">Precision</span>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
            <span class="text-xs text-slate-500 font-semibold block mb-1">Time Taken</span>
            <div class="text-2xl font-bold text-slate-800">${resultData.timeTakenMinutes}m</div>
            <span class="text-[11px] text-slate-400 font-medium">Total Duration</span>
          </div>
        </div>

        <!-- Topic Breakdown & Solution Review Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Left: Topic-Wise Performance (5 cols) -->
          <div class="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-slate-900">Topic-Wise Mastery</h2>
              <span class="text-xs text-slate-500 font-medium">Diagnostic Breakdown</span>
            </div>

            <div class="space-y-4">
              ${topicEntries.length > 0 ? topicEntries.map(([topicName, stat]) => {
                const topicPct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                return `
                  <div>
                    <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span>${topicName}</span>
                      <span class="${topicPct >= 75 ? 'text-emerald-600' : topicPct >= 50 ? 'text-amber-600' : 'text-red-500'} font-bold">${topicPct}%</span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div class="h-2.5 rounded-full transition-all duration-700 ${topicPct >= 75 ? 'bg-emerald-500' : topicPct >= 50 ? 'bg-amber-500' : 'bg-red-500'}" style="width: ${topicPct}%;"></div>
                    </div>
                    <div class="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>${stat.correct} of ${stat.total} Correct</span>
                      <span>${stat.marksObtained} / ${stat.marksPossible} Marks</span>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div class="text-sm text-slate-500">Topic data consolidated under General Syllabus.</div>
              `}
            </div>

            <div class="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <span class="font-bold text-blue-950 block mb-0.5">💡 Academic Diagnostic Advice:</span>
              High competence shown in logical pattern synthesis. Reinforce speed calculations in Geometry to secure top National Rank medals.
            </div>
          </div>

          <!-- Right: Action Commands & Detailed Solution Review Launch (7 cols) -->
          <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <h2 class="text-lg font-bold text-slate-900 mb-2">Next Steps & Certifications</h2>
              <p class="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Your performance qualifies you for the official authenticated Certificate of Achievement and national placement.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                <button onclick="window.OlympiadAnalytics.openSolutionsModal()" class="w-full px-4 py-3.5 rounded-2xl border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-sm">
                  <i data-lucide="file-check" class="w-4 h-4"></i>
                  <span>View Full Solutions & Key</span>
                </button>

                <button onclick="window.OlympiadCertificate.generateForAttempt(window.OlympiadAnalytics.lastResult)" class="w-full px-4 py-3.5 rounded-2xl btn-teal font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 text-white shadow-lg">
                  <i data-lucide="award" class="w-4 h-4"></i>
                  <span>Claim / View Certificate</span>
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onclick="window.OlympiadApp.showView('leaderboard-view')" class="w-full px-4 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center justify-center space-x-2">
                  <i data-lucide="trophy" class="w-4 h-4 text-amber-500"></i>
                  <span>Check National Rank</span>
                </button>

                <button onclick="window.OlympiadApp.showView('student-portal-view')" class="w-full px-4 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center justify-center space-x-2">
                  <i data-lucide="layout-dashboard" class="w-4 h-4 text-blue-600"></i>
                  <span>Back to Student Dashboard</span>
                </button>
              </div>
            </div>

            <div class="text-center border-t border-slate-100 pt-4 text-xs text-slate-400">
              Examination Result ID: <span class="font-mono text-slate-600">${resultData.examId}-${Date.now().toString().slice(-6)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  openSolutionsModal() {
    if (!this.lastResult || !this.lastResult.detailedReview) return;

    const modal = document.getElementById('solutions-review-modal');
    const content = document.getElementById('solutions-review-content');
    if (!modal || !content) return;

    content.innerHTML = this.lastResult.detailedReview.map((item, idx) => {
      const q = item.question;
      const statusBadge = item.isCorrect 
        ? `<span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1"><i data-lucide="check" class="w-3 h-3"></i><span>Correct (+${q.marks})</span></span>`
        : !item.isAttempted 
        ? `<span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Skipped (0 Marks)</span>`
        : `<span class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold flex items-center space-x-1"><i data-lucide="x" class="w-3 h-3"></i><span>Incorrect (-${q.negativeMarks || 0})</span></span>`;

      return `
        <div class="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 text-sm">Question ${idx + 1}</span>
            ${statusBadge}
          </div>
          
          <div class="text-sm font-semibold text-slate-800 leading-relaxed">
            ${q.question}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            ${q.options.map(opt => {
              const isCorrectOpt = opt.id === item.correctAnswer;
              const isUserOpt = opt.id === item.selectedAnswer;
              let borderClass = 'border-slate-200 bg-slate-50';
              if (isCorrectOpt) borderClass = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
              else if (isUserOpt && !isCorrectOpt) borderClass = 'border-red-400 bg-red-50 text-red-950';

              return `
                <div class="p-3 rounded-xl border ${borderClass} flex items-center justify-between">
                  <span><strong>${opt.id}.</strong> ${opt.text}</span>
                  ${isCorrectOpt ? '<span class="text-[10px] text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">Correct Answer</span>' : ''}
                  ${isUserOpt && !isCorrectOpt ? '<span class="text-[10px] text-red-700 font-bold bg-white px-1.5 py-0.5 rounded border border-red-300">Your Choice</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>

          <div class="bg-blue-50/70 rounded-xl p-3.5 border border-blue-100 text-xs text-blue-950 space-y-1">
            <span class="font-bold text-blue-900 block">Step-by-step Solution:</span>
            <p class="leading-relaxed">${item.explanation || 'Refer to standard Olympiad handbook principle.'}</p>
          </div>
        </div>
      `;
    }).join('');

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeSolutionsModal() {
    const modal = document.getElementById('solutions-review-modal');
    if (modal) modal.classList.add('hidden');
  }
}

window.OlympiadAnalytics = new ResultAnalytics();
