import React from 'react';

/**
 * PrepResourceGraphic renders rich, vibrant educational vector graphics for Exam Preparation cards:
 * 1. Sample Paper
 * 2. Previous Paper
 * 3. Test Generator
 * 4. Mock Test
 * 5. Live Online Class
 * 6. Revision
 * 7. Free Quiz
 * 
 * Strict palette: Rich Plum, Terracotta/Coral, Golden Yellow, Warm Lavender, Warm Ivory. ZERO blue, ZERO green.
 */
export const PrepResourceGraphic = ({ type, className = "w-full h-24" }) => {
  switch (type) {
    // 1. SAMPLE PAPER
    case 'sample-paper':
    case 'papers':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="70" r="55" fill="#edd6ed" opacity="0.6" />
            
            {/* Back Paper Sheet */}
            <g transform="translate(45, 12)">
              <rect x="0" y="0" width="76" height="102" rx="6" fill="#f4ebf4" stroke="#8c4e8b" strokeWidth="1.8" />
              <line x1="12" y1="20" x2="64" y2="20" stroke="#deb8de" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="32" x2="64" y2="32" stroke="#deb8de" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="44" x2="64" y2="44" stroke="#deb8de" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Front Paper Sheet */}
            <g transform="translate(60, 20)">
              <rect x="0" y="0" width="80" height="105" rx="6" fill="#ffffff" stroke="#6d3a68" strokeWidth="2.2" />
              <rect x="10" y="10" width="40" height="7" rx="3" fill="#6d3a68" />
              <circle cx="64" cy="14" r="6" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.5" />
              <text x="64" y="17" textAnchor="middle" fill="#d9775b" fontSize="7" fontWeight="bold">100</text>
              
              <rect x="10" y="26" width="9" height="9" rx="2" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.5" />
              <path d="M12 30 L14.5 32.5 L17.5 28" stroke="#d9775b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="24" y1="31" x2="68" y2="31" stroke="#6d3a68" strokeWidth="2.5" strokeLinecap="round" />

              <rect x="10" y="42" width="9" height="9" rx="2" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.5" />
              <path d="M12 46 L14.5 48.5 L17.5 44" stroke="#e7b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="24" y1="47" x2="62" y2="47" stroke="#6d3a68" strokeWidth="2.5" strokeLinecap="round" />

              <rect x="10" y="58" width="9" height="9" rx="2" fill="#faf5fa" stroke="#8c4e8b" strokeWidth="1.5" />
              <path d="M12 62 L14.5 64.5 L17.5 60" stroke="#8c4e8b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="24" y1="63" x2="66" y2="63" stroke="#6d3a68" strokeWidth="2.5" strokeLinecap="round" />

              <circle cx="56" cy="84" r="14" fill="#fdf6f4" stroke="#d9775b" strokeWidth="2" />
              <circle cx="56" cy="84" r="11" fill="#d9775b" />
              <text x="56" y="88" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">A+</text>
            </g>

            {/* Pencil */}
            <g transform="translate(22, 65) rotate(-40)">
              <rect x="0" y="0" width="10" height="48" rx="2" fill="#e7b84b" stroke="#4e2a4a" strokeWidth="1.5" />
              <rect x="0" y="40" width="10" height="8" rx="1" fill="#d9775b" />
              <polygon points="0,0 10,0 5,-10" fill="#fde8e4" stroke="#4e2a4a" strokeWidth="1.5" />
              <polygon points="3,-5 7,-5 5,-10" fill="#4e2a4a" />
            </g>
          </svg>
        </div>
      );

    // 2. PREVIOUS PAPER
    case 'previous-paper':
    case 'previous':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="70" r="55" fill="#f7cfc6" opacity="0.6" />

            {/* Clock Archive */}
            <g transform="translate(18, 14)">
              <circle cx="16" cy="16" r="15" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <circle cx="16" cy="16" r="2" fill="#6d3a68" />
              <line x1="16" y1="16" x2="16" y2="8" stroke="#6d3a68" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="16" x2="23" y2="16" stroke="#d9775b" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Laptop with Past Papers */}
            <g transform="translate(42, 22)">
              <rect x="10" y="6" width="86" height="56" rx="5" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="2" />
              <rect x="14" y="10" width="78" height="48" rx="3" fill="#ffffff" />
              
              <rect x="36" y="15" width="34" height="38" rx="3" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.5" />
              <rect x="40" y="20" width="26" height="4" rx="2" fill="#d9775b" />
              <line x1="40" y1="28" x2="66" y2="28" stroke="#deb8de" strokeWidth="2" strokeLinecap="round" />
              <line x1="40" y1="34" x2="66" y2="34" stroke="#deb8de" strokeWidth="2" strokeLinecap="round" />
              <line x1="40" y1="40" x2="58" y2="40" stroke="#deb8de" strokeWidth="2" strokeLinecap="round" />
              
              <rect x="17" y="15" width="16" height="8" rx="2" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.2" />
              <text x="25" y="21" textAnchor="middle" fill="#906223" fontSize="5.5" fontWeight="900">2026</text>

              <rect x="17" y="26" width="16" height="8" rx="2" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.2" />
              <text x="25" y="32" textAnchor="middle" fill="#d9775b" fontSize="5.5" fontWeight="900">2025</text>

              <rect x="17" y="37" width="16" height="8" rx="2" fill="#faf5fa" stroke="#8c4e8b" strokeWidth="1.2" />
              <text x="25" y="43" textAnchor="middle" fill="#8c4e8b" fontSize="5.5" fontWeight="900">2024</text>

              <polygon points="0,64 106,64 96,72 10,72" fill="#edd6ed" stroke="#4e2a4a" strokeWidth="1.8" />
              <rect x="44" y="64" width="18" height="3" rx="1.5" fill="#6d3a68" />
            </g>

            {/* Earth Globe */}
            <g transform="translate(138, 64)">
              <circle cx="16" cy="16" r="14" fill="#faf4e0" stroke="#6d3a68" strokeWidth="1.8" />
              <ellipse cx="16" cy="16" rx="6" ry="14" stroke="#d9775b" strokeWidth="1.5" />
              <line x1="2" y1="16" x2="30" y2="16" stroke="#d9775b" strokeWidth="1.5" />
              <line x1="16" y1="2" x2="16" y2="30" stroke="#6d3a68" strokeWidth="1.5" />
            </g>
            <line x1="15" y1="102" x2="175" y2="102" stroke="#d9775b" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
      );

    // 3. TEST GENERATOR
    case 'test-generator':
    case 'generator':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="70" r="55" fill="#fde5aa" opacity="0.6" />

            {/* Machine/Gear Base Platform */}
            <g transform="translate(40, 16)">
              {/* Central Question Paper Board */}
              <rect x="16" y="8" width="80" height="96" rx="6" fill="#ffffff" stroke="#6d3a68" strokeWidth="2" />
              
              {/* Header with smart AI badge */}
              <rect x="24" y="16" width="46" height="8" rx="4" fill="#6d3a68" />
              <text x="47" y="22.5" textAnchor="middle" fill="#faf4e0" fontSize="5.5" fontWeight="900" letterSpacing="0.5">AUTO GENERATE</text>

              {/* Sliders / Controls */}
              <rect x="24" y="32" width="64" height="4" rx="2" fill="#edd6ed" />
              <circle cx="48" cy="34" r="5" fill="#d9775b" stroke="#ffffff" strokeWidth="1.5" />

              <rect x="24" y="44" width="64" height="4" rx="2" fill="#f5e7bf" />
              <circle cx="68" cy="46" r="5" fill="#e7b84b" stroke="#ffffff" strokeWidth="1.5" />

              <rect x="24" y="56" width="64" height="4" rx="2" fill="#edd6ed" />
              <circle cx="36" cy="58" r="5" fill="#8c4e8b" stroke="#ffffff" strokeWidth="1.5" />

              {/* Generating Question Cards */}
              <rect x="24" y="68" width="64" height="26" rx="3" fill="#faf5fa" stroke="#d4aed5" strokeWidth="1.2" />
              <line x1="30" y1="76" x2="68" y2="76" stroke="#6d3a68" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="84" x2="56" y2="84" stroke="#d9775b" strokeWidth="2" strokeLinecap="round" />
              <circle cx="78" cy="81" r="5" fill="#e7b84b" />
              <text x="78" y="83.5" textAnchor="middle" fill="#4e2a4a" fontSize="6" fontWeight="bold">⚡</text>
            </g>

            {/* Smart Gear on Left */}
            <g transform="translate(18, 52)">
              <circle cx="16" cy="16" r="14" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <circle cx="16" cy="16" r="5" fill="#d9775b" />
              <line x1="16" y1="0" x2="16" y2="32" stroke="#e7b84b" strokeWidth="3" />
              <line x1="0" y1="16" x2="32" y2="16" stroke="#e7b84b" strokeWidth="3" />
            </g>

            {/* Magic Wand / Sparkle on Right */}
            <g transform="translate(136, 20)">
              <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" fill="#d9775b" />
              <polygon points="26,26 28,31 34,32 28,34 26,40 24,34 18,32 24,31" fill="#e7b84b" />
            </g>
          </svg>
        </div>
      );

    // 4. MOCK TEST
    case 'mock-test':
    case 'mock':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="70" r="55" fill="#fce4e0" opacity="0.6" />

            {/* Big Stopwatch Timer */}
            <g transform="translate(16, 16)">
              <circle cx="18" cy="22" r="16" fill="#faf4e0" stroke="#d9775b" strokeWidth="2.2" />
              <rect x="16" y="2" width="4" height="6" rx="1" fill="#6d3a68" />
              <line x1="18" y1="22" x2="18" y2="12" stroke="#6d3a68" strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="22" x2="26" y2="22" stroke="#d9775b" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Computer Display Exam Mock Test */}
            <g transform="translate(48, 18)">
              <rect x="6" y="8" width="88" height="64" rx="6" fill="#4e2a4a" stroke="#4e2a4a" strokeWidth="2" />
              <rect x="10" y="12" width="80" height="56" rx="4" fill="#ffffff" />
              
              {/* Test Header Bar with Countdown Timer */}
              <rect x="14" y="16" width="72" height="12" rx="3" fill="#fdf6f4" stroke="#edd6ed" strokeWidth="1" />
              <text x="20" y="24.5" fill="#6d3a68" fontSize="6.5" fontWeight="900">Q 14/50</text>
              <rect x="52" y="19" width="30" height="7" rx="2" fill="#d9775b" />
              <text x="67" y="24.5" textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="900">⏱ 00:45:00</text>

              {/* Mock Test Options Matrix */}
              <rect x="14" y="32" width="72" height="8" rx="2" fill="#faf5fa" stroke="#8c4e8b" strokeWidth="1" />
              <circle cx="20" cy="36" r="2.5" fill="#6d3a68" />
              <line x1="26" y1="36" x2="78" y2="36" stroke="#6d3a68" strokeWidth="2" strokeLinecap="round" />

              <rect x="14" y="44" width="72" height="8" rx="2" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1" />
              <circle cx="20" cy="48" r="2.5" fill="#e7b84b" />
              <line x1="26" y1="48" x2="68" y2="48" stroke="#906223" strokeWidth="2" strokeLinecap="round" />

              <rect x="14" y="56" width="72" height="8" rx="2" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1" />
              <circle cx="20" cy="60" r="2.5" fill="#d9775b" />
              <line x1="26" y1="60" x2="72" y2="60" stroke="#a74a32" strokeWidth="2" strokeLinecap="round" />

              {/* Stand */}
              <polygon points="0,78 100,78 92,86 8,86" fill="#edd6ed" stroke="#4e2a4a" strokeWidth="1.8" />
            </g>

            {/* Score Star Award */}
            <g transform="translate(142, 14)">
              <circle cx="16" cy="16" r="14" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <polygon points="16,6 19,12 26,13 21,18 22,25 16,21 10,25 11,18 6,13 13,12" fill="#e7b84b" />
            </g>
          </svg>
        </div>
      );

    // 5. LIVE ONLINE CLASS
    case 'live-class':
    case 'live':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="70" r="55" fill="#ebd4eb" opacity="0.6" />

            <g transform="translate(42, 18)">
              {/* Graduation Cap */}
              <g transform="translate(8, -12)">
                <polygon points="28,0 54,12 28,24 2,12" fill="#d9775b" stroke="#4e2a4a" strokeWidth="1.8" />
                <path d="M14 18 V26 C14 32 42 32 42 26 V18" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="1.5" />
                <line x1="54" y1="12" x2="58" y2="25" stroke="#e7b84b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="58" cy="25" r="2.5" fill="#e7b84b" />
              </g>

              {/* Laptop Screen */}
              <rect x="10" y="14" width="86" height="58" rx="5" fill="#4e2a4a" stroke="#4e2a4a" strokeWidth="2" />
              <rect x="14" y="18" width="78" height="50" rx="3" fill="#ffffff" />
              
              {/* Video Canvas */}
              <rect x="20" y="24" width="66" height="38" rx="4" fill="#fdf6f4" stroke="#f7d7cc" strokeWidth="1.5" />
              
              {/* Play Button */}
              <circle cx="53" cy="43" r="12" fill="#d9775b" stroke="#ffffff" strokeWidth="2" />
              <polygon points="50,37 50,49 60,43" fill="#ffffff" />
              
              {/* LIVE Badge */}
              <rect x="23" y="27" width="20" height="6.5" rx="2" fill="#d9775b" />
              <circle cx="27" cy="30.2" r="1.5" fill="#ffffff" />
              <text x="35" y="32" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="900">LIVE</text>

              <polygon points="0,72 106,72 96,80 10,80" fill="#edd6ed" stroke="#4e2a4a" strokeWidth="1.8" />
              <rect x="44" y="72" width="18" height="3" rx="1.5" fill="#6d3a68" />
            </g>

            <g transform="translate(148, 12)">
              <polygon points="8,0 10,6 16,8 10,10 8,16 6,10 0,8 6,6" fill="#e7b84b" />
            </g>
          </svg>
        </div>
      );

    // 6. REVISION
    case 'revision':
    case 'workbooks':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="70" r="55" fill="#fae6b2" opacity="0.6" />

            {/* Quick Revision Notebook Stack with Bookmark */}
            <g transform="translate(48, 18)">
              {/* Book Base */}
              <rect x="8" y="10" width="76" height="96" rx="6" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="2" />
              <rect x="14" y="10" width="70" height="96" rx="4" fill="#ffffff" />

              {/* Bookmark Ribbon */}
              <polygon points="62,0 72,0 72,30 67,24 62,30" fill="#d9775b" />

              {/* Notebook Header */}
              <rect x="22" y="20" width="34" height="6" rx="3" fill="#e7b84b" />
              <text x="39" y="25" textAnchor="middle" fill="#4e2a4a" fontSize="5.5" fontWeight="900">REVISION</text>

              {/* Key Bullet Notes & Highlighting */}
              <rect x="22" y="34" width="46" height="5" rx="2" fill="#fae6b2" />
              <line x1="22" y1="36.5" x2="58" y2="36.5" stroke="#4e2a4a" strokeWidth="1.8" strokeLinecap="round" />

              <rect x="22" y="46" width="48" height="5" rx="2" fill="#edd6ed" />
              <line x1="22" y1="48.5" x2="62" y2="48.5" stroke="#6d3a68" strokeWidth="1.8" strokeLinecap="round" />

              <rect x="22" y="58" width="40" height="5" rx="2" fill="#fce4e0" />
              <line x1="22" y1="60.5" x2="52" y2="60.5" stroke="#d9775b" strokeWidth="1.8" strokeLinecap="round" />

              {/* Formula Callout Box */}
              <rect x="22" y="70" width="54" height="24" rx="4" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.2" />
              <text x="49" y="84" textAnchor="middle" fill="#d9775b" fontSize="10" fontWeight="900">E = mc²</text>
            </g>

            {/* Highlighter Pen on Side */}
            <g transform="translate(18, 48) rotate(25)">
              <rect x="0" y="0" width="12" height="42" rx="3" fill="#e7b84b" stroke="#906223" strokeWidth="1.5" />
              <rect x="2" y="34" width="8" height="12" rx="1" fill="#faf4e0" stroke="#906223" strokeWidth="1" />
              <polygon points="3,46 9,46 7,52 5,52" fill="#e7b84b" />
            </g>
          </svg>
        </div>
      );

    // 7. FREE QUIZ
    case 'free-quiz':
    case 'quiz':
    case 'ask':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="70" r="55" fill="#fbdad2" opacity="0.6" />

            {/* Golden Trophy Cup */}
            <g transform="translate(56, 20)">
              {/* Cup Top */}
              <path d="M12 10 H64 V36 C64 50 50 62 38 62 C26 62 12 50 12 36 Z" fill="#e7b84b" stroke="#906223" strokeWidth="2.2" />
              <path d="M16 14 H60 V34 C60 46 48 56 38 56 C28 56 16 46 16 34 Z" fill="#faf4e0" opacity="0.6" />

              {/* Handles */}
              <path d="M12 18 H4 C1 18 0 28 4 36 C8 42 14 42 14 42" stroke="#e7b84b" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M64 18 H72 C75 18 76 28 72 36 C68 42 62 42 62 42" stroke="#e7b84b" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Stem & Base */}
              <rect x="34" y="62" width="8" height="18" fill="#d9775b" stroke="#a74a32" strokeWidth="1.5" />
              <polygon points="20,80 56,80 52,94 24,94" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="2" />
              <rect x="18" y="94" width="40" height="6" rx="2" fill="#4e2a4a" />

              {/* Star on Trophy */}
              <polygon points="38,24 41,31 48,32 43,37 44,44 38,40 32,44 33,37 28,32 35,31" fill="#d9775b" />
            </g>

            {/* FREE Badge floating */}
            <g transform="translate(18, 22)">
              <rect x="0" y="0" width="34" height="16" rx="4" fill="#d9775b" stroke="#ffffff" strokeWidth="1.5" />
              <text x="17" y="11.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" letterSpacing="0.5">FREE</text>
            </g>

            {/* Lightning / Sparkles */}
            <g transform="translate(138, 16)">
              <polygon points="12,0 0,14 10,14 6,26 20,10 10,10" fill="#e7b84b" stroke="#906223" strokeWidth="1" />
            </g>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
