import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ContactPage = ({ onNavigatePublic }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support &amp; Contact Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Get in Touch with the SkillRise Olympiad Helpdesk
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding examination registration, slot scheduling, school partnerships, or roll numbers? We are here to assist.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#edd6ed] shadow-lg">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-[#f4ebf4] pb-4">
                    <h2 className="text-xl font-black text-[#4e2a4a]">Send Us an Inquiry</h2>
                    <p className="text-xs text-slate-500 mt-1">Our academic coordinators reply within 2 to 4 business hours.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Singhania"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vikram@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="9876543210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                        Inquiry Category *
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a]"
                      >
                        <option>General Inquiry</option>
                        <option>Registration &amp; Fee Support</option>
                        <option>Exam Slot Rescheduling</option>
                        <option>School Affiliation &amp; Bulk Upload</option>
                        <option>Scorecard &amp; Certificate Verification</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                        Your Message / Issue Details *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Please provide details about your inquiry..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xl text-xs font-black shadow-lg shadow-[#d9775b]/30 cursor-pointer"
                    >
                      Send Message →
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-[#faf4e0] text-[#e7b84b] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#d9775b]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#4e2a4a]">Thank You, {form.name}!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Your inquiry has been logged under Ticket #TKT-{Math.floor(10000 + Math.random() * 90000)}. Our support coordinator will reach out to <strong>{form.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Contact Info Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-6">
              <h3 className="text-sm font-black text-[#4e2a4a] uppercase tracking-wider">
                Support Channels
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#faf5fa] flex items-center justify-center text-[#6d3a68] shrink-0">
                    <Mail className="w-4 h-4 text-[#d9775b]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#4e2a4a]">Email Support</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">support@skillrise.org</p>
                    <p className="text-slate-500 text-[11px]">admissions@skillrise.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#faf4e0] flex items-center justify-center text-[#8c4e8b] shrink-0">
                    <Phone className="w-4 h-4 text-[#e7b84b]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#4e2a4a]">Helpline Numbers</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">+91 11 4988 2000</p>
                    <p className="text-slate-500 text-[11px]">+91 98110 45220 (WhatsApp Support)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#faf5fa] flex items-center justify-center text-[#6d3a68] shrink-0">
                    <Clock className="w-4 h-4 text-[#6d3a68]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#4e2a4a]">Operational Hours</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM IST</p>
                    <p className="text-slate-500 text-[11px]">Sunday: Special Exam Support Only</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#faf5fa] flex items-center justify-center text-[#6d3a68] shrink-0">
                    <MapPin className="w-4 h-4 text-[#d9775b]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#4e2a4a]">Examination Headquarters</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Academic Examination Bureau, Global Knowledge Corridor, New Delhi 110001, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
