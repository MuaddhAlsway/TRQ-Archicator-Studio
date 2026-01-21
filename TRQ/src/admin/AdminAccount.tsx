import { useState } from 'react';
import { Save, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { changePassword, updateEmail } from '../api';
import { useAdmin } from './AdminContext';

export function AdminAccount() {
  const { user } = useAdmin();
  const [activeTab, setActiveTab] = useState<'email' | 'password'>('email');
  
  // Email state
  const [email, setEmail] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailMessage('');
    setEmailSaving(true);

    try {
      const result = await updateEmail(email);
      if (result.success) {
        setEmailMessage('Email updated successfully');
        setEmail('');
      } else {
        setEmailError(result.message || 'Failed to update email');
      }
    } catch {
      setEmailError('Failed to update email');
    }
    setEmailSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordSaving(true);

    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        setPasswordMessage('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(result.message || 'Failed to change password');
      }
    } catch {
      setPasswordError('Failed to change password');
    }
    setPasswordSaving(false);
  };

  return (
    <div>
      <h1 className="text-3xl tracking-wide mb-8">Account Settings</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-black/5 p-4 flex gap-4">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 text-sm tracking-wider rounded transition-colors ${
              activeTab === 'email' ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'
            }`}
          >
            Email Settings
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 text-sm tracking-wider rounded transition-colors ${
              activeTab === 'password' ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'
            }`}
          >
            Change Password
          </button>
        </div>

        <div className="p-6">
          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="max-w-md">
              <h2 className="text-xl mb-2">Update Email Address</h2>
              <p className="text-black/60 mb-6">
                Your email is used for password recovery. Make sure to keep it up to date.
              </p>

              {emailError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{emailError}</span>
                </div>
              )}

              {emailMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>{emailMessage}</span>
                </div>
              )}

              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">CURRENT USER</label>
                  <p className="text-black/60">{user?.username}</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm tracking-wider">NEW EMAIL ADDRESS</label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Enter new email address"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={emailSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  <Save size={20} />
                  <span>{emailSaving ? 'Saving...' : 'Update Email'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Change Password */}
          {activeTab === 'password' && (
            <div className="max-w-md">
              <h2 className="text-xl mb-2">Change Password</h2>
              <p className="text-black/60 mb-6">
                Choose a strong password with at least 6 characters.
              </p>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>{passwordMessage}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">CURRENT PASSWORD</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm tracking-wider">NEW PASSWORD</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm tracking-wider">CONFIRM NEW PASSWORD</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  <Lock size={20} />
                  <span>{passwordSaving ? 'Changing...' : 'Change Password'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
