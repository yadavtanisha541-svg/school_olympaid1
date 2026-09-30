/**
 * OlympiadHub - Online MCQ Examination & Proctored Engine
 * Handles full exam lifecycle: question navigation, palette state tracking,
 * real-time countdown timer, auto-save, auto-submit, anti-cheat detection, and submission evaluation.
 */

class ExamEngine {
  constructor() {
    this.activeExam = null;
    this.questions = [];
    this.currentIndex = 0;
    this.userAnswers = {};      // { [questionId]: 'A' | 'B' | ... }
    this.questionStates = {};   // { [questionId]: 'unvisited' | 'answered' | 'not-answered' | 'review' | 'review-answered' }
    this.timerInterval = null;
    this.timeRemainingSec = 0;
    this.totalDurationSec = 0;
    this.startTime = null;
    this.tabSwitchWarnings = 0;
    this.maxWarnings = 3;
    this.isSubmitted = false;
  }

  startExam(examConfig, questionsList) {
    this.activeExam = examConfig;
    this.questions = questionsList && questionsList.length > 0 ? questionsList : window.OlympiadDB.getQuestions();
    this.currentIndex = 0;
    this.userAnswers = {};
    this.questionStates = {};
    this.tabSwitchWarnings = 0;
    this.isSubmitted = false;
    this.startTime = new Date();

    const durationMin = examConfig.durationMinutes || 45;
    this.totalDurationSec = durationMin * 60;
    this.timeRemainingSec = this.totalDurationSec;

    // Initialize all question states
    this.questions.forEach((q, idx) => {
      this.questionStates[q.id] = idx === 0 ? 'not-answered' : 'unvisited';
    });

    this.startTimer();
    this.setupAntiCheat();
    this.renderExamInterface();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timeRemainingSec--;
      this.updateTimerDisplay();

      if (this.timeRemainingSec <= 0) {
        clearInterval(this.timerInterval);
        this.submitExam(true); // Auto submit on timeout
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const timerEl = document.getElementById('exam-timer-display');
    const timerBarEl = document.getElementById('exam-timer-progress');
    if (!timerEl) return;

    const min = Math.floor(this.timeRemainingSec / 60);
    const sec = this.timeRemainingSec % 60;
    const formatted = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    timerEl.textContent = formatted;

    if (this.timeRemainingSec <= 300) { // last 5 minutes
      timerEl.parentElement.classList.add('timer-urgent');
    } else {
      timerEl.parentElement.classList.remove('timer-urgent');
    }

    if (timerBarEl) {
      const pct = (this.timeRemainingSec / this.totalDurationSec) * 100;
      timerBarEl.style.width = `${pct}%`;
    }
  }

  setupAntiCheat() {
    const handleVisibilityChange = () => {
      if (document.hidden && !this.isSubmitted) {
        this.tabSwitchWarnings++;
        if (window.OlympiadApp) {
          window.OlympiadApp.showToast(
            `Security Notice: Tab switch detected! (Warning ${this.tabSwitchWarnings}/${this.maxWarnings})`,
            'warning'
          );
        }
        if (this.tabSwitchWarnings >= this.maxWarnings) {
          alert('Maximum tab-switch violations reached. Your examination is being auto-submitted for security review.');
          this.submitExam(true);
        }
      }
    };

    document.removeEventListener('visibilitychange', this.antiCheatHandler);
    this.antiCheatHandler = handleVisibilityChange;
    document.addEventListener('visibilitychange', this.antiCheatHandler);
  }

  selectOption(optionId) {
    const q = this.questions[this.currentIndex];
    this.userAnswers[q.id] = optionId;

    // Update palette state
    if (this.questionStates[q.id] === 'review' || this.questionStates[q.id] === 'review-answered') {
      this.questionStates[q.id] = 'review-answered';
    } else {
      this.questionStates[q.id] = 'answered';
    }

    this.renderCurrentQuestion();
    this.renderPalette();
  }

  clearAnswer() {
    const q = this.questions[this.currentIndex];
    delete this.userAnswers[q.id];

    if (this.questionStates[q.id] === 'review-answered') {
      this.questionStates[q.id] = 'review';
    } else {
      this.questionStates[q.id] = 'not-answered';
    }

    this.renderCurrentQuestion();
    this.renderPalette();
  }

  toggleMarkForReview() {
    const q = this.questions[this.currentIndex];
    const isAnswered = !!this.userAnswers[q.id];

    if (this.questionStates[q.id] === 'review' || this.questionStates[q.id] === 'review-answered') {
      this.questionStates[q.id] = isAnswered ? 'answered' : 'not-answered';
    } else {
      this.questionStates[q.id] = isAnswered ? 'review-answered' : 'review';
    }

    this.renderCurrentQuestion();
    this.renderPalette();
  }

  goToQuestion(index) {
    if (index < 0 || index >= this.questions.length) return;
    
    const prevQ = this.questions[this.currentIndex];
    if (this.questionStates[prevQ.id] === 'unvisited') {
      this.questionStates[prevQ.id] = this.userAnswers[prevQ.id] ? 'answered' : 'not-answered';
    }

    this.currentIndex = index;
    const currentQ = this.questions[this.currentIndex];
    if (this.questionStates[currentQ.id] === 'unvisited') {
      this.questionStates[currentQ.id] = 'not-answered';
    }

    this.renderCurrentQuestion();
    this.renderPalette();
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.goToQuestion(this.currentIndex + 1);
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.goToQuestion(this.currentIndex - 1);
    }
  }

  getPaletteCounts() {
    const counts = {
      answered: 0,
      notAnswered: 0,
      review: 0,
      reviewAnswered: 0,
      unvisited: 0
    };

    this.questions.forEach(q => {
      const state = this.questionStates[q.id] || 'unvisited';
      if (state === 'answered') counts.answered++;
      else if (state === 'not-answered') counts.notAnswered++;
      else if (state === 'review') counts.review++;
      else if (state === 'review-answered') counts.reviewAnswered++;
      else counts.unvisited++;
    });

    return counts;
  }

  renderExamInterface() {
    const container = document.getElementById('exam-active-view');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <span class="px-2.5 py-1 rounded bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-wider">
              ${this.activeExam.code || 'EXAM'}
            </span>
            <h1 class="text-base sm:text-lg font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
              ${this.activeExam.name || 'Olympiad Examination'}
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Timer Display -->
            <div class="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <i data-lucide="clock" class="w-4 h-4 text-blue-800"></i>
              <span class="text-xs text-slate-500 font-medium hidden sm:inline">Time Remaining:</span>
              <span id="exam-timer-display" class="font-mono text-sm sm:text-base font-bold text-slate-900">--:--</span>
            </div>

            <!-- Submit Button -->
            <button onclick="window.examEngine.openSubmitConfirmModal()" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow transition flex items-center space-x-1.5">
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span>Submit Exam</span>
            </button>
          </div>
        </div>
        <div class="w-full bg-slate-100 h-1">
          <div id="exam-timer-progress" class="bg-blue-600 h-1 transition-all duration-500" style="width: 100%;"></div>
        </div>
      </div>

      <!-- Main Examination Two-Column Area -->
      <div class="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left: Question & Options Display (8 Cols) -->
        <div class="lg:col-span-8 space-y-6">
          <div id="exam-question-card" class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-7 min-h-[420px] flex flex-col justify-between">
            <!-- Question content injected dynamically -->
          </div>

          <!-- Action Controls Bar -->
          <div class="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div class="flex items-center space-x-2">
              <button onclick="window.examEngine.prevQuestion()" id="btn-exam-prev" class="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold flex items-center space-x-1">
                <i data-lucide="chevron-left" class="w-4 h-4"></i>
                <span>Previous</span>
              </button>
              <button onclick="window.examEngine.nextQuestion()" id="btn-exam-next" class="px-4 py-2 rounded-lg btn-primary text-white text-sm font-semibold flex items-center space-x-1">
                <span>Next</span>
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="flex items-center space-x-2">
              <button onclick="window.examEngine.clearAnswer()" class="px-3 py-2 rounded-lg border border-slate-300 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs sm:text-sm font-medium transition">
                Clear Selection
              </button>
              <button onclick="window.examEngine.toggleMarkForReview()" id="btn-mark-review" class="px-3.5 py-2 rounded-lg border border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100 text-xs sm:text-sm font-semibold transition flex items-center space-x-1">
                <i data-lucide="bookmark" class="w-4 h-4"></i>
                <span id="btn-mark-review-text">Mark for Review</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Question Palette & Status Summary (4 Cols) -->
        <div class="lg:col-span-4 space-y-5">
          <!-- Status Legend -->
          <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Question Legend</h3>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="flex items-center space-x-2">
                <div class="w-3.5 h-3.5 rounded bg-emerald-600"></div>
                <span class="text-slate-600">Answered (<span id="count-answered">0</span>)</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3.5 h-3.5 rounded bg-red-600"></div>
                <span class="text-slate-600">Not Answered (<span id="count-not-answered">0</span>)</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3.5 h-3.5 rounded bg-purple-600"></div>
                <span class="text-slate-600">Marked Review (<span id="count-review">0</span>)</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-300"></div>
                <span class="text-slate-600">Not Visited (<span id="count-unvisited">0</span>)</span>
              </div>
            </div>
          </div>

          <!-- Question Number Matrix Grid -->
          <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-slate-800">Question Palette</h3>
              <span class="text-xs text-slate-500 font-medium">Class ${this.activeExam.eligibleClasses ? this.activeExam.eligibleClasses[0] : '5'}</span>
            </div>
            
            <div id="exam-palette-grid" class="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[360px] overflow-y-auto p-1">
              <!-- Grid items injected -->
            </div>
          </div>

          <!-- Exam Instructions Mini Card -->
          <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 space-y-1.5">
            <div class="flex items-center space-x-1.5 font-bold text-blue-950">
              <i data-lucide="shield-alert" class="w-4 h-4 text-blue-800"></i>
              <span>Instructions & Marking</span>
            </div>
            <p>• Each correct answer carries <strong>+${this.questions[0]?.marks || 3} marks</strong>.</p>
            <p>• Negative marking of <strong>-${this.questions[0]?.negativeMarks || 0} marks</strong> for incorrect choices.</p>
            <p>• Answers are auto-saved in real time.</p>
          </div>
        </div>
      </div>
    `;

    this.renderCurrentQuestion();
    this.renderPalette();
    if (window.lucide) window.lucide.createIcons();
  }

  renderCurrentQuestion() {
    const qCard = document.getElementById('exam-question-card');
    if (!qCard || !this.questions[this.currentIndex]) return;

    const q = this.questions[this.currentIndex];
    const selected = this.userAnswers[q.id];
    const isReview = this.questionStates[q.id] === 'review' || this.questionStates[q.id] === 'review-answered';

    qCard.innerHTML = `
      <div>
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded">
              Question ${this.currentIndex + 1} of ${this.questions.length}
            </span>
            <span class="text-xs text-slate-500 font-medium">Topic: ${q.topicName || 'General Reasoning'}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">+${q.marks} Marks</span>
            ${q.negativeMarks > 0 ? `<span class="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700">-${q.negativeMarks} Neg</span>` : ''}
          </div>
        </div>

        <div class="text-base sm:text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
          ${q.question}
        </div>

        ${q.image ? `<div class="mb-5 p-2 bg-slate-50 rounded-lg border border-slate-200 inline-block"><img src="${q.image}" alt="Question Diagram" class="max-h-48 object-contain rounded" /></div>` : ''}

        <!-- Options List -->
        <div class="space-y-3">
          ${q.options.map(opt => `
            <div onclick="window.examEngine.selectOption('${opt.id}')" class="exam-option-card rounded-xl p-3.5 sm:p-4 flex items-center space-x-3.5 ${selected === opt.id ? 'selected' : ''}">
              <div class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs sm:text-sm ${selected === opt.id ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-600 border-slate-300'}">
                ${opt.id}
              </div>
              <div class="text-sm sm:text-base font-medium text-slate-800 flex-1">
                ${opt.text}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>Question ID: ${q.id}</span>
        <span>Difficulty: <strong class="text-slate-600">${q.difficulty || 'Standard'}</strong></span>
      </div>
    `;

    // Update prev/next button states
    const prevBtn = document.getElementById('btn-exam-prev');
    const nextBtn = document.getElementById('btn-exam-next');
    if (prevBtn) prevBtn.disabled = this.currentIndex === 0;
    if (nextBtn) {
      if (this.currentIndex === this.questions.length - 1) {
        nextBtn.innerHTML = `<span>Review Final</span> <i data-lucide="check" class="w-4 h-4"></i>`;
      } else {
        nextBtn.innerHTML = `<span>Next</span> <i data-lucide="chevron-right" class="w-4 h-4"></i>`;
      }
    }

    const reviewText = document.getElementById('btn-mark-review-text');
    if (reviewText) {
      reviewText.textContent = isReview ? 'Unmark Review' : 'Mark for Review';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderPalette() {
    const grid = document.getElementById('exam-palette-grid');
    if (!grid) return;

    grid.innerHTML = this.questions.map((q, idx) => {
      const state = this.questionStates[q.id] || 'unvisited';
      const isCurrent = idx === this.currentIndex;
      return `
        <button onclick="window.examEngine.goToQuestion(${idx})" class="palette-btn ${state} ${isCurrent ? 'current' : ''}" title="Question ${idx + 1} (${state})">
          ${idx + 1}
        </button>
      `;
    }).join('');

    // Update legend counts
    const counts = this.getPaletteCounts();
    const elAns = document.getElementById('count-answered');
    const elNotAns = document.getElementById('count-not-answered');
    const elRev = document.getElementById('count-review');
    const elUnvis = document.getElementById('count-unvisited');

    if (elAns) elAns.textContent = counts.answered + counts.reviewAnswered;
    if (elNotAns) elNotAns.textContent = counts.notAnswered;
    if (elRev) elRev.textContent = counts.review;
    if (elUnvis) elUnvis.textContent = counts.unvisited;
  }

  openSubmitConfirmModal() {
    const counts = this.getPaletteCounts();
    const answeredTotal = counts.answered + counts.reviewAnswered;
    const unansweredTotal = this.questions.length - answeredTotal;

    const modal = document.getElementById('exam-confirm-modal');
    if (!modal) return;

    document.getElementById('confirm-total-q').textContent = this.questions.length;
    document.getElementById('confirm-answered-q').textContent = answeredTotal;
    document.getElementById('confirm-unanswered-q').textContent = unansweredTotal;
    document.getElementById('confirm-review-q').textContent = counts.review + counts.reviewAnswered;

    modal.classList.remove('hidden');
  }

  closeSubmitConfirmModal() {
    const modal = document.getElementById('exam-confirm-modal');
    if (modal) modal.classList.add('hidden');
  }

  submitExam(isAutoTimeout = false) {
    this.closeSubmitConfirmModal();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isSubmitted = true;

    // Evaluation Logic
    let totalMarks = 0;
    let scoredMarks = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    const topicStats = {}; // { [topicName]: { total: 0, correct: 0, marks: 0 } }
    const detailedReview = [];

    this.questions.forEach(q => {
      const selected = this.userAnswers[q.id];
      const isAttempted = !!selected;
      const isCorrect = isAttempted && selected === q.correctAnswer;
      const topic = q.topicName || 'General Aptitude';

      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, correct: 0, marksPossible: 0, marksObtained: 0 };
      }
      topicStats[topic].total++;
      topicStats[topic].marksPossible += q.marks;

      totalMarks += q.marks;

      if (!isAttempted) {
        skippedCount++;
      } else if (isCorrect) {
        correctCount++;
        scoredMarks += q.marks;
        topicStats[topic].correct++;
        topicStats[topic].marksObtained += q.marks;
      } else {
        wrongCount++;
        if (q.negativeMarks) {
          scoredMarks -= q.negativeMarks;
          topicStats[topic].marksObtained -= q.negativeMarks;
        }
      }

      detailedReview.push({
        question: q,
        selectedAnswer: selected || null,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        isAttempted: isAttempted,
        explanation: q.explanation
      });
    });

    // Ensure no negative score floor below 0
    if (scoredMarks < 0) scoredMarks = 0;

    const percentage = totalMarks > 0 ? Math.round((scoredMarks / totalMarks) * 100) : 0;
    const accuracy = (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;
    const timeSpentSec = this.totalDurationSec - this.timeRemainingSec;
    const timeTakenMin = Math.max(1, Math.round(timeSpentSec / 60));

    const resultPayload = {
      examId: this.activeExam.id,
      examName: this.activeExam.name,
      examCode: this.activeExam.code,
      studentName: window.OlympiadApp?.currentUser?.name || 'Advik Sharma',
      studentId: window.OlympiadApp?.currentUser?.studentId || 'OH-2026-9042',
      class: this.activeExam.eligibleClasses ? this.activeExam.eligibleClasses[0] : '5',
      submittedAt: new Date().toISOString(),
      totalQuestions: this.questions.length,
      attempted: correctCount + wrongCount,
      correct: correctCount,
      wrong: wrongCount,
      skipped: skippedCount,
      score: scoredMarks,
      totalMarks: totalMarks,
      percentage: percentage,
      accuracy: accuracy,
      timeTakenMinutes: timeTakenMin,
      topicPerformance: topicStats,
      detailedReview: detailedReview,
      isAutoTimeout: isAutoTimeout
    };

    // Trigger Result Analytics
    if (window.OlympiadAnalytics) {
      window.OlympiadAnalytics.displayResult(resultPayload);
    }
  }
}

// Global Exam Engine Instance
window.examEngine = new ExamEngine();
