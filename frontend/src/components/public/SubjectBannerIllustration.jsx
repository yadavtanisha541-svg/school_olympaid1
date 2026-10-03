import React from 'react';

/**
 * SubjectBannerIllustration renders custom SVG doodle vector banners
 * tailored to each Olympiad subject with the platform's Plum, Coral, Gold, & Ivory theme.
 */
export const SubjectBannerIllustration = ({ subjectId, className = "w-full h-28" }) => {
  switch (subjectId) {
    case 'math':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#faf5fa] via-[#fff9f2] to-[#faf4e0] flex items-center justify-center p-2 rounded-t-md border-b border-[#edd6ed] ${className}`}>
          <svg viewBox="0 0 320 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Doodles */}
            <circle cx="28" cy="24" r="14" stroke="#d9775b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
            <path d="M15 85 Q30 65 45 85 T75 85" stroke="#6d3a68" strokeWidth="1.5" fill="none" opacity="0.6" />
            
            {/* Lightbulb Idea on top */}
            <g transform="translate(100, 8) scale(0.7)">
              <circle cx="20" cy="18" r="12" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <path d="M16 30 H24" stroke="#e7b84b" strokeWidth="2" strokeLinecap="round" />
              <path d="M17 33 H23" stroke="#e7b84b" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 6 V2 M30 9 L34 6 M34 20 H38 M8 9 L4 6 M4 20 H0" stroke="#e7b84b" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Geometric Triangle */}
            <polygon points="145,15 165,38 125,38" stroke="#d9775b" strokeWidth="1.5" fill="#fdf6f4" />
            <circle cx="145" cy="30" r="1.5" fill="#d9775b" />

            {/* Pi symbol */}
            <g transform="translate(255, 12) scale(0.85)">
              <path d="M4 8 H24 M8 8 V24 M20 8 V24 Q20 26 23 25" stroke="#6d3a68" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Geometry Hexagon & Graph */}
            <polygon points="185,12 198,19 198,33 185,40 172,33 172,19" stroke="#e7b84b" strokeWidth="1.5" fill="#faf4e0" opacity="0.7" />
            <path d="M125 15 L145 8 L170 20 L200 10 L230 18" stroke="#6d3a68" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <circle cx="125" cy="15" r="2.5" fill="#6d3a68" />
            <circle cx="145" cy="8" r="2.5" fill="#d9775b" />
            <circle cx="170" cy="20" r="2.5" fill="#e7b84b" />
            <circle cx="200" cy="10" r="2.5" fill="#6d3a68" />
            <circle cx="230" cy="18" r="2.5" fill="#d9775b" />

            {/* Apple / Constant */}
            <g transform="translate(210, 14) scale(0.65)">
              <path d="M15 12 C10 8 4 12 4 18 C4 26 15 32 15 32 C15 32 26 26 26 18 C26 12 20 8 15 12 Z" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.8" />
              <path d="M15 12 Q17 6 20 4" stroke="#6d3a68" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Big Stylized Subject Typography */}
            <text x="160" y="74" textAnchor="middle" fill="#4e2a4a" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="27" letterSpacing="1.5">
              MATHEMATICS
            </text>
            <text x="160" y="74" textAnchor="middle" stroke="#6d3a68" strokeWidth="0.8" fill="none" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="27" letterSpacing="1.5">
              MATHEMATICS
            </text>

            {/* Bottom calculation doodle bar */}
            <g transform="translate(45, 82)">
              <rect x="0" y="0" width="230" height="2" fill="#edd6ed" />
              {/* Venn diagram circles */}
              <circle cx="65" cy="12" r="10" stroke="#e7b84b" strokeWidth="1.5" fill="none" opacity="0.7" />
              <circle cx="78" cy="12" r="10" stroke="#d9775b" strokeWidth="1.5" fill="none" opacity="0.7" />
              {/* Math Sheet */}
              <rect x="120" y="3" width="16" height="20" rx="2" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.5" />
              <line x1="124" y1="8" x2="132" y2="8" stroke="#d9775b" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="124" y1="12" x2="132" y2="12" stroke="#6d3a68" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="124" y1="16" x2="129" y2="16" stroke="#d9775b" strokeWidth="1.2" strokeLinecap="round" />
              {/* 3D Cube */}
              <g transform="translate(165, 3) scale(0.65)">
                <polygon points="12,0 24,6 24,18 12,24 0,18 0,6" stroke="#6d3a68" strokeWidth="1.8" fill="#faf5fa" />
                <line x1="12" y1="0" x2="12" y2="12" stroke="#6d3a68" strokeWidth="1.5" />
                <line x1="0" y1="6" x2="12" y2="12" stroke="#6d3a68" strokeWidth="1.5" />
                <line x1="24" y1="6" x2="12" y2="12" stroke="#6d3a68" strokeWidth="1.5" />
                <line x1="12" y1="12" x2="12" y2="24" stroke="#6d3a68" strokeWidth="1.5" />
              </g>
              {/* Square root */}
              <path d="M10 16 L14 16 L17 22 L21 8 L32 8" stroke="#6d3a68" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="24" y="18" fill="#d9775b" fontSize="8" fontWeight="bold">x</text>
            </g>
          </svg>
        </div>
      );

    case 'science':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#fdf6f4] via-[#faf5fa] to-[#faf4e0] flex items-center justify-center p-2 rounded-t-md border-b border-[#f7d7cc] ${className}`}>
          <svg viewBox="0 0 320 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Atom Orbit System on Top Left */}
            <g transform="translate(30, 8) scale(0.75)">
              <ellipse cx="25" cy="25" rx="22" ry="8" stroke="#d9775b" strokeWidth="1.5" transform="rotate(30 25 25)" />
              <ellipse cx="25" cy="25" rx="22" ry="8" stroke="#6d3a68" strokeWidth="1.5" transform="rotate(-30 25 25)" />
              <ellipse cx="25" cy="25" rx="22" ry="8" stroke="#e7b84b" strokeWidth="1.5" transform="rotate(90 25 25)" />
              <circle cx="25" cy="25" r="4" fill="#d9775b" />
            </g>

            {/* Laboratory Beaker / Flask on Top Right */}
            <g transform="translate(250, 10) scale(0.7)">
              <path d="M12 4 H24 M15 4 V12 L6 32 H30 L21 12 V4" stroke="#6d3a68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#faf5fa" />
              <path d="M8 28 H28" stroke="#d9775b" strokeWidth="2" />
              <circle cx="15" cy="22" r="2" fill="#e7b84b" />
              <circle cx="21" cy="24" r="1.5" fill="#d9775b" />
              <circle cx="18" cy="18" r="1.5" fill="#6d3a68" />
            </g>

            {/* DNA Double Helix */}
            <g transform="translate(130, 8) scale(0.7)">
              <path d="M0 10 Q15 0 30 10 T60 10" stroke="#d9775b" strokeWidth="1.8" fill="none" />
              <path d="M0 20 Q15 30 30 20 T60 20" stroke="#6d3a68" strokeWidth="1.8" fill="none" />
              <line x1="8" y1="8" x2="8" y2="22" stroke="#e7b84b" strokeWidth="1.5" />
              <line x1="22" y1="5" x2="22" y2="25" stroke="#e7b84b" strokeWidth="1.5" />
              <line x1="38" y1="8" x2="38" y2="22" stroke="#e7b84b" strokeWidth="1.5" />
              <line x1="52" y1="5" x2="52" y2="25" stroke="#e7b84b" strokeWidth="1.5" />
            </g>

            {/* Telescope / Satellite */}
            <g transform="translate(200, 12) scale(0.65)">
              <path d="M5 25 L25 5 L32 12 L12 32 Z" stroke="#6d3a68" strokeWidth="1.8" fill="#faf4e0" />
              <line x1="18" y1="20" x2="8" y2="38" stroke="#d9775b" strokeWidth="1.5" />
              <line x1="18" y1="20" x2="28" y2="38" stroke="#d9775b" strokeWidth="1.5" />
            </g>

            {/* Big Stylized Subject Typography */}
            <text x="160" y="74" textAnchor="middle" fill="#d9775b" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="28" letterSpacing="2">
              SCIENCE
            </text>
            <text x="160" y="74" textAnchor="middle" stroke="#6d3a68" strokeWidth="0.8" fill="none" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="28" letterSpacing="2">
              SCIENCE
            </text>

            {/* Bottom Doodles */}
            <g transform="translate(40, 82)">
              <rect x="0" y="0" width="240" height="2" fill="#f7d7cc" />
              {/* Horseshoe Magnet */}
              <g transform="translate(25, 4) scale(0.6)">
                <path d="M4 4 V16 C4 24 24 24 24 16 V4 H18 V16 C18 19 10 19 10 16 V4 H4 Z" fill="#d9775b" stroke="#6d3a68" strokeWidth="1.5" />
                <rect x="4" y="4" width="6" height="4" fill="#faf4e0" />
                <rect x="18" y="4" width="6" height="4" fill="#faf4e0" />
              </g>
              {/* Planetary Ring */}
              <g transform="translate(95, 4) scale(0.65)">
                <circle cx="16" cy="14" r="10" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.5" />
                <ellipse cx="16" cy="14" rx="18" ry="4" stroke="#6d3a68" strokeWidth="1.2" transform="rotate(-20 16 14)" />
              </g>
              {/* Microscope */}
              <g transform="translate(170, 2) scale(0.55)">
                <path d="M12 2 L20 16 M14 26 C8 26 6 18 12 12 M8 26 H24" stroke="#6d3a68" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="8" r="3" fill="#d9775b" />
              </g>
            </g>
          </svg>
        </div>
      );

    case 'english':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#faf5fa] via-[#fff9f2] to-[#faf4e0] flex items-center justify-center p-2 rounded-t-md border-b border-[#edd6ed] ${className}`}>
          <svg viewBox="0 0 320 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Quill Feather & Ink Bottle on Left */}
            <g transform="translate(25, 10) scale(0.7)">
              <path d="M10 32 C10 32 15 15 28 4 C28 4 22 18 20 28 Z" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.8" />
              <line x1="10" y1="32" x2="28" y2="4" stroke="#6d3a68" strokeWidth="1.5" />
              <rect x="4" y="28" width="12" height="10" rx="2" fill="#faf4e0" stroke="#6d3a68" strokeWidth="1.5" />
            </g>

            {/* Speech Bubble with A B C */}
            <g transform="translate(95, 8) scale(0.7)">
              <path d="M4 6 C4 2 28 2 28 6 V18 C28 22 4 22 4 18 Z M8 22 L4 28 L14 22" fill="#faf5fa" stroke="#6d3a68" strokeWidth="1.5" />
              <text x="10" y="16" fill="#d9775b" fontSize="11" fontWeight="900">Aa</text>
            </g>

            {/* Open Book Graphic Center */}
            <g transform="translate(160, 8) scale(0.7)">
              <path d="M0 24 C8 20 18 20 25 24 C32 20 42 20 50 24 V6 C42 2 32 2 25 6 C18 2 8 2 0 6 Z" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <line x1="25" y1="6" x2="25" y2="24" stroke="#6d3a68" strokeWidth="1.5" />
            </g>

            {/* Vocabulary Ribbon Tag */}
            <g transform="translate(240, 10) scale(0.75)">
              <polygon points="0,0 35,0 30,12 35,24 0,24" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.5" />
              <text x="6" y="16" fill="#6d3a68" fontSize="9" fontWeight="bold">VOCAB</text>
            </g>

            {/* Big Stylized Subject Typography */}
            <text x="160" y="74" textAnchor="middle" fill="#6d3a68" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="28" letterSpacing="2">
              ENGLISH
            </text>
            <text x="160" y="74" textAnchor="middle" stroke="#d9775b" strokeWidth="0.8" fill="none" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="28" letterSpacing="2">
              ENGLISH
            </text>

            {/* Bottom Doodles */}
            <g transform="translate(40, 82)">
              <rect x="0" y="0" width="240" height="2" fill="#edd6ed" />
              <text x="35" y="16" fill="#8c4e8b" fontSize="11" fontWeight="bold" fontFamily="serif">“Quotes”</text>
              <text x="110" y="16" fill="#d9775b" fontSize="11" fontWeight="900">Grammar</text>
              <text x="195" y="16" fill="#e7b84b" fontSize="11" fontWeight="900">Spelling ✓</text>
            </g>
          </svg>
        </div>
      );

    case 'cyber':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#faf5fa] via-[#fff9f2] to-[#faf4e0] flex items-center justify-center p-2 rounded-t-md border-b border-[#edd6ed] ${className}`}>
          <svg viewBox="0 0 320 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* AI Chip Microprocessor on Left */}
            <g transform="translate(25, 10) scale(0.7)">
              <rect x="6" y="6" width="26" height="26" rx="4" fill="#faf5fa" stroke="#6d3a68" strokeWidth="2" />
              <text x="12" y="24" fill="#d9775b" fontSize="10" fontWeight="900">AI</text>
              <line x1="0" y1="12" x2="6" y2="12" stroke="#6d3a68" strokeWidth="1.5" />
              <line x1="0" y1="19" x2="6" y2="19" stroke="#6d3a68" strokeWidth="1.5" />
              <line x1="0" y1="26" x2="6" y2="26" stroke="#6d3a68" strokeWidth="1.5" />
              <line x1="32" y1="12" x2="38" y2="12" stroke="#6d3a68" strokeWidth="1.5" />
              <line x1="32" y1="19" x2="38" y2="19" stroke="#6d3a68" strokeWidth="1.5" />
              <line x1="32" y1="26" x2="38" y2="26" stroke="#6d3a68" strokeWidth="1.5" />
            </g>

            {/* Neural Network Nodes Center */}
            <g transform="translate(110, 10) scale(0.7)">
              <circle cx="10" cy="10" r="4" fill="#d9775b" />
              <circle cx="10" cy="26" r="4" fill="#d9775b" />
              <circle cx="35" cy="6" r="4" fill="#e7b84b" />
              <circle cx="35" cy="18" r="4" fill="#e7b84b" />
              <circle cx="35" cy="30" r="4" fill="#e7b84b" />
              <circle cx="60" cy="18" r="5" fill="#6d3a68" />
              <line x1="14" y1="10" x2="31" y2="6" stroke="#edd6ed" strokeWidth="1.2" />
              <line x1="14" y1="10" x2="31" y2="18" stroke="#edd6ed" strokeWidth="1.2" />
              <line x1="14" y1="26" x2="31" y2="18" stroke="#edd6ed" strokeWidth="1.2" />
              <line x1="14" y1="26" x2="31" y2="30" stroke="#edd6ed" strokeWidth="1.2" />
              <line x1="39" y1="6" x2="55" y2="18" stroke="#edd6ed" strokeWidth="1.2" />
              <line x1="39" y1="18" x2="55" y2="18" stroke="#edd6ed" strokeWidth="1.2" />
              <line x1="39" y1="30" x2="55" y2="18" stroke="#edd6ed" strokeWidth="1.2" />
            </g>

            {/* Laptop / Code Terminal on Right */}
            <g transform="translate(245, 12) scale(0.65)">
              <rect x="4" y="4" width="36" height="24" rx="2" fill="#faf4e0" stroke="#6d3a68" strokeWidth="1.8" />
              <path d="M0 28 H44 L40 32 H4 Z" fill="#edd6ed" stroke="#6d3a68" strokeWidth="1.5" />
              <text x="8" y="16" fill="#d9775b" fontSize="8" fontWeight="bold">&lt;/&gt;</text>
            </g>

            {/* Big Stylized Subject Typography */}
            <text x="160" y="74" textAnchor="middle" fill="#4e2a4a" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">
              CYBER &amp; AI
            </text>
            <text x="160" y="74" textAnchor="middle" stroke="#e7b84b" strokeWidth="0.6" fill="none" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">
              CYBER &amp; AI
            </text>

            {/* Bottom Doodles */}
            <g transform="translate(40, 82)">
              <rect x="0" y="0" width="240" height="2" fill="#edd6ed" />
              <text x="25" y="16" fill="#6d3a68" fontSize="10" fontWeight="bold">0101001</text>
              <text x="105" y="16" fill="#d9775b" fontSize="10" fontWeight="bold">Python / C++</text>
              <text x="195" y="16" fill="#e7b84b" fontSize="10" fontWeight="bold">Cloud Tech</text>
            </g>
          </svg>
        </div>
      );

    case 'reasoning':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#faf5fa] via-[#fff9f2] to-[#faf4e0] flex items-center justify-center p-2 rounded-t-md border-b border-[#edd6ed] ${className}`}>
          <svg viewBox="0 0 320 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Brain Outline with Synapses on Left */}
            <g transform="translate(25, 8) scale(0.7)">
              <path d="M12 28 C6 28 4 20 8 15 C4 12 6 4 14 4 C18 1 26 2 28 8 C34 4 40 10 38 16 C42 20 40 28 32 28 Z" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.8" />
              <circle cx="16" cy="14" r="2" fill="#d9775b" />
              <circle cx="28" cy="18" r="2" fill="#6d3a68" />
              <line x1="16" y1="14" x2="28" y2="18" stroke="#edd6ed" strokeWidth="1.5" />
            </g>

            {/* Jigsaw Puzzle Pieces Center */}
            <g transform="translate(125, 10) scale(0.65)">
              <rect x="4" y="4" width="20" height="20" rx="3" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.8" />
              <circle cx="24" cy="14" r="4" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.8" />
              <rect x="24" y="4" width="20" height="20" rx="3" fill="#faf5fa" stroke="#6d3a68" strokeWidth="1.8" />
            </g>

            {/* Magnifying Glass on Right */}
            <g transform="translate(245, 10) scale(0.7)">
              <circle cx="16" cy="16" r="12" fill="#faf4e0" stroke="#6d3a68" strokeWidth="2" />
              <line x1="25" y1="25" x2="36" y2="36" stroke="#d9775b" strokeWidth="3" strokeLinecap="round" />
              <path d="M12 16 H20 M16 12 V20" stroke="#e7b84b" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Big Stylized Subject Typography */}
            <text x="160" y="74" textAnchor="middle" fill="#6d3a68" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">
              REASONING
            </text>
            <text x="160" y="74" textAnchor="middle" stroke="#d9775b" strokeWidth="0.8" fill="none" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">
              REASONING
            </text>

            {/* Bottom Doodles */}
            <g transform="translate(40, 82)">
              <rect x="0" y="0" width="240" height="2" fill="#edd6ed" />
              <text x="25" y="16" fill="#4e2a4a" fontSize="10" fontWeight="bold">Patterns &amp; Series</text>
              <text x="125" y="16" fill="#d9775b" fontSize="10" fontWeight="bold">Spatial Logic</text>
              <text x="205" y="16" fill="#e7b84b" fontSize="10" fontWeight="bold">Analogies</text>
            </g>
          </svg>
        </div>
      );

    case 'mental-maths':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#faf4e0] via-[#fdf6f4] to-[#faf5fa] flex items-center justify-center p-2 rounded-t-md border-b border-[#f5e7bf] ${className}`}>
          <svg viewBox="0 0 320 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Speed Lightning Abacus on Left */}
            <g transform="translate(25, 8) scale(0.7)">
              <rect x="2" y="4" width="34" height="26" rx="3" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <line x1="2" y1="12" x2="36" y2="12" stroke="#e7b84b" strokeWidth="1.5" />
              <circle cx="10" cy="8" r="2.5" fill="#d9775b" />
              <circle cx="20" cy="8" r="2.5" fill="#d9775b" />
              <circle cx="10" cy="20" r="2.5" fill="#6d3a68" />
              <circle cx="10" cy="26" r="2.5" fill="#6d3a68" />
              <circle cx="20" cy="20" r="2.5" fill="#6d3a68" />
              <circle cx="28" cy="20" r="2.5" fill="#6d3a68" />
            </g>

            {/* Lightning Flash Center */}
            <g transform="translate(130, 6) scale(0.8)">
              <polygon points="18,0 6,18 16,18 10,34 26,14 16,14" fill="#e7b84b" stroke="#d9775b" strokeWidth="1.5" />
            </g>

            {/* Speed Stopwatch on Right */}
            <g transform="translate(245, 8) scale(0.7)">
              <circle cx="20" cy="22" r="14" fill="#faf5fa" stroke="#6d3a68" strokeWidth="2" />
              <line x1="20" y1="22" x2="26" y2="14" stroke="#d9775b" strokeWidth="2" strokeLinecap="round" />
              <rect x="18" y="4" width="4" height="4" fill="#e7b84b" stroke="#6d3a68" strokeWidth="1" />
            </g>

            {/* Big Stylized Subject Typography */}
            <text x="160" y="74" textAnchor="middle" fill="#d9775b" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">
              MENTAL MATHS
            </text>
            <text x="160" y="74" textAnchor="middle" stroke="#e7b84b" strokeWidth="0.8" fill="none" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">
              MENTAL MATHS
            </text>

            {/* Bottom Doodles */}
            <g transform="translate(40, 82)">
              <rect x="0" y="0" width="240" height="2" fill="#f5e7bf" />
              <text x="25" y="16" fill="#6d3a68" fontSize="10" fontWeight="900">⚡ Speed Drills</text>
              <text x="115" y="16" fill="#d9775b" fontSize="10" fontWeight="900">Vedic Shortcuts</text>
              <text x="210" y="16" fill="#e7b84b" fontSize="10" fontWeight="900">Accuracy 100%</text>
            </g>
          </svg>
        </div>
      );

    case 'gk':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#faf5fa] via-[#fff9f2] to-[#faf4e0] flex items-center justify-center p-2 rounded-t-md border-b border-[#edd6ed] ${className}`}>
          <svg viewBox="0 0 320 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Globe on Left */}
            <g transform="translate(25, 8) scale(0.7)">
              <circle cx="20" cy="20" r="16" fill="#faf4e0" stroke="#6d3a68" strokeWidth="2" />
              <ellipse cx="20" cy="20" rx="7" ry="16" stroke="#d9775b" strokeWidth="1.2" />
              <line x1="4" y1="20" x2="36" y2="20" stroke="#d9775b" strokeWidth="1.2" />
              <line x1="20" y1="4" x2="20" y2="36" stroke="#6d3a68" strokeWidth="1.2" />
            </g>

            {/* Landmark Monument Center */}
            <g transform="translate(130, 8) scale(0.7)">
              <polygon points="15,4 28,14 2,14" fill="#faf5fa" stroke="#d9775b" strokeWidth="1.5" />
              <rect x="5" y="14" width="4" height="18" fill="#faf4e0" stroke="#6d3a68" strokeWidth="1.5" />
              <rect x="13" y="14" width="4" height="18" fill="#faf4e0" stroke="#6d3a68" strokeWidth="1.5" />
              <rect x="21" y="14" width="4" height="18" fill="#faf4e0" stroke="#6d3a68" strokeWidth="1.5" />
              <rect x="2" y="32" width="26" height="4" fill="#edd6ed" stroke="#6d3a68" strokeWidth="1.5" />
            </g>

            {/* Compass Star on Right */}
            <g transform="translate(245, 8) scale(0.7)">
              <circle cx="20" cy="20" r="15" fill="#fdf6f4" stroke="#e7b84b" strokeWidth="1.8" />
              <polygon points="20,8 23,17 32,20 23,23 20,32 17,23 8,20 17,17" fill="#d9775b" stroke="#6d3a68" strokeWidth="1.2" />
            </g>

            {/* Big Stylized Subject Typography */}
            <text x="160" y="74" textAnchor="middle" fill="#4e2a4a" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="1.5">
              GENERAL KNOWLEDGE
            </text>
            <text x="160" y="74" textAnchor="middle" stroke="#e7b84b" strokeWidth="0.6" fill="none" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="1.5">
              GENERAL KNOWLEDGE
            </text>

            {/* Bottom Doodles */}
            <g transform="translate(40, 82)">
              <rect x="0" y="0" width="240" height="2" fill="#edd6ed" />
              <text x="25" y="16" fill="#6d3a68" fontSize="10" fontWeight="bold">Current Affairs</text>
              <text x="120" y="16" fill="#d9775b" fontSize="10" fontWeight="bold">World Geography</text>
              <text x="210" y="16" fill="#e7b84b" fontSize="10" fontWeight="bold">History</text>
            </g>
          </svg>
        </div>
      );

    case 'eco':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#faf4e0] via-[#fff9f2] to-[#fdf6f4] flex items-center justify-center p-2 rounded-t-md border-b border-[#f5e7bf] ${className}`}>
          <svg viewBox="0 0 320 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sprout Seedling in Plum/Coral/Gold on Left */}
            <g transform="translate(25, 8) scale(0.7)">
              <path d="M20 34 V18 C20 12 10 10 8 14 C6 20 16 22 20 18" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <path d="M20 18 C20 10 30 8 32 12 C34 18 24 20 20 18" fill="#fdf6f4" stroke="#d9775b" strokeWidth="2" />
              <ellipse cx="20" cy="34" rx="14" ry="3" fill="#edd6ed" stroke="#6d3a68" strokeWidth="1.5" />
            </g>

            {/* Sun & Energy Center */}
            <g transform="translate(130, 8) scale(0.7)">
              <circle cx="20" cy="20" r="10" fill="#faf4e0" stroke="#e7b84b" strokeWidth="2" />
              <path d="M20 4 V0 M20 40 V36 M4 20 H0 M40 20 H36 M9 9 L6 6 M31 31 L34 34 M9 31 L6 34 M31 9 L34 6" stroke="#d9775b" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Clean Wind Turbine on Right */}
            <g transform="translate(245, 8) scale(0.7)">
              <line x1="20" y1="16" x2="20" y2="38" stroke="#6d3a68" strokeWidth="2" />
              <circle cx="20" cy="16" r="3" fill="#e7b84b" />
              <path d="M20 16 L20 2 M20 16 L32 23 M20 16 L8 23" stroke="#d9775b" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Big Stylized Subject Typography */}
            <text x="160" y="74" textAnchor="middle" fill="#6d3a68" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="1.2">
              ENVIRONMENTAL CHAMPIONS
            </text>
            <text x="160" y="74" textAnchor="middle" stroke="#d9775b" strokeWidth="0.6" fill="none" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="1.2">
              ENVIRONMENTAL CHAMPIONS
            </text>

            {/* Bottom Doodles */}
            <g transform="translate(40, 82)">
              <rect x="0" y="0" width="240" height="2" fill="#f5e7bf" />
              <text x="25" y="16" fill="#6d3a68" fontSize="10" fontWeight="bold">Renewable Energy</text>
              <text x="120" y="16" fill="#d9775b" fontSize="10" fontWeight="bold">Conservation</text>
              <text x="205" y="16" fill="#e7b84b" fontSize="10" fontWeight="bold">Biodiversity</text>
            </g>
          </svg>
        </div>
      );

    case 'arts':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#faf5fa] via-[#fff9f2] to-[#faf4e0] flex items-center justify-center p-2 rounded-t-md border-b border-[#edd6ed] ${className}`}>
          <svg viewBox="0 0 320 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Paint Palette on Left */}
            <g transform="translate(25, 8) scale(0.7)">
              <path d="M18 4 C8 4 2 12 2 22 C2 32 14 36 24 36 C30 36 36 32 36 26 C36 22 32 20 30 18 C28 16 30 12 26 8 C24 6 22 4 18 4 Z" fill="#faf4e0" stroke="#6d3a68" strokeWidth="2" />
              <circle cx="10" cy="16" r="2.5" fill="#d9775b" />
              <circle cx="18" cy="12" r="2.5" fill="#e7b84b" />
              <circle cx="26" cy="16" r="2.5" fill="#6d3a68" />
              <circle cx="14" cy="26" r="2.5" fill="#deb8de" />
            </g>

            {/* Easel Canvas Center */}
            <g transform="translate(130, 8) scale(0.7)">
              <rect x="4" y="4" width="30" height="22" rx="2" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.8" />
              <line x1="8" y1="26" x2="4" y2="38" stroke="#6d3a68" strokeWidth="2" />
              <line x1="30" y1="26" x2="34" y2="38" stroke="#6d3a68" strokeWidth="2" />
              <line x1="19" y1="4" x2="19" y2="38" stroke="#6d3a68" strokeWidth="1.5" />
            </g>

            {/* Art Brush on Right */}
            <g transform="translate(245, 8) scale(0.7)">
              <path d="M8 36 L24 14 L30 18 L14 40 Z" fill="#faf4e0" stroke="#6d3a68" strokeWidth="1.8" />
              <path d="M24 14 L28 6 C28 6 34 8 30 18 Z" fill="#d9775b" stroke="#6d3a68" strokeWidth="1.5" />
            </g>

            {/* Big Stylized Subject Typography */}
            <text x="160" y="74" textAnchor="middle" fill="#d9775b" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">
              CREATIVE ARTS
            </text>
            <text x="160" y="74" textAnchor="middle" stroke="#6d3a68" strokeWidth="0.8" fill="none" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">
              CREATIVE ARTS
            </text>

            {/* Bottom Doodles */}
            <g transform="translate(40, 82)">
              <rect x="0" y="0" width="240" height="2" fill="#edd6ed" />
              <text x="25" y="16" fill="#6d3a68" fontSize="10" fontWeight="bold">Sketching</text>
              <text x="120" y="16" fill="#d9775b" fontSize="10" fontWeight="bold">Color Harmony</text>
              <text x="210" y="16" fill="#e7b84b" fontSize="10" fontWeight="bold">Design Sense</text>
            </g>
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#faf5fa] via-[#fff9f2] to-[#faf4e0] flex items-center justify-center p-2 rounded-t-md border-b border-[#edd6ed] ${className}`}>
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#6d3a68" fontWeight="900" fontSize="20">
            OLYMPIADHUB
          </text>
        </div>
      );
  }
};
