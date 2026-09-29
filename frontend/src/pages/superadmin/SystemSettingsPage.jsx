import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Settings, Save, Shield, Award, Mail, Building } from 'lucide-react';
import { Button } from '../../components/Button';

export const SystemSettingsPage = () => {
  const [settings, setSettings] = useState({
    site_name: 'OlympiadHub',
    site_tagline: 'Advanced National Online Examination & Olympiad Platform',
    contact_email: 'support@olympiadhub.com',
    enable_tab_switch_detection: '1',
    default_tab_switch_limit: '3',
    default_passing_percentage: '40.0',
    certificate_organization: 'National Olympiad Examination Authority',
    certificate_signatory_title: 'Director of Academic Examinations'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/settings');
      if (res.success && res.data?.settings) {
        setSettings((prev) => ({ ...prev, ...res.data.settings }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiClient.post('/settings', settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          System & Examination Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure security proctoring defaults, certificate authority branding, and passing criteria.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold animate-fade-in">
          System settings updated successfully in database!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Branding */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Platform Identity & Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Platform Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Support Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div className="col-span-full">
              <label className="block font-bold text-slate-700 uppercase mb-1">Site Tagline</label>
              <input
                type="text"
                value={settings.site_tagline}
                onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Security & Proctoring */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Exam Proctoring & Security Defaults</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Default Tab Switch Limit</label>
              <input
                type="number"
                value={settings.default_tab_switch_limit}
                onChange={(e) => setSettings({ ...settings, default_tab_switch_limit: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Default Passing Threshold (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.default_passing_percentage}
                onChange={(e) => setSettings({ ...settings, default_passing_percentage: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Certificate Branding */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Certificate Authority & Seal Branding</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Issuing Authority Name</label>
              <input
                type="text"
                value={settings.certificate_organization}
                onChange={(e) => setSettings({ ...settings, certificate_organization: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Signatory Title</label>
              <input
                type="text"
                value={settings.certificate_signatory_title}
                onChange={(e) => setSettings({ ...settings, certificate_signatory_title: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" loading={saving} icon={Save}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
