import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo auth - in production, use proper authentication
    if (email === 'admin@trq.design' && password === 'admin123') {
      localStorage.setItem('trq_admin_auth', 'true');
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl tracking-[0.2em] mb-2">TRQ</h1>
            <p className="text-black/60">Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm tracking-wider">EMAIL</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="admin@trq.design"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm tracking-wider">PASSWORD</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider"
            >
              SIGN IN
            </button>
          </form>

          <p className="text-center text-sm text-black/40 mt-6">
            Demo: admin@trq.design / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
