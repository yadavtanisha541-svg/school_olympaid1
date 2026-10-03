import React, { useState } from 'react';
import { BarChart3, Search, Award, CheckCircle, Download, ShieldCheck, Printer } from 'lucide-react';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';

const DEMO_SCORECARDS = {
  'IMO-2026-8841': {
    rollNumber: 'IMO-2026-8841',
    studentName: 'Aanya Sharma',
    className: 'Class 5',
    schoolName: 'Delhi Public School, R.K. Puram, New Delhi',
    olympiadName: 'International Mathematics Olympiad',
    examDate: '18 Dec 2026',
    score: 58,
    totalMarks: 60,
    accuracy: 96.6,
    nationalRank: 1,
    stateRank: 1,
    schoolRank: 1,
    percentile: 99.94,
    award: 'Gold Medal of Excellence + National Merit Trophy',
    status: 'Qualified for Level 2 Grand Finale',
    sections: [
      { name: 'Section 1: Mathematical Reasoning', score: 20, max: 20 },
      { name: 'Section 2: Everyday Mathematics', score: 20, max: 20 },
      { name: 'Section 3: Achievers HOTS Section', score: 18, max: 20 }
    ]
  },
  'NSO-2026-1022': {
    rollNumber: 'NSO-2026-1022',
    studentName: 'Kabir Verma',
    className: 'Class 8',
    schoolName: 'The Mother’s International School, New Delhi',
    olympiadName: 'National Science Olympiad',
    examDate: '12 Dec 2026',
    score: 54,
    totalMarks: 60,
    accuracy: 90.0,
    nationalRank: 3,
    stateRank: 1,
    schoolRank: 1,
    percentile: 98.85,
    award: 'Bronze Medal + Certificate of Outstanding Merit',
    status: 'Qualified for Level 2 Grand Finale',
    sections: [
      { name: 'Section 1: Scientific Reasoning', score: 18, max: 20 },
      { name: 'Section 2: Practical Science', score: 20, max: 20 },
      { name: 'Section 3: Achievers Hotspot', score: 16, max: 20 }
    ]
  }
};

export const PublicResultsPage = ({ onNavigatePublic, onOpenLogin, onOpenRegister }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [resultData, setResultData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const cleanRoll = rollNumber.trim().toUpperCase();
      if (DEMO_SCORECARDS[cleanRoll]) {
        setResultData(DEMO_SCORECARDS[cleanRoll]);
      } else if (cleanRoll.length >= 4) {
        // Generate simulated scorecard for any valid test format
        setResultData({
          rollNumber: cleanRoll,
          studentName: 'Candidate ' + cleanRoll.slice(-4),
          className: 'Class 6',
          schoolName: 'National Public School, Indiranagar, Bengaluru',
          olympiadName: 'International Mathematics Olympiad',
          examDate: '18 Dec 2026',
          score: 52,
          totalMarks: 60,
          accuracy: 88.5,
          nationalRank: 14,
          stateRank: 3,
          schoolRank: 1,
          percentile: 96.2,
          award: 'Silver Medal + Certificate of Merit',
          status: 'Qualified for Level 2 Grand Finale',
          sections: [
            { name: 'Section 1: Reasoning', score: 18, max: 20 },
            { name: 'Section 2: Core Subject', score: 18, max: 20 },
            { name: 'Section 3: Achievers HOTS', score: 16, max: 20 }
          ]
        });
      } else {
        setErrorMsg('Please enter a valid Roll Number or Registration ID (e.g. IMO-2026-8841)');
      }
    }, 600);
  };

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#4e2a4a] via-[#6d3a68] to-[#8c4e8b] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Official Scorecard &amp; Rank Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Check Olympiad Results &amp; Student Performance Report
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-3xl leading-relaxed">
            Enter your Roll Number / Registration ID to view your section-wise score, national rank, percentile, and digital merit certificate.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Search Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-lg">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                  Roll Number / Registration ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. IMO-2026-8841"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                  Date of Birth / Security PIN (Optional)
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Tip: Try demo roll numbers <strong className="text-[#6d3a68] cursor-pointer" onClick={() => setRollNumber('IMO-2026-8841')}>IMO-2026-8841</strong> or <strong className="text-[#6d3a68] cursor-pointer" onClick={() => setRollNumber('NSO-2026-1022')}>NSO-2026-1022</strong>
              </span>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-[#d9775b] to-[#c85e42] hover:from-[#c85e42] hover:to-[#a74a32] text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-[#d9775b]/30 cursor-pointer"
              >
                {loading ? 'Fetching Scorecard...' : 'View Scorecard →'}
              </button>
            </div>
          </form>
        </div>

        {/* Scorecard Results Display */}
        {resultData && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#edd6ed] shadow-xl mt-8 space-y-8 animate-in fade-in duration-200">
            {/* Top Student Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f4ebf4]">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#f4ebf4] text-[#6d3a68] text-xs font-black uppercase tracking-wider">
                  Official Scorecard (2026-27)
                </span>
                <h2 className="text-2xl font-black text-[#4e2a4a] mt-2">{resultData.studentName}</h2>
                <p className="text-xs text-slate-500">{resultData.schoolName}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
                <button
                  onClick={() => onNavigatePublic('certificates-info')}
                  className="px-4 py-2 bg-[#6d3a68] hover:bg-[#5c3158] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#e7b84b]" />
                  <span>Verify Certificate</span>
                </button>
              </div>
            </div>

            {/* Core Ranks & Score Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#faf5fa] p-4 rounded-2xl border border-[#edd6ed]">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Marks</span>
                <p className="text-2xl font-black text-[#6d3a68] mt-1">{resultData.score} / {resultData.totalMarks}</p>
                <span className="text-[10px] text-slate-500">{resultData.accuracy}% Accuracy</span>
              </div>

              <div className="bg-[#FAF4E0] p-4 rounded-2xl border border-[#e7b84b]/40">
                <span className="text-[10px] font-bold text-[#8c4e8b] uppercase">National Rank</span>
                <p className="text-2xl font-black text-[#6d3a68] mt-1">#{resultData.nationalRank}</p>
                <span className="text-[10px] text-[#8c4e8b]">All India Rank</span>
              </div>

              <div className="bg-[#faf5fa] p-4 rounded-2xl border border-[#edd6ed]">
                <span className="text-[10px] font-bold text-slate-400 uppercase">State / Zonal Rank</span>
                <p className="text-2xl font-black text-[#d9775b] mt-1">#{resultData.stateRank}</p>
                <span className="text-[10px] text-slate-500">Regional Tier</span>
              </div>

              <div className="bg-[#faf5fa] p-4 rounded-2xl border border-[#edd6ed]">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Percentile</span>
                <p className="text-2xl font-black text-[#4e2a4a] mt-1">{resultData.percentile}%</p>
                <span className="text-[10px] text-slate-500">Top Tier Achiever</span>
              </div>
            </div>

            {/* Sectional Performance */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#4e2a4a] uppercase tracking-wider">
                Section-wise Mark Breakdown
              </h3>
              <div className="space-y-3">
                {resultData.sections.map((sec, idx) => (
                  <div key={idx} className="bg-[#faf5fa] p-4 rounded-2xl border border-[#edd6ed] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4e2a4a]">{sec.name}</p>
                      <p className="text-[10px] text-slate-400">Standardized Assessment Unit</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#6d3a68]">{sec.score} / {sec.max}</p>
                      <span className="text-[10px] font-bold text-[#d9775b]">
                        {Math.round((sec.score / sec.max) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Award & Qualification Box */}
            <div className="bg-gradient-to-r from-[#faf5fa] to-[#FAF4E0] rounded-2xl p-6 border border-[#e7b84b]/50 flex items-start gap-4">
              <Award className="w-8 h-8 text-[#e7b84b] shrink-0 mt-1" />
              <div>
                <span className="text-[10px] font-black uppercase text-[#8c4e8b] tracking-wider">Recognition &amp; Honors</span>
                <h4 className="text-base font-black text-[#4e2a4a] mt-0.5">{resultData.award}</h4>
                <p className="text-xs text-slate-600 mt-1">{resultData.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
