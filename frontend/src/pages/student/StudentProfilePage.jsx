import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { User, Lock, Mail, Phone, Shield, Save } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const StudentProfilePage = () => {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setFeedback({ type: '', message: '' });
    try {
      await apiClient.post('/auth/update-profile', profileForm);
      setUser({ ...user, ...profileForm });
      setFeedback({ type: 'success', message: 'Profile details updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setSavingPassword(true);
    setFeedback({ type: '', message: '' });
    try {
      await apiClient.post('/auth/change-password', passwordForm);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setFeedback({ type: 'success', message: 'Account password changed successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Account Profile & Security
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, email address, and update your security credentials.
        </p>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-md">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.full_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono font-bold text-brand-600">{user?.login_id}</span>
              <Badge variant="primary" size="sm">{user?.class_name || 'Enrolled Student'}</Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 pt-6 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={profileForm.full_name}
              onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
              className="w-full px-3.5 py-2.5 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" loading={savingProfile} icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Security Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-600" />
          Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Current Password</label>
            <input
              type="password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 border rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" loading={savingPassword} icon={Lock}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
