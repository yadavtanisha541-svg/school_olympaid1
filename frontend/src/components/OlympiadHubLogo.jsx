import React from 'react';

export const OlympiadHubLogo = ({ size = 'md', showTagline = false, light = false, onClick }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer transition-transform active:scale-95' : ''}`}
    >
      {/* Geometric Original Crest Logo */}
      <div className={`relative ${iconSizes[size] || iconSizes.md} rounded-2xl p-0.5 bg-gradient-to-br from-[#80497D] via-[#C35B3F] to-[#e7b84b] shadow-md shadow-[#80497D]/20 flex items-center justify-center shrink-0`}>
        <div className="w-full h-full bg-[#fff9f2] rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#dcbfdc]/40 via-transparent to-[#f5e7bf]/50 pointer-events-none" />

          {/* SVG Vector Trophy + Orbit + Star */}
          <svg viewBox="0 0 40 40" className="w-[82%] h-[82%] drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Orbital ring */}
            <path
              d="M6 23C7.5 14 14 7 24 8C31 8.8 35 14.5 34 20C33 25.5 27 33 16 32"
              stroke="#C35B3F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="1 0"
            />
            {/* Trophy Cup base & body */}
            <path
              d="M13 11H27V19C27 23.4 23.8 26.5 20 26.5C16.2 26.5 13 23.4 13 19V11Z"
              fill="url(#trophyGrad)"
            />
            {/* Trophy handles */}
            <path
              d="M13 13H10C8.5 13 7.5 14.5 7.5 16C7.5 18 9 19.5 11 19.5H13"
              stroke="#80497D"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M27 13H30C31.5 13 32.5 14.5 32.5 16C32.5 18 31 19.5 29 19.5H27"
              stroke="#80497D"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Pedestal */}
            <path
              d="M18 26.5V30H22V26.5"
              stroke="#80497D"
              strokeWidth="2"
            />
            <rect x="14" y="30" width="12" height="3" rx="1.5" fill="#80497D" />
            
            {/* Golden Star / Diamond in center */}
            <path
              d="M20 13.5L21.2 16.5L24.2 16.8L21.8 18.8L22.5 21.8L20 20.2L17.5 21.8L18.2 18.8L15.8 16.8L18.8 16.5L20 13.5Z"
              fill="#e7b84b"
            />

            <defs>
              <linearGradient id="trophyGrad" x1="13" y1="11" x2="27" y2="26.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#80497D" />
                <stop offset="0.7" stopColor="#a46da2" />
                <stop offset="1" stopColor="#C35B3F" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div
          className={`font-black tracking-tight leading-none ${textSizes[size] || textSizes.md} flex items-center`}
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', 'Inter', sans-serif" }}
        >
          <span className={light ? 'text-white' : 'text-[#422240]'}>Skill</span>
          <span className="text-[#C35B3F]">Rise</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e7b84b] ml-1 mb-1 animate-pulse" />
        </div>
        <span
          className={`text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase leading-tight mt-0.5 ${
            light ? 'text-[#dcbfdc]' : 'text-[#80497D]'
          }`}
          style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
        >
          OLYMPIAD
        </span>
        {showTagline && (
          <span className={`text-[9px] font-bold tracking-wider uppercase mt-0.5 ${light ? 'text-[#ebd7eb]/80' : 'text-[#80497D]/80'}`}>
            Learn • Practice • Compete • Achieve
          </span>
        )}
      </div>
    </div>
  );
};
