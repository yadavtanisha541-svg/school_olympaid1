import React from 'react';

/**
 * StepCardIllustration renders custom character & educational vector scene illustrations
 * for each of the 4 steps (01 Discover, 02 Prepare, 03 Live Exam, 04 Certification).
 * Palette strictly follows Plum, Coral, Gold, Lavender, and Warm Ivory.
 */
export const StepCardIllustration = ({ stepNumber, className = "w-full h-36" }) => {
  switch (stepNumber) {
    case '01':
      return (
        <div className={`relative w-full h-full bg-gradient-to-b from-[#faf5fa] to-white flex items-center justify-center p-2 overflow-hidden ${className}`}>
          <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Soft Glow */}
            <circle cx="120" cy="70" r="55" fill="#f4ebf4" opacity="0.6" />
            
            {/* Floating Registration Checklist Card (Behind) */}
            <g transform="translate(135, 15)">
              <rect x="0" y="0" width="75" height="75" rx="8" fill="#ffffff" stroke="#edd6ed" strokeWidth="1.5" />
              {/* Profile Avatar Icon */}
              <circle cx="55" cy="18" r="8" fill="#faf5fa" stroke="#6d3a68" strokeWidth="1.2" />
              <circle cx="55" cy="16" r="3.5" fill="#6d3a68" />
              <path d="M49 23 C49 20 61 20 61 23" fill="#6d3a68" />
              {/* Checklist Lines */}
              <rect x="12" y="14" width="22" height="4" rx="2" fill="#edd6ed" />
              {/* Check 1 */}
              <rect x="12" y="26" width="10" height="10" rx="3" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1.2" />
              <path d="M14 31 L17 34 L20 28" stroke="#d9775b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="28" y="29" width="30" height="3.5" rx="1.5" fill="#edd6ed" />
              {/* Check 2 */}
              <rect x="12" y="42" width="10" height="10" rx="3" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.2" />
              <path d="M14 47 L17 50 L20 44" stroke="#e7b84b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="28" y="45" width="24" height="3.5" rx="1.5" fill="#edd6ed" />
            </g>

            {/* Desk Plant */}
            <g transform="translate(195, 75)">
              <rect x="5" y="15" width="14" height="15" rx="2" fill="#edd6ed" stroke="#6d3a68" strokeWidth="1" />
              <path d="M12 15 C8 8 10 2 12 0 C14 2 16 8 12 15" fill="#deb8de" stroke="#6d3a68" strokeWidth="1" />
              <path d="M8 12 C3 8 4 3 7 2 C8 4 9 8 8 12" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1" />
              <path d="M16 12 C21 8 20 3 17 2 C16 4 15 8 16 12" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1" />
            </g>

            {/* Boy Character at Laptop */}
            <g transform="translate(30, 20)">
              {/* Boy Head & Hair */}
              <circle cx="50" cy="38" r="18" fill="#fde8e4" />
              {/* Dark Styled Hair */}
              <path d="M32 34 C32 20 40 16 52 16 C64 16 68 22 68 30 C64 30 62 26 56 26 C50 26 48 30 42 30 C38 30 36 34 32 34 Z" fill="#4e2a4a" />
              <path d="M32 32 C30 26 34 20 40 18" fill="#4e2a4a" />
              {/* Face Features */}
              <circle cx="56" cy="36" r="2" fill="#4e2a4a" />
              <path d="M53 43 Q57 46 60 43" stroke="#d9775b" strokeWidth="1.5" strokeLinecap="round" />
              {/* Boy Hoodie Body */}
              <path d="M30 62 C30 52 42 50 50 50 C58 50 70 52 70 62 L74 95 H26 L30 62 Z" fill="#6d3a68" />
              <path d="M46 50 L42 66 L50 72 L58 66 L54 50" fill="#8c4e8b" />
              {/* Arms Typing */}
              <path d="M30 65 Q45 80 65 78" stroke="#6d3a68" strokeWidth="8" strokeLinecap="round" fill="none" />
              <circle cx="68" cy="78" r="4" fill="#fde8e4" />
              {/* Laptop */}
              <g transform="translate(60, 60)">
                {/* Laptop Screen Open */}
                <polygon points="0,20 18,2 38,2 20,20" fill="#faf5fa" stroke="#4e2a4a" strokeWidth="1.5" />
                <circle cx="19" cy="11" r="2.5" fill="#d9775b" />
                {/* Laptop Base */}
                <rect x="8" y="20" width="34" height="4" rx="1.5" fill="#edd6ed" stroke="#4e2a4a" strokeWidth="1.2" />
              </g>
            </g>

            {/* Desk Surface Line */}
            <line x1="15" y1="115" x2="225" y2="115" stroke="#edd6ed" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case '02':
      return (
        <div className={`relative w-full h-full bg-gradient-to-b from-[#fdf6f4] to-white flex items-center justify-center p-2 overflow-hidden ${className}`}>
          <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Soft Glow */}
            <circle cx="120" cy="70" r="55" fill="#fde8e4" opacity="0.6" />

            {/* Study Planner Sheet (Behind) */}
            <g transform="translate(130, 16)">
              <rect x="0" y="0" width="70" height="70" rx="8" fill="#ffffff" stroke="#f7d7cc" strokeWidth="1.5" />
              <circle cx="14" cy="16" r="3" fill="#d9775b" />
              <rect x="22" y="14" width="32" height="4" rx="2" fill="#edd6ed" />
              <circle cx="14" cy="28" r="3" fill="#e7b84b" />
              <rect x="22" y="26" width="26" height="4" rx="2" fill="#edd6ed" />
              <circle cx="14" cy="40" r="3" fill="#6d3a68" />
              <rect x="22" y="38" width="36" height="4" rx="2" fill="#edd6ed" />
              <circle cx="14" cy="52" r="3" fill="#deb8de" />
              <rect x="22" y="50" width="20" height="4" rx="2" fill="#edd6ed" />
            </g>

            {/* Wall Clock */}
            <g transform="translate(180, 14)">
              <circle cx="16" cy="16" r="14" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="1.5" fill="#6d3a68" />
              <line x1="16" y1="16" x2="16" y2="8" stroke="#6d3a68" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="16" y1="16" x2="22" y2="16" stroke="#d9775b" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Stack of Books */}
            <g transform="translate(155, 74)">
              {/* Book 1 Bottom */}
              <rect x="0" y="16" width="46" height="10" rx="2" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="1" />
              <rect x="4" y="18" width="38" height="6" fill="#faf5fa" />
              {/* Book 2 Top */}
              <rect x="5" y="8" width="40" height="9" rx="2" fill="#d9775b" stroke="#4e2a4a" strokeWidth="1" />
              <rect x="8" y="10" width="34" height="5" fill="#fdf6f4" />
              {/* Book 3 Topmost */}
              <rect x="10" y="0" width="34" height="9" rx="2" fill="#e7b84b" stroke="#4e2a4a" strokeWidth="1" />
              <rect x="13" y="2" width="28" height="5" fill="#faf4e0" />
            </g>

            {/* Girl Character Studying & Writing */}
            <g transform="translate(40, 20)">
              {/* Hair Back */}
              <path d="M30 35 C25 45 28 65 30 75 C35 75 40 60 40 40 Z" fill="#4e2a4a" />
              {/* Face */}
              <circle cx="52" cy="38" r="17" fill="#fde8e4" />
              {/* Front Hair with Bangs */}
              <path d="M36 34 C36 20 44 16 54 16 C64 16 68 22 68 30 C60 26 52 26 44 32 Z" fill="#4e2a4a" />
              <circle cx="58" cy="36" r="2" fill="#4e2a4a" />
              <path d="M56 43 Q60 46 63 43" stroke="#d9775b" strokeWidth="1.5" strokeLinecap="round" />
              {/* Girl Yellow/Gold Shirt */}
              <path d="M36 60 C36 50 46 48 54 48 C62 48 72 50 72 60 L74 95 H32 L36 60 Z" fill="#e7b84b" />
              {/* Arms Writing in Notebook */}
              <path d="M40 65 Q55 78 72 74" stroke="#e7b84b" strokeWidth="7" strokeLinecap="round" fill="none" />
              <circle cx="75" cy="74" r="4" fill="#fde8e4" />
              {/* Pen */}
              <line x1="74" y1="74" x2="80" y2="66" stroke="#d9775b" strokeWidth="2" strokeLinecap="round" />

              {/* Open Notebook on Desk */}
              <g transform="translate(60, 72)">
                <polygon points="0,18 16,6 38,6 22,18" fill="#ffffff" stroke="#6d3a68" strokeWidth="1.2" />
                <polygon points="22,18 38,6 60,6 44,18" fill="#faf4e0" stroke="#6d3a68" strokeWidth="1.2" />
                <line x1="8" y1="12" x2="20" y2="12" stroke="#edd6ed" strokeWidth="1" />
                <line x1="30" y1="12" x2="42" y2="12" stroke="#edd6ed" strokeWidth="1" />
              </g>
            </g>

            {/* Desk Surface Line */}
            <line x1="15" y1="115" x2="225" y2="115" stroke="#f7d7cc" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case '03':
      return (
        <div className={`relative w-full h-full bg-gradient-to-b from-[#faf4e0] to-white flex items-center justify-center p-2 overflow-hidden ${className}`}>
          <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Soft Glow */}
            <circle cx="120" cy="70" r="55" fill="#fdf3d6" opacity="0.6" />

            {/* Live Proctoring Webcam Video Window (Behind) */}
            <g transform="translate(135, 14)">
              <rect x="0" y="0" width="75" height="55" rx="8" fill="#ffffff" stroke="#e7b84b" strokeWidth="1.5" />
              <rect x="0" y="0" width="75" height="14" rx="8" fill="#faf4e0" />
              <circle cx="8" cy="7" r="2" fill="#d9775b" />
              <circle cx="14" cy="7" r="2" fill="#e7b84b" />
              <circle cx="20" cy="7" r="2" fill="#6d3a68" />
              {/* Play / Live Cam Icon */}
              <rect x="10" y="20" width="30" height="24" rx="4" fill="#faf5fa" stroke="#edd6ed" strokeWidth="1" />
              <polygon points="22,28 22,36 30,32" fill="#d9775b" />
              {/* Proctoring Verification Badge */}
              <circle cx="56" cy="32" r="10" fill="#fdf6f4" stroke="#d9775b" strokeWidth="1" />
              <path d="M52 32 L55 35 L60 29" stroke="#d9775b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Potted Plant */}
            <g transform="translate(195, 75)">
              <rect x="4" y="15" width="14" height="15" rx="2" fill="#faf4e0" stroke="#e7b84b" strokeWidth="1" />
              <path d="M11 15 C6 8 8 2 11 0 C14 2 16 8 11 15" fill="#e7b84b" />
            </g>

            {/* Student with Headphones taking online exam */}
            <g transform="translate(30, 20)">
              {/* Boy Head */}
              <circle cx="50" cy="38" r="18" fill="#fde8e4" />
              {/* Hair */}
              <path d="M32 34 C32 20 40 16 52 16 C64 16 68 22 68 30 C64 30 62 26 56 26 C50 26 48 30 42 30 C38 30 36 34 32 34 Z" fill="#4e2a4a" />
              {/* Headphones */}
              <path d="M30 36 C30 18 70 18 70 36" stroke="#d9775b" strokeWidth="3" fill="none" />
              <rect x="28" y="32" width="6" height="12" rx="3" fill="#6d3a68" />
              <rect x="66" y="32" width="6" height="12" rx="3" fill="#6d3a68" />
              {/* Face */}
              <circle cx="56" cy="36" r="2" fill="#4e2a4a" />
              <path d="M53 43 Q57 46 60 43" stroke="#d9775b" strokeWidth="1.5" strokeLinecap="round" />
              {/* Boy Shirt */}
              <path d="M30 62 C30 52 42 50 50 50 C58 50 70 52 70 62 L74 95 H26 L30 62 Z" fill="#6d3a68" />
              {/* Arms focused on Laptop */}
              <path d="M30 65 Q45 80 65 78" stroke="#6d3a68" strokeWidth="8" strokeLinecap="round" fill="none" />
              <circle cx="68" cy="78" r="4" fill="#fde8e4" />
              {/* Laptop with test UI */}
              <g transform="translate(60, 60)">
                <polygon points="0,20 18,2 38,2 20,20" fill="#faf4e0" stroke="#4e2a4a" strokeWidth="1.5" />
                <rect x="6" y="7" width="16" height="2" fill="#e7b84b" />
                <rect x="6" y="11" width="22" height="2" fill="#d9775b" />
                <rect x="8" y="20" width="34" height="4" rx="1.5" fill="#edd6ed" stroke="#4e2a4a" strokeWidth="1.2" />
              </g>
            </g>

            {/* Desk Line */}
            <line x1="15" y1="115" x2="225" y2="115" stroke="#f5e7bf" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case '04':
      return (
        <div className={`relative w-full h-full bg-gradient-to-b from-[#faf5fa] to-white flex items-center justify-center p-2 overflow-hidden ${className}`}>
          <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Soft Glow & Confetti */}
            <circle cx="120" cy="70" r="55" fill="#f4ebf4" opacity="0.6" />
            {/* Confetti Particles */}
            <circle cx="35" cy="30" r="2.5" fill="#e7b84b" />
            <polygon points="45,18 48,24 42,24" fill="#d9775b" />
            <rect x="180" y="20" width="4" height="4" fill="#6d3a68" transform="rotate(25 180 20)" />
            <circle cx="210" cy="35" r="2.5" fill="#d9775b" />
            <polygon points="195,45 198,50 192,50" fill="#e7b84b" />

            {/* Gold Trophy Cup on Right */}
            <g transform="translate(170, 52) scale(0.85)">
              <polygon points="12,28 28,28 25,40 15,40" fill="#4e2a4a" />
              <rect x="8" y="40" width="24" height="6" rx="2" fill="#6d3a68" stroke="#4e2a4a" strokeWidth="1" />
              {/* Cup body */}
              <path d="M6 4 C6 22 34 22 34 4 H6 Z" fill="#e7b84b" stroke="#d9775b" strokeWidth="1.5" />
              {/* Handles */}
              <path d="M6 8 C0 8 0 16 6 16" stroke="#d9775b" strokeWidth="2" fill="none" />
              <path d="M34 8 C40 8 40 16 34 16" stroke="#d9775b" strokeWidth="2" fill="none" />
              {/* Star on Trophy */}
              <polygon points="20,8 21,12 25,12 22,14 23,18 20,15 17,18 18,14 15,12 19,12" fill="#faf4e0" />
            </g>

            {/* Happy Student holding Certificate */}
            <g transform="translate(50, 15)">
              {/* Hair Back */}
              <path d="M25 35 C18 45 20 70 25 80 C32 80 38 65 35 45 Z" fill="#4e2a4a" />
              {/* Face */}
              <circle cx="48" cy="36" r="17" fill="#fde8e4" />
              {/* Front Hair */}
              <path d="M32 32 C32 18 40 14 50 14 C60 14 65 20 65 28 C56 24 48 24 40 30 Z" fill="#4e2a4a" />
              <circle cx="54" cy="34" r="2" fill="#4e2a4a" />
              {/* Happy Big Smile */}
              <path d="M50 40 Q55 46 60 40 Z" fill="#d9775b" />
              {/* Girl Purple Dress */}
              <path d="M32 56 C32 48 42 46 50 46 C58 46 68 48 68 56 L72 98 H28 L32 56 Z" fill="#8c4e8b" />
              {/* Raised Arms holding Certificate */}
              <path d="M32 60 Q20 40 35 28" stroke="#8c4e8b" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="36" cy="26" r="4" fill="#fde8e4" />
              
              <path d="M68 60 Q80 40 65 28" stroke="#8c4e8b" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="64" cy="26" r="4" fill="#fde8e4" />

              {/* Certified Diploma / Certificate Document */}
              <g transform="translate(68, 10)">
                <rect x="0" y="0" width="36" height="46" rx="4" fill="#ffffff" stroke="#6d3a68" strokeWidth="1.5" />
                <rect x="6" y="8" width="24" height="3" rx="1" fill="#6d3a68" />
                <rect x="8" y="14" width="20" height="2" rx="1" fill="#edd6ed" />
                <rect x="8" y="18" width="16" height="2" rx="1" fill="#edd6ed" />
                <rect x="8" y="22" width="18" height="2" rx="1" fill="#edd6ed" />
                {/* Gold Seal with Ribbons */}
                <circle cx="18" cy="34" r="6" fill="#e7b84b" stroke="#d9775b" strokeWidth="1" />
                <path d="M15 38 L13 44 L17 42 L21 44 L19 38" fill="#d9775b" />
              </g>
            </g>

            {/* Base Stand Line */}
            <line x1="15" y1="115" x2="225" y2="115" stroke="#edd6ed" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};
