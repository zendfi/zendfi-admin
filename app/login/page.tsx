'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, hydrateCsrfToken } from '@/lib/api';
import { setAuthSession, type AdminProfile } from '@/lib/auth';

type LoginResponse = {
  token: string;
  expires_at: string;
  admin: AdminProfile;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest<LoginResponse>('/admin/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      });

      setAuthSession(data.token, data.admin);
      await hydrateCsrfToken();
      router.replace('/dashboard');
    } catch (err) {
      setError('Login failed. Check credentials and try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
      <form onSubmit={onSubmit} className="glass-card rounded-2xl p-8 w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>ZendFi Admin</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to continue</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full px-3 py-2"
            placeholder="admin@zendfi.tech"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
