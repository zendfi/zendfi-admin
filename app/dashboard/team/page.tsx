'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiRequest, ApiError } from '@/lib/api';
import { ActionButton, InlineMessage, MetricTile, Panel, ShellTitle, StatusPill } from '@/components/ops-ui';

type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'support';
  is_active: boolean;
  created_at: string;
};

type CreateAdminPayload = {
  email: string;
  full_name: string;
  password: string;
  role: 'super_admin' | 'admin' | 'support';
};

export default function TeamPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<CreateAdminPayload>({
    email: '',
    full_name: '',
    password: '',
    role: 'support',
  });

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<AdminUser[]>('/admin/users');
      setUsers(data);
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to load users (${e.status})` : 'Failed to load users');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const roleCounts = useMemo(() => {
    return {
      super_admin: users.filter((u) => u.role === 'super_admin').length,
      admin: users.filter((u) => u.role === 'admin').length,
      support: users.filter((u) => u.role === 'support').length,
    };
  }, [users]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await apiRequest<AdminUser>('/admin/users', {
        method: 'POST',
        body: form,
      });
      setSuccess('Admin user created.');
      setForm({ email: '', full_name: '', password: '', role: 'support' });
      await loadUsers();
    } catch (e) {
      setError(e instanceof ApiError ? `Create failed (${e.status})` : 'Create failed');
    }

    setSaving(false);
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <ShellTitle title="Operator Access Control" subtitle="Provision admin users and inspect role composition" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricTile label="Super Admin" value={roleCounts.super_admin} tone="danger" />
        <MetricTile label="Admin" value={roleCounts.admin} tone="warn" />
        <MetricTile label="Support" value={roleCounts.support} tone="info" />
      </div>

      {error && <InlineMessage kind="error">{error}</InlineMessage>}
      {success && <InlineMessage kind="success">{success}</InlineMessage>}

      <Panel title="Create Operator" subtitle="Use least privilege. Super-admin should remain tightly controlled.">
      <form onSubmit={onCreate} className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="input-field px-3 py-2"
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <input
            className="input-field px-3 py-2"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input-field px-3 py-2"
            type="password"
            placeholder="Temp password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="input-field px-3 py-2"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as CreateAdminPayload['role'] })}
          >
            <option value="support">support</option>
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </select>
        </div>
        <ActionButton variant="primary" disabled={saving}>
          {saving ? 'Creating...' : 'Create user'}
        </ActionButton>
      </form>
      </Panel>

      <Panel title="Current Operators" subtitle="Review role distribution and account activation state">
        {loading ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading users...</p>
        ) : (
          <div className="overflow-auto">
          <table className="w-full text-sm ops-table">
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Active</th>
                <th className="text-left py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2">{u.full_name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">
                    <StatusPill tone={u.role === 'super_admin' ? 'danger' : u.role === 'admin' ? 'warn' : 'info'}>{u.role}</StatusPill>
                  </td>
                  <td className="py-2">
                    <StatusPill tone={u.is_active ? 'ok' : 'danger'}>{u.is_active ? 'active' : 'inactive'}</StatusPill>
                  </td>
                  <td className="py-2">{new Date(u.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
