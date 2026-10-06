import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { User, Lock, Mail, Phone, Shield, Save, Camera, Upload, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const StudentProfilePage = () => {
  const { user, setUser, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    school_name: user?.school_name || user?.school || '',
    class_name: user?.class_name || user?.class || user?.grade || 'Class 6',
    avatar: user?.avatar || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Handle local image file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (PNG, JPG, JPEG, WebP).' });
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Image size exceeds 5MB limit. Please choose a smaller photo.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      setAvatarPreview(base64Data);
      setProfileForm((prev) => ({ ...prev, avatar: base64Data }));
      setFeedback({ type: 'success', message: 'Image selected! Click "Save Profile Changes" to update.' });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setProfileForm((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFeedback({ type: 'success', message: 'Photo removed. Click "Save Profile Changes" to confirm.' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setFeedback({ type: '', message: '' });
    try {
      const updatedData = {
        ...profileForm,
        school: profileForm.school_name,
        class: profileForm.class_name
      };
      await apiClient.post('/auth/update-profile', updatedData);
      if (updateUser) {
        updateUser({ ...user, ...updatedData });
      } else {
        setUser({ ...user, ...updatedData });
      }
      setFeedback({ type: 'success', message: 'Profile & School details updated successfully!' });
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
          {user?.role === 'superadmin'
            ? 'Super Administrator Profile & Security'
            : user?.role === 'teacher'
            ? 'Faculty Profile & Security'
            : 'Student Profile & School Details'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, school name, profile picture, and security credentials.
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
        {/* Profile Avatar & Upload Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {/* Avatar with Camera Trigger */}
            <div className="relative group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={user?.full_name || 'Profile Avatar'}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-50 border border-indigo-100 shadow-md transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
                </div>
              )}

              {/* Quick Camera Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change Photo"
                className="absolute -bottom-1.5 -right-1.5 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg border-2 border-white cursor-pointer transition-all hover:scale-110"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">{profileForm.full_name || user?.full_name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {user?.login_id || (user?.role === 'superadmin' ? 'SUPERADMIN' : 'USER001')}
                </span>
                <Badge variant="primary" size="sm">
                  {user?.role === 'superadmin'
                    ? 'Super Administrator'
                    : user?.role === 'teacher'
                    ? (user?.designation || 'Faculty Member')
                    : (profileForm.class_name || user?.class_name || 'Class 6 Student')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Upload / Remove Actions */}
          <div className="flex items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 cursor-pointer transition-all hover:shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{avatarPreview ? 'Change Photo' : 'Upload Image'}</span>
            </button>

            {avatarPreview && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 cursor-pointer transition-all"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 pt-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">School Name</label>
              <input
                type="text"
                required
                placeholder="Enter your school name (e.g. Delhi Public School)"
                value={profileForm.school_name}
                onChange={(e) => setProfileForm({ ...profileForm, school_name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-indigo-200 rounded-xl bg-indigo-50/20 font-bold text-slate-800 focus:bg-white focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Class / Grade</label>
              <select
                value={profileForm.class_name}
                onChange={(e) => setProfileForm({ ...profileForm, class_name: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl bg-white font-bold"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
                ))}
              </select>
            </div>

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
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className="w-full px-3.5 py-2.5 border rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="text-[11px] text-slate-400">
              Supports JPG, PNG, WebP up to 5MB
            </p>
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
