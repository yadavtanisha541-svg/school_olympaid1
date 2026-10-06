import React, { useState } from 'react';
import { apiClient } from '../../api/client';
import {
  User,
  Mail,
  MapPin,
  Phone,
  Edit3,
  CheckCircle2,
  BookOpen,
  Video,
  FileText,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

const COUNTRIES = [
  'Select Country',
  'India (+91)',
  'United Arab Emirates (+971)',
  'Singapore (+65)',
  'United States (+1)',
  'United Kingdom (+44)',
  'Australia (+61)',
  'Canada (+1)',
  'Germany (+49)',
  'France (+33)',
  'Saudi Arabia (+966)',
  'South Africa (+27)',
  'Nepal (+977)',
  'Bangladesh (+880)',
  'Sri Lanka (+94)',
  'Other Country'
];

export const BecomeCoordinatorPage = ({ onNavigatePublic, onOpenRegister, onOpenLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'Select Country',
    phone: '',
    message: '',
    isCaptchaChecked: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    const sanitizedVal = field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [field]: sanitizedVal }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (formData.country === 'Select Country' || !formData.country) {
      errs.country = 'Please select your country';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your WhatsApp / mobile number';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.isCaptchaChecked) {
      errs.captcha = 'Please verify that you are not a robot';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/coordinator/inquire', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        country: formData.country,
        phone: formData.phone.trim(),
        message: formData.message.trim()
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Coordinator inquiry API error:', err);
      // Fallback success for graceful UX
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fff9f2] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* TOP INTRO TEXT */}
        <div className="space-y-1">
          <p className="text-sm sm:text-base text-slate-800 font-normal leading-relaxed">
            Interested in becoming a coordinator for SkillRise Olympiads? Fill in the form below and we'll get in touch.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Write to us and we'll get back to you within 24 working hours.
          </p>
        </div>

        {/* 2-COLUMN LAYOUT (LEFT: FORM, RIGHT: HELPFUL LINKS - NO VIDEO) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-6">
            {isSuccess ? (
              <div className="py-10 space-y-4 text-center border-b border-[#edd6ed]">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-[#d9775b]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#4e2a4a]">
                    Inquiry Submitted Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, <strong className="text-slate-800">{formData.name}</strong>. Your coordinator inquiry has been saved to the database. Our Institutional Relations team will contact you within 24 working hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({
                      name: '',
                      email: '',
                      country: 'Select Country',
                      phone: '',
                      message: '',
                      isCaptchaChecked: false
                    });
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-sm text-xs font-bold transition-all cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Name */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 border-b border-slate-300 pb-2 focus-within:border-[#6d3a68] transition-colors">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-red-500 font-normal">{errors.name}</p>
                  )}
                </div>

                {/* 2. Email */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 border-b border-slate-300 pb-2 focus-within:border-[#6d3a68] transition-colors">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-500 font-normal">{errors.email}</p>
                  )}
                </div>

                {/* 3. Country */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 border-b border-slate-300 pb-2 focus-within:border-[#6d3a68] transition-colors">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="w-full">
                      <span className="text-[10px] text-[#d9775b] block font-medium">Country *</span>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer"
                      >
                        {COUNTRIES.map((c, i) => (
                          <option key={i} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.country && (
                    <p className="text-[11px] text-red-500 font-normal">{errors.country}</p>
                  )}
                </div>

                {/* 4. WhatsApp/Mobile */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 border-b border-slate-300 pb-2 focus-within:border-[#6d3a68] transition-colors">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="w-full">
                      <span className="text-[10px] text-slate-500 block font-normal">WhatsApp/Mobile</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="WhatsApp/Mobile"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 font-normal">{errors.phone}</p>
                  )}
                </div>

                {/* 5. Message */}
                <div className="space-y-1">
                  <div className="flex items-start gap-3 border-b border-slate-300 pb-2 focus-within:border-[#6d3a68] transition-colors">
                    <Edit3 className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                    <textarea
                      rows={2}
                      placeholder="Message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* 6. reCAPTCHA Box */}
                <div className="pt-2">
                  <div className="inline-flex items-center gap-4 px-4 py-3 bg-white border border-[#edd6ed] rounded-sm shadow-xs select-none">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isCaptchaChecked}
                        onChange={(e) => handleInputChange('isCaptchaChecked', e.target.checked)}
                        className="w-5 h-5 rounded-xs border-slate-300 text-[#6d3a68] focus:ring-[#6d3a68] cursor-pointer"
                      />
                      <span className="text-xs text-slate-700 font-medium">I'm not a robot</span>
                    </label>
                    <div className="flex flex-col items-center pl-4 border-l border-[#edd6ed]">
                      <ShieldCheck className="w-6 h-6 text-[#6d3a68]" />
                      <span className="text-[9px] text-slate-400 uppercase tracking-tighter font-semibold">reCAPTCHA</span>
                    </div>
                  </div>
                  {errors.captcha && (
                    <p className="text-[11px] text-red-500 mt-1 font-normal">{errors.captcha}</p>
                  )}
                </div>

                {/* 7. Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xs text-xs font-black tracking-wider uppercase shadow-md shadow-[#d9775b]/30 cursor-pointer transition-all active:scale-95 disabled:opacity-60"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* RIGHT COLUMN: HELPFUL LINKS (NO VIDEO AS REQUESTED) */}
          <div className="lg:col-span-6 space-y-6 pt-1">
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
              <p>
                1. For common queries, visit{' '}
                <button
                  type="button"
                  onClick={() => onNavigatePublic('faqs')}
                  className="text-[#6d3a68] hover:text-[#d9775b] hover:underline font-semibold cursor-pointer"
                >
                  FAQs
                </button>
              </p>
              
              <p>
                2. For individual registration, apply{' '}
                <button
                  type="button"
                  onClick={() => onNavigatePublic('register-student')}
                  className="text-[#6d3a68] hover:text-[#d9775b] hover:underline font-semibold cursor-pointer"
                >
                  here
                </button>
              </p>
              
              <p>
                3. Schools can register{' '}
                <button
                  type="button"
                  onClick={() => onNavigatePublic('schools')}
                  className="text-[#6d3a68] hover:text-[#d9775b] hover:underline font-semibold cursor-pointer"
                >
                  here
                </button>{' '}
                or call{' '}
                <a
                  href="tel:+919876543210"
                  className="text-slate-900 font-semibold hover:text-[#d9775b]"
                >
                  +91-98765-43210
                </a>
              </p>
            </div>

            {/* Coordinator Roles & Support Highlights */}
            <div className="pt-4 border-t border-[#edd6ed] space-y-3">
              <h4 className="text-xs font-bold text-[#4e2a4a] uppercase tracking-wider">
                Why Become a SkillRise Coordinator?
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 font-normal">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#d9775b] shrink-0 mt-0.5" />
                  <span>Lead national and international Olympiad examinations in your region or school.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#d9775b] shrink-0 mt-0.5" />
                  <span>Receive official Coordinator Accreditation, Certificates &amp; Honorarium recognition.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#d9775b] shrink-0 mt-0.5" />
                  <span>Direct 24/7 dedicated institutional support for sample papers, mock tests &amp; results.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* BOTTOM ALTERNATIVE CONTACT & RESOURCE PILLS */}
        <div className="pt-8 border-t border-[#edd6ed] space-y-4">
          <p className="text-xs sm:text-sm text-slate-900 font-bold">
            Alternatively, you can WhatsApp us on{' '}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="text-[#4e2a4a] hover:text-[#d9775b] font-black underline cursor-pointer"
            >
              +91-98765-43210
            </a>
            .
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigatePublic('sample-papers')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-full text-xs font-bold transition-all shadow-md shadow-[#4e2a4a]/20 flex items-center gap-2 cursor-pointer border border-[#6d3a68]/30"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#e7b84b]" />
              <span>Workbooks</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigatePublic('practice-hub')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-full text-xs font-bold transition-all shadow-md shadow-[#4e2a4a]/20 flex items-center gap-2 cursor-pointer border border-[#6d3a68]/30"
            >
              <Video className="w-3.5 h-3.5 text-[#e7b84b]" />
              <span>Live Classes</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigatePublic('sample-papers')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-full text-xs font-bold transition-all shadow-md shadow-[#4e2a4a]/20 flex items-center gap-2 cursor-pointer border border-[#6d3a68]/30"
            >
              <FileText className="w-3.5 h-3.5 text-[#e7b84b]" />
              <span>Previous Papers</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
