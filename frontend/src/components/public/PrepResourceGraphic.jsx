import React from 'react';

/**
 * PrepResourceGraphic renders rich, vibrant educational vector graphics for the 5 Exam Preparation cards:
 * 1. Workbooks
 * 2. Additional Practice Papers
 * 3. Ask and Answer
 * 4. Previous Year Papers
 * 5. Live Classes
 * 
 * Strict palette: Rich Plum, Terracotta/Coral, Golden Yellow, Warm Lavender, Warm Ivory. ZERO blue, ZERO green.
 */
export const PrepResourceGraphic = ({ type, className = "w-full h-32" }) => {
  switch (type) {
    case 'workbooks':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soft Glow */}
            <circle cx="95" cy="70" r="55" fill="#fbdad2" opacity="0.6" />

            {/* Fan of 4 rich colorful workbooks */}
            {/* Book 1 (Leftmost - Deep Plum) */}
            <g transform="translate(15, 24) rotate(-16)">
              <rect x="0" y="0" width="52" height="82" rx="4" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="1.5" />
              <rect x="4" y="4" width="44" height="74" rx="3" fill="#ffffff" />
              <rect x="4" y="4" width="44" height="24" rx="3" fill="#6d3a68" />
              <text x="26" y="20" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" letterSpacing="0.5">MATH</text>
              <circle cx="26" cy="46" r="12" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.5" />
              <text x="26" y="50" textAnchor="middle" fill="#d9775b" fontSize="12" fontWeight="bold">∑</text>
              <rect x="8" y="66" width="36" height="4" rx="2" fill="#edd6ed" />
            </g>

            {/* Book 2 (Middle Left - Vibrant Terracotta / Coral) */}
            <g transform="translate(48, 14) rotate(-6)">
              <rect x="0" y="0" width="52" height="82" rx="4" fill="#d9775b" stroke="#a74a32" strokeWidth="1.5" />
              <rect x="4" y="4" width="44" height="74" rx="3" fill="#ffffff" />
              <rect x="4" y="4" width="44" height="24" rx="3" fill="#d9775b" />
              <text x="26" y="20" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" letterSpacing="0.5">SCIENCE</text>
              <circle cx="26" cy="46" r="12" fill="#faf5fa" stroke="#6d3a68" strokeWidth="1.5" />
              <text x="26" y="50" textAnchor="middle" fill="#6d3a68" fontSize="11" fontWeight="bold">⚛</text>
              <rect x="8" y="66" width="36" height="4" rx="2" fill="#f7d7cc" />
            </g>

            {/* Book 3 (Middle Right - Sun Gold) */}
            <g transform="translate(86, 14) rotate(7)">
              <rect x="0" y="0" width="52" height="82" rx="4" fill="#e7b84b" stroke="#906223" strokeWidth="1.5" />
              <rect x="4" y="4" width="44" height="74" rx="3" fill="#ffffff" />
              <rect x="4" y="4" width="44" height="24" rx="3" fill="#e7b84b" />
              <text x="26" y="20" textAnchor="middle" fill="#4e2a4a" fontSize="9" fontWeight="900" letterSpacing="0.5">ENGLISH</text>
              <circle cx="26" cy="46" r="12" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.5" />
              <text x="26" y="50" textAnchor="middle" fill="#d9775b" fontSize="10" fontWeight="900">Aa</text>
              <rect x="8" y="66" width="36" height="4" rx="2" fill="#f5e7bf" />
            </g>

            {/* Book 4 (Rightmost - Rich Violet/Magenta) */}
            <g transform="translate(122, 24) rotate(18)">
              <rect x="0" y="0" width="52" height="82" rx="4" fill="#8c4e8b" stroke="#5c3158" strokeWidth="1.5" />
              <rect x="4" y="4" width="44" height="74" rx="3" fill="#ffffff" />
              <rect x="4" y="4" width="44" height="24" rx="3" fill="#8c4e8b" />
              <text x="26" y="20" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" letterSpacing="0.5">CYBER</text>
              <circle cx="26" cy="46" r="12" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.5" />
              <text x="26" y="50" textAnchor="middle" fill="#906223" fontSize="9" fontWeight="bold">AI</text>
              <rect x="8" y="66" width="36" height="4" rx="2" fill="#edd6ed" />
            </g>

            {/* Golden Star Badge floating on top */}
            <g transform="translate(142, 8) scale(0.9)">
              <circle cx="16" cy="16" r="14" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <polygon points="16,6 19,12 26,13 21,18 22,25 16,21 10,25 11,18 6,13 13,12" fill="#e7b84b" stroke="#d9775b" strokeWidth="1" />
            </g>
          </svg>
        </div>
      );

    case 'papers':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soft Glow */}
            <circle cx="95" cy="70" r="55" fill="#edd6ed" opacity="0.6" />

            {/* Back Paper Sheet (Lilac) */}
            <g transform="translate(45, 12)">
              <rect x="0" y="0" width="76" height="102" rx="6" fill="#f4ebf4" stroke="#8c4e8b" strokeWidth="1.8" />
              <line x1="12" y1="20" x2="64" y2="20" stroke="#deb8de" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="32" x2="64" y2="32" stroke="#deb8de" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="44" x2="64" y2="44" stroke="#deb8de" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Front Paper Sheet with Colorful Highlights */}
            <g transform="translate(60, 20)">
              <rect x="0" y="0" width="80" height="105" rx="6" fill="#ffffff" stroke="#6d3a68" strokeWidth="2.2" />
              
              {/* Top Banner Stripe */}
              <rect x="10" y="10" width="40" height="7" rx="3" fill="#6d3a68" />
              <circle cx="64" cy="14" r="6" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.5" />
              <text x="64" y="17" textAnchor="middle" fill="#d9775b" fontSize="7" fontWeight="bold">100</text>
              
              {/* Question 1 with Orange Checkbox */}
              <rect x="10" y="26" width="9" height="9" rx="2" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.5" />
              <path d="M12 30 L14.5 32.5 L17.5 28" stroke="#d9775b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="24" y1="31" x2="68" y2="31" stroke="#6d3a68" strokeWidth="2.5" strokeLinecap="round" />

              {/* Question 2 with Gold Checkbox */}
              <rect x="10" y="42" width="9" height="9" rx="2" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.5" />
              <path d="M12 46 L14.5 48.5 L17.5 44" stroke="#e7b84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="24" y1="47" x2="62" y2="47" stroke="#6d3a68" strokeWidth="2.5" strokeLinecap="round" />

              {/* Question 3 with Plum Checkbox */}
              <rect x="10" y="58" width="9" height="9" rx="2" fill="#faf5fa" stroke="#8c4e8b" strokeWidth="1.5" />
              <path d="M12 62 L14.5 64.5 L17.5 60" stroke="#8c4e8b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="24" y1="63" x2="66" y2="63" stroke="#6d3a68" strokeWidth="2.5" strokeLinecap="round" />

              {/* Score Badge A+ in Terracotta Stamp */}
              <circle cx="56" cy="84" r="14" fill="#fdf6f4" stroke="#d9775b" strokeWidth="2" />
              <circle cx="56" cy="84" r="11" fill="#d9775b" />
              <text x="56" y="88" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">A+</text>
            </g>

            {/* Big Yellow Wooden Pencil */}
            <g transform="translate(22, 65) rotate(-40)">
              <rect x="0" y="0" width="10" height="48" rx="2" fill="#e7b84b" stroke="#4e2a4a" strokeWidth="1.5" />
              <rect x="0" y="40" width="10" height="8" rx="1" fill="#d9775b" />
              <polygon points="0,0 10,0 5,-10" fill="#fde8e4" stroke="#4e2a4a" strokeWidth="1.5" />
              <polygon points="3,-5 7,-5 5,-10" fill="#4e2a4a" />
            </g>
          </svg>
        </div>
      );

    case 'ask':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soft Warm Glow */}
            <circle cx="95" cy="70" r="55" fill="#fde5aa" opacity="0.6" />

            {/* Open Book Stand with Colorful Pages */}
            <g transform="translate(48, 80)">
              <polygon points="0,32 48,18 96,32 96,44 48,28 0,44" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="1.5" />
              <polygon points="4,30 48,17 48,27 4,40" fill="#ffffff" />
              <polygon points="48,17 92,30 92,40 48,27" fill="#faf4e0" />
              <line x1="12" y1="30" x2="42" y2="24" stroke="#edd6ed" strokeWidth="1.5" />
              <line x1="54" y1="24" x2="84" y2="30" stroke="#f5e7bf" strokeWidth="1.5" />
            </g>

            {/* Juicy Red Apple */}
            <g transform="translate(32, 88)">
              <path d="M14 9 C9 4 3 9 3 16 C3 25 14 32 14 32 C14 32 25 25 25 16 C25 9 19 4 14 9 Z" fill="#d9775b" stroke="#a74a32" strokeWidth="1.8" />
              <path d="M14 9 Q16 2 20 0" stroke="#6d3a68" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="21" cy="4" rx="4" ry="2" fill="#e7b84b" transform="rotate(-30 21 4)" />
            </g>

            {/* Cute Wise Study Owl Character */}
            <g transform="translate(64, 16)">
              {/* Owl Body in Honey Gold */}
              <ellipse cx="32" cy="42" rx="30" ry="32" fill="#e7b84b" stroke="#906223" strokeWidth="2.2" />
              <ellipse cx="32" cy="45" rx="20" ry="22" fill="#faf4e0" />
              
              {/* Owl Ears (Terracotta) */}
              <polygon points="10,16 22,26 10,28" fill="#d9775b" stroke="#4e2a4a" strokeWidth="1.5" />
              <polygon points="54,16 42,26 54,28" fill="#d9775b" stroke="#4e2a4a" strokeWidth="1.5" />
              
              {/* Big Dark Plum Spectacles */}
              <circle cx="19" cy="36" r="13" fill="#ffffff" stroke="#6d3a68" strokeWidth="2.5" />
              <circle cx="45" cy="36" r="13" fill="#ffffff" stroke="#6d3a68" strokeWidth="2.5" />
              <line x1="32" y1="36" x2="32" y2="36" stroke="#6d3a68" strokeWidth="3" />
              
              {/* Expressive Eyes */}
              <circle cx="20" cy="36" r="5.5" fill="#4e2a4a" />
              <circle cx="18" cy="33.5" r="2" fill="#ffffff" />
              <circle cx="44" cy="36" r="5.5" fill="#4e2a4a" />
              <circle cx="42" cy="33.5" r="2" fill="#ffffff" />

              {/* Bright Orange Beak */}
              <polygon points="28,42 36,42 32,50" fill="#d9775b" stroke="#a74a32" strokeWidth="1" />

              {/* Feather Chest Patterns */}
              <path d="M25 58 Q32 63 39 58" stroke="#d9775b" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M27 65 Q32 70 37 65" stroke="#d9775b" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>

            {/* Glowing Lightbulb of Knowledge on Top */}
            <g transform="translate(138, 14) scale(0.85)">
              <circle cx="16" cy="14" r="12" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <path d="M12 24 H20" stroke="#6d3a68" strokeWidth="2" strokeLinecap="round" />
              <text x="16" y="19" textAnchor="middle" fill="#d9775b" fontSize="13" fontWeight="900">?</text>
              <line x1="16" y1="0" x2="16" y2="-4" stroke="#e7b84b" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="4" x2="31" y2="1" stroke="#e7b84b" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    case 'previous':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soft Glow */}
            <circle cx="95" cy="70" r="55" fill="#f7cfc6" opacity="0.6" />

            {/* Archive Clock with Gold Ring */}
            <g transform="translate(18, 14)">
              <circle cx="16" cy="16" r="15" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <circle cx="16" cy="16" r="2" fill="#6d3a68" />
              <line x1="16" y1="16" x2="16" y2="8" stroke="#6d3a68" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="16" x2="23" y2="16" stroke="#d9775b" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Laptop Vault with Past Papers Display */}
            <g transform="translate(42, 22)">
              {/* Laptop Screen Open */}
              <rect x="10" y="6" width="86" height="56" rx="5" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="2" />
              {/* Screen Display White */}
              <rect x="14" y="10" width="78" height="48" rx="3" fill="#ffffff" />
              
              {/* Center Olympiad Exam Paper Document */}
              <rect x="36" y="15" width="34" height="38" rx="3" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.5" />
              <rect x="40" y="20" width="26" height="4" rx="2" fill="#d9775b" />
              <line x1="40" y1="28" x2="66" y2="28" stroke="#deb8de" strokeWidth="2" strokeLinecap="round" />
              <line x1="40" y1="34" x2="66" y2="34" stroke="#deb8de" strokeWidth="2" strokeLinecap="round" />
              <line x1="40" y1="40" x2="58" y2="40" stroke="#deb8de" strokeWidth="2" strokeLinecap="round" />
              
              {/* Year Pill Tag 2026 */}
              <rect x="17" y="15" width="16" height="8" rx="2" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.2" />
              <text x="25" y="21" textAnchor="middle" fill="#906223" fontSize="5.5" fontWeight="900">2026</text>

              {/* Year Pill Tag 2025 */}
              <rect x="17" y="26" width="16" height="8" rx="2" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.2" />
              <text x="25" y="32" textAnchor="middle" fill="#d9775b" fontSize="5.5" fontWeight="900">2025</text>

              {/* Year Pill Tag 2024 */}
              <rect x="17" y="37" width="16" height="8" rx="2" fill="#faf5fa" stroke="#8c4e8b" strokeWidth="1.2" />
              <text x="25" y="43" textAnchor="middle" fill="#8c4e8b" fontSize="5.5" fontWeight="900">2024</text>

              {/* Laptop Keyboard Base */}
              <polygon points="0,64 106,64 96,72 10,72" fill="#edd6ed" stroke="#4e2a4a" strokeWidth="1.8" />
              <rect x="44" y="64" width="18" height="3" rx="1.5" fill="#6d3a68" />
            </g>

            {/* Earth Globe in Warm Palette */}
            <g transform="translate(138, 64)">
              <circle cx="16" cy="16" r="14" fill="#faf4e0" stroke="#6d3a68" strokeWidth="1.8" />
              <ellipse cx="16" cy="16" rx="6" ry="14" stroke="#d9775b" strokeWidth="1.5" />
              <line x1="2" y1="16" x2="30" y2="16" stroke="#d9775b" strokeWidth="1.5" />
              <line x1="16" y1="2" x2="16" y2="30" stroke="#6d3a68" strokeWidth="1.5" />
            </g>

            {/* Desk Surface Line */}
            <line x1="15" y1="102" x2="175" y2="102" stroke="#d9775b" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
      );

    case 'live':
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 overflow-hidden ${className}`}>
          <svg viewBox="0 0 190 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soft Glow */}
            <circle cx="95" cy="70" r="55" fill="#ebd4eb" opacity="0.6" />

            {/* Laptop displaying Live Video Masterclass */}
            <g transform="translate(42, 18)">
              {/* Graduation Cap in Dark Plum & Coral Tassel */}
              <g transform="translate(8, -12)">
                <polygon points="28,0 54,12 28,24 2,12" fill="#d9775b" stroke="#4e2a4a" strokeWidth="1.8" />
                <path d="M14 18 V26 C14 32 42 32 42 26 V18" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="1.5" />
                <line x1="54" y1="12" x2="58" y2="25" stroke="#e7b84b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="58" cy="25" r="2.5" fill="#e7b84b" />
              </g>

              {/* Laptop Screen Open */}
              <rect x="10" y="14" width="86" height="58" rx="5" fill="#4e2a4a" stroke="#4e2a4a" strokeWidth="2" />
              <rect x="14" y="18" width="78" height="50" rx="3" fill="#ffffff" />
              
              {/* Video Player Canvas with Coral Gradient */}
              <rect x="20" y="24" width="66" height="38" rx="4" fill="#fdf6f4" stroke="#f7d7cc" strokeWidth="1.5" />
              
              {/* Big Glowing Play Button */}
              <circle cx="53" cy="43" r="12" fill="#d9775b" stroke="#ffffff" strokeWidth="2" />
              <polygon points="50,37 50,49 60,43" fill="#ffffff" />
              
              {/* LIVE Badge (Bright Terracotta Red) */}
              <rect x="23" y="27" width="20" height="6.5" rx="2" fill="#d9775b" />
              <circle cx="27" cy="30.2" r="1.5" fill="#ffffff" />
              <text x="35" y="32" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="900">LIVE</text>

              {/* Laptop Keyboard Base */}
              <polygon points="0,72 106,72 96,80 10,80" fill="#edd6ed" stroke="#4e2a4a" strokeWidth="1.8" />
              <rect x="44" y="72" width="18" height="3" rx="1.5" fill="#6d3a68" />
            </g>

            {/* Sparkles / Gold Stars */}
            <g transform="translate(148, 12)">
              <polygon points="8,0 10,6 16,8 10,10 8,16 6,10 0,8 6,6" fill="#e7b84b" />
            </g>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
