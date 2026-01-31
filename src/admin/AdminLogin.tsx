import { useState } from 'react';
import { Lock, User, AlertCircle, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { forgotPassword, resetPassword } from '../api';

type View = 'login' | 'forgot' | 'reset' | 'success';

export function AdminLogin() {
  const { login } = useAdmin();
  const [view, setView] = useState<View>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for reset token in URL
  useState(() => {
    const hash = window.location.hash;
    if (hash.includes('reset-password')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      const token = params.get('token');
      if (token) {
        setView('reset');
        sessionStorage.setItem('reset_token', token);
      }
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setMessage('If the email exists, a reset link has been sent. Check your inbox.');
      } else {
        setError(result.message || 'Failed to send reset email');
      }
    } catch {
      setError('Failed to send reset email');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('reset_token');
      if (!token) {
        setError('Invalid reset token');
        setLoading(false);
        return;
      }

      const result = await resetPassword(token, newPassword);
      if (result.success) {
        sessionStorage.removeItem('reset_token');
        setView('success');
        // Clear the URL hash
        window.location.hash = '#admin';
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch {
      setError('Failed to reset password');
    }
    setLoading(false);
  };

  // Success view after password reset
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
        <div className="bg-white p-8 w-full max-w-md text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-medium mb-2">Password Reset Successful</h2>
          <p className="text-black/60 mb-6">Your password has been changed. You can now sign in with your new password.</p>
          <button
            onClick={() => setView('login')}
            className="w-full py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider"
          >
            SIGN IN
          </button>
        </div>
      </div>
    );
  }

  // Reset password view
  if (view === 'reset') {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
        <div className="bg-white p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl tracking-[0.2em] mb-2">TRQ</h1>
            <p className="text-black/60">Reset Password</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
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
              <label className="block mb-2 text-sm tracking-wider">CONFIRM PASSWORD</label>
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
              disabled={loading}
              className="w-full py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider disabled:opacity-50"
            >
              {loading ? 'RESETTING...' : 'RESET PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Forgot password view
  if (view === 'forgot') {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
        <div className="bg-white p-8 w-full max-w-md">
          <button
            onClick={() => { setView('login'); setError(''); setMessage(''); }}
            className="flex items-center gap-2 text-black/60 hover:text-black mb-6"
          >
            <ArrowLeft size={20} />
            Back to login
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl tracking-[0.2em] mb-2">TRQ</h1>
            <p className="text-black/60">Forgot Password</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 flex items-center gap-2">
              <CheckCircle size={20} />
              <span>{message}</span>
            </div>
          )}

          <p className="text-black/60 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm tracking-wider">EMAIL</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider disabled:opacity-50"
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Login view
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
      <div className="bg-white p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl tracking-[0.2em] mb-2">TRQ</h1>
          <p className="text-black/60">Admin Panel</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm tracking-wider">USERNAME</label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm tracking-wider">PASSWORD</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider disabled:opacity-50"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <button
          onClick={() => { setView('forgot'); setError(''); }}
          className="w-full text-center text-sm text-black/60 hover:text-black mt-4"
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}
