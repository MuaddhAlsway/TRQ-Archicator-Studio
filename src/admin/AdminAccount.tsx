import { useState, useEffect } from 'react';
import { Save, Lock, Mail, AlertCircle, CheckCircle, Link2, Plus, X } from 'lucide-react';
import { changePassword, updateEmail, getSettings, updateSettings } from '../api';
import { useAdmin } from './AdminContext';

export function AdminAccount() {
  const { user } = useAdmin();
  const [activeTab, setActiveTab] = useState<'email' | 'password' | 'quicklinks'>('email');
  
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

  // Quick Links state
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [companyProfileUrl, setCompanyProfileUrl] = useState('');
  const [quickLinks, setQuickLinks] = useState<Array<{ label: string; url: string }>>([]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [quickLinksSaving, setQuickLinksSaving] = useState(false);
  const [quickLinksMessage, setQuickLinksMessage] = useState('');
  const [quickLinksError, setQuickLinksError] = useState('');
  const [quickLinksLoading, setQuickLinksLoading] = useState(true);

  // Load quick links on mount
  useEffect(() => {
    loadQuickLinks();
  }, []);

  const loadQuickLinks = async () => {
    try {
      const settings = await getSettings();
      setWhatsappNumber(settings.emailQuickLinksWhatsapp || '');
      setCompanyProfileUrl(settings.emailQuickLinksCompanyProfile || '');
      const links = settings.emailQuickLinksCustom ? JSON.parse(settings.emailQuickLinksCustom) : [];
      setQuickLinks(links);
    } catch (error) {
      console.error('Failed to load quick links:', error);
    }
    setQuickLinksLoading(false);
  };

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

  const handleAddQuickLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) {
      setQuickLinksError('Please fill in both label and URL');
      return;
    }

    if (!newLinkUrl.startsWith('http://') && !newLinkUrl.startsWith('https://')) {
      setQuickLinksError('URL must start with http:// or https://');
      return;
    }

    setQuickLinks([...quickLinks, { label: newLinkLabel, url: newLinkUrl }]);
    setNewLinkLabel('');
    setNewLinkUrl('');
    setQuickLinksError('');
  };

  const handleRemoveQuickLink = (index: number) => {
    setQuickLinks(quickLinks.filter((_, i) => i !== index));
  };

  const handleSaveQuickLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickLinksError('');
    setQuickLinksMessage('');

    if (!whatsappNumber.trim()) {
      setQuickLinksError('WhatsApp number is required');
      return;
    }

    if (!companyProfileUrl.trim()) {
      setQuickLinksError('Company profile URL is required');
      return;
    }

    setQuickLinksSaving(true);

    try {
      const result = await updateSettings({
        emailQuickLinksWhatsapp: whatsappNumber,
        emailQuickLinksCompanyProfile: companyProfileUrl,
        emailQuickLinksCustom: JSON.stringify(quickLinks),
      });

      if (result.success) {
        setQuickLinksMessage('Quick links updated successfully');
      } else {
        setQuickLinksError(result.message || 'Failed to update quick links');
      }
    } catch (error) {
      setQuickLinksError('Failed to update quick links');
    }
    setQuickLinksSaving(false);
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
          <button
            onClick={() => setActiveTab('quicklinks')}
            className={`px-4 py-2 text-sm tracking-wider rounded transition-colors ${
              activeTab === 'quicklinks' ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'
            }`}
          >
            Quick Links
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
          {/* Quick Links */}
          {activeTab === 'quicklinks' && (
            <div className="max-w-2xl">
              <h2 className="text-xl mb-2">Email Quick Links</h2>
              <p className="text-black/60 mb-6">
                Customize the quick links that appear in email templates sent to clients.
              </p>

              {quickLinksError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{quickLinksError}</span>
                </div>
              )}

              {quickLinksMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>{quickLinksMessage}</span>
                </div>
              )}

              {quickLinksLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <form onSubmit={handleSaveQuickLinks} className="space-y-6">
                  {/* WhatsApp Number */}
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">WHATSAPP NUMBER</label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="e.g., 966501234567"
                      required
                    />
                    <p className="text-xs text-black/50 mt-1">Include country code without + symbol</p>
                  </div>

                  {/* Company Profile URL */}
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">COMPANY PROFILE URL</label>
                    <input
                      type="url"
                      value={companyProfileUrl}
                      onChange={(e) => setCompanyProfileUrl(e.target.value)}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="https://example.com/profile"
                      required
                    />
                  </div>

                  {/* Custom Quick Links */}
                  <div className="border-t border-black/10 pt-6">
                    <h3 className="text-lg mb-4 tracking-wide">Custom Quick Links</h3>
                    
                    {/* Add New Link */}
                    <div className="bg-black/5 p-4 rounded mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block mb-2 text-sm tracking-wider">LINK TITLE</label>
                          <input
                            type="text"
                            value={newLinkLabel}
                            onChange={(e) => setNewLinkLabel(e.target.value)}
                            className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="e.g., View Portfolio"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm tracking-wider">LINK URL</label>
                          <input
                            type="url"
                            value={newLinkUrl}
                            onChange={(e) => setNewLinkUrl(e.target.value)}
                            className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddQuickLink}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-black/80 transition-colors text-sm"
                      >
                        <Plus size={18} />
                        <span>Add Link</span>
                      </button>
                    </div>

                    {/* List of Quick Links */}
                    {quickLinks.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <h4 className="text-sm tracking-wider text-black/60">ADDED LINKS ({quickLinks.length})</h4>
                        {quickLinks.map((link, index) => (
                          <div key={index} className="flex items-center justify-between bg-black/5 p-4 rounded">
                            <div className="flex items-center gap-3 flex-1">
                              <Link2 size={18} className="text-black/40" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{link.label}</p>
                                <p className="text-xs text-black/50 truncate">{link.url}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuickLink(index)}
                              className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="border-t border-black/10 pt-6">
                    <button
                      type="submit"
                      disabled={quickLinksSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                    >
                      <Save size={20} />
                      <span>{quickLinksSaving ? 'Saving...' : 'Save Quick Links'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
