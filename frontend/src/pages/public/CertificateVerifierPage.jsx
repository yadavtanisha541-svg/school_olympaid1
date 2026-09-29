import React, { useState } from 'react';
import { apiClient } from '../../api/client';
import { Search, ShieldCheck, AlertCircle, ArrowLeft, Award, CheckCircle2, User, Calendar, FileText } from 'lucide-react';
import { Button } from '../../components/Button';
import { CertificateView } from '../../components/CertificateView';

export const CertificateVerifierPage = ({ onBackToLogin }) => {
  const [certCode, setCertCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certCode.trim()) {
      setError('Please enter a Certificate ID or verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await apiClient.get('/certificates-verify', { code: certCode.trim() });
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'No valid examination certificate found matching the provided ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-lg shadow-md">
            Ω
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Olympiad<span className="text-brand-400">Hub</span>
          </span>
        </div>

        {onBackToLogin && (
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBackToLogin} className="text-slate-300 hover:text-white">
            Back to Sign In
          </Button>
        )}
      </div>

      {/* Search Canvas */}
      <div className="max-w-3xl mx-auto w-full my-auto z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Official Certificate Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Verify the authenticity and integrity of national examination credentials and merit certificates issued by OlympiadHub.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleVerify} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 bg-slate-800/90 p-2.5 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certCode}
                onChange={(e) => setCertCode(e.target.value)}
                placeholder="Enter Certificate ID (e.g. OLY-2026-X7K9P2)"
                className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <Button
              type="submit"
              loading={loading}
              icon={ShieldCheck}
              className="py-3 px-6 text-sm font-bold shadow-lg shadow-brand-500/20"
            >
              Verify Credential
            </Button>
          </div>
        </form>

        {/* Error Feedback */}
        {error && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-300 text-xs flex items-center gap-3 animate-shake mb-6">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Verified Result Modal/Card */}
        {result && result.certificate && (
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Certificate Authenticity Verified</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {result.certificate.certificate_number}</p>
              </div>
            </div>

            <CertificateView certificate={result.certificate} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 z-10 pt-8">
        © {new Date().getFullYear()} OlympiadHub National Examination Authority. All cryptographic hashes securely logged.
      </div>
    </div>
  );
};
