'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiRequest, ApiError } from '@/lib/api';

type SettingsTab = 'general' | 'notifications' | 'security' | 'events' | 'api_keys';

type GeneralSettings = {
  business_name: string;
  support_email: string;
  website_url?: string | null;
  timezone: string;
  maintenance_mode: boolean;
  live_mode: boolean;
};

type Channel = { email: boolean; sms: boolean; push: boolean };

type NotificationsSettings = {
  transaction_failures: Channel;
  compliance_alerts: Channel;
  settlement_completed: Channel;
  new_support_ticket: Channel;
  security_events: Channel;
  system_downtime: Channel;
  weekly_report: Channel;
};

type SecurityPolicy = {
  session_timeout_minutes: number;
  require_2fa: boolean;
  password_policy: string;
  allowed_ip_ranges: string[];
};

type SecurityEvent = {
  id: string;
  action: string;
  admin_id: string;
  admin_email?: string | null;
  resource_type?: string | null;
  status: string;
  ip_address?: string | null;
  created_at: string;
  details: unknown;
};

type ApiKeyItem = {
  id: string;
  merchant_id: string;
  merchant_name?: string | null;
  merchant_email?: string | null;
  mode: string;
  is_active: boolean;
  created_at: string;
  last_used_at?: string | null;
  key_preview: string;
};

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [general, setGeneral] = useState<GeneralSettings | null>(null);
  const [notifications, setNotifications] = useState<NotificationsSettings | null>(null);
  const [security, setSecurity] = useState<SecurityPolicy | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [rotatedSecret, setRotatedSecret] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [g, n, s, ev, keys] = await Promise.all([
        apiRequest<GeneralSettings>('/admin/settings/general'),
        apiRequest<NotificationsSettings>('/admin/settings/notifications'),
        apiRequest<SecurityPolicy>('/admin/settings/security-policy'),
        apiRequest<SecurityEvent[]>('/admin/settings/security-events'),
        apiRequest<ApiKeyItem[]>('/admin/settings/api-keys'),
      ]);

      setGeneral(g);
      setNotifications(n);
      setSecurity(s);
      setEvents(ev);
      setApiKeys(keys);
    } catch (e) {
      setError(e instanceof ApiError ? `Failed loading settings (${e.status})` : 'Failed loading settings');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const tabs = useMemo(
    () => [
      { key: 'general' as const, label: 'General' },
      { key: 'notifications' as const, label: 'Notifications' },
      { key: 'security' as const, label: 'Security Policy' },
      { key: 'events' as const, label: 'Security Events' },
      { key: 'api_keys' as const, label: 'API Keys' },
    ],
    [],
  );

  async function saveGeneral() {
    if (!general) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await apiRequest<GeneralSettings>('/admin/settings/general', {
        method: 'PATCH',
        body: general,
      });
      setGeneral(updated);
      setSuccess('General settings saved.');
    } catch (e) {
      setError(e instanceof ApiError ? `Save failed (${e.status})` : 'Save failed');
    }
    setSaving(false);
  }

  async function saveNotifications() {
    if (!notifications) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await apiRequest<NotificationsSettings>('/admin/settings/notifications', {
        method: 'PATCH',
        body: notifications,
      });
      setNotifications(updated);
      setSuccess('Notifications settings saved.');
    } catch (e) {
      setError(e instanceof ApiError ? `Save failed (${e.status})` : 'Save failed');
    }
    setSaving(false);
  }

  async function saveSecurity() {
    if (!security) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await apiRequest<SecurityPolicy>('/admin/settings/security-policy', {
        method: 'PATCH',
        body: security,
      });
      setSecurity(updated);
      setSuccess('Security policy saved.');
    } catch (e) {
      setError(e instanceof ApiError ? `Save failed (${e.status})` : 'Save failed');
    }
    setSaving(false);
  }

  async function rotateApiKey(id: string) {
    setError(null);
    setSuccess(null);
    try {
      const result = await apiRequest<{ key: string; message: string }>(`/admin/settings/api-keys/${id}/rotate`, {
        method: 'POST',
      });
      setRotatedSecret(result.key);
      setSuccess(result.message);
      const keys = await apiRequest<ApiKeyItem[]>('/admin/settings/api-keys');
      setApiKeys(keys);
    } catch (e) {
      setError(e instanceof ApiError ? `Rotate failed (${e.status})` : 'Rotate failed');
    }
  }

  function updateChannel(group: keyof NotificationsSettings, field: keyof Channel, value: boolean) {
    if (!notifications) return;
    setNotifications({
      ...notifications,
      [group]: {
        ...notifications[group],
        [field]: value,
      },
    });
  }

  if (loading) {
    return <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading settings...</div>;
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`px-3 py-1.5 rounded-lg text-xs border ${tab === t.key ? 'bg-violet-500/20 text-violet-300 border-violet-400/40' : ''}`}
            style={{
              borderColor: tab === t.key ? '' : 'var(--border)',
              color: tab === t.key ? '' : 'var(--text-secondary)',
            }}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}
      {success && <div className="text-sm text-emerald-400">{success}</div>}

      {tab === 'general' && general && (
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold">General</h2>
          <input className="input-field w-full px-3 py-2" value={general.business_name} onChange={(e) => setGeneral({ ...general, business_name: e.target.value })} placeholder="Business name" />
          <input className="input-field w-full px-3 py-2" value={general.support_email} onChange={(e) => setGeneral({ ...general, support_email: e.target.value })} placeholder="Support email" />
          <input className="input-field w-full px-3 py-2" value={general.website_url ?? ''} onChange={(e) => setGeneral({ ...general, website_url: e.target.value })} placeholder="Website URL" />
          <input className="input-field w-full px-3 py-2" value={general.timezone} onChange={(e) => setGeneral({ ...general, timezone: e.target.value })} placeholder="Timezone" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={general.maintenance_mode} onChange={(e) => setGeneral({ ...general, maintenance_mode: e.target.checked })} /> Maintenance mode</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={general.live_mode} onChange={(e) => setGeneral({ ...general, live_mode: e.target.checked })} /> Live mode</label>
          <button className="px-3 py-2 rounded-lg bg-violet-600 text-white text-sm" disabled={saving} onClick={saveGeneral}>{saving ? 'Saving...' : 'Save general'}</button>
        </div>
      )}

      {tab === 'notifications' && notifications && (
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold">Notifications</h2>
          {(Object.keys(notifications) as Array<keyof NotificationsSettings>).map((group) => (
            <div key={group} className="border rounded-lg p-3" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{group}</p>
              <div className="flex gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {(['email', 'sms', 'push'] as Array<keyof Channel>).map((field) => (
                  <label key={field} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications[group][field]}
                      onChange={(e) => updateChannel(group, field, e.target.checked)}
                    />
                    {field}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="px-3 py-2 rounded-lg bg-violet-600 text-white text-sm" disabled={saving} onClick={saveNotifications}>{saving ? 'Saving...' : 'Save notifications'}</button>
        </div>
      )}

      {tab === 'security' && security && (
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold">Security Policy</h2>
          <label className="text-sm">Session timeout (minutes)</label>
          <input type="number" className="input-field w-full px-3 py-2" value={security.session_timeout_minutes} onChange={(e) => setSecurity({ ...security, session_timeout_minutes: Number(e.target.value) })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={security.require_2fa} onChange={(e) => setSecurity({ ...security, require_2fa: e.target.checked })} /> Require 2FA</label>
          <label className="text-sm">Password policy</label>
          <input className="input-field w-full px-3 py-2" value={security.password_policy} onChange={(e) => setSecurity({ ...security, password_policy: e.target.value })} />
          <label className="text-sm">Allowed IP ranges (comma-separated)</label>
          <input
            className="input-field w-full px-3 py-2"
            value={security.allowed_ip_ranges.join(', ')}
            onChange={(e) => setSecurity({ ...security, allowed_ip_ranges: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
          />
          <button className="px-3 py-2 rounded-lg bg-violet-600 text-white text-sm" disabled={saving} onClick={saveSecurity}>{saving ? 'Saving...' : 'Save security policy'}</button>
        </div>
      )}

      {tab === 'events' && (
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-3">Security Events</h2>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Action</th>
                  <th className="text-left py-2">Admin</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">IP</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2">{new Date(ev.created_at).toLocaleString()}</td>
                    <td className="py-2">{ev.action}</td>
                    <td className="py-2">{ev.admin_email ?? ev.admin_id}</td>
                    <td className="py-2">{ev.status}</td>
                    <td className="py-2">{ev.ip_address ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'api_keys' && (
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold">API Keys (Masked)</h2>
          {rotatedSecret && (
            <div className="rounded-lg p-3 text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <p className="font-semibold text-amber-400">One-time key output</p>
              <p className="font-mono break-all mt-1">{rotatedSecret}</p>
            </div>
          )}
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left py-2">Preview</th>
                  <th className="text-left py-2">Merchant</th>
                  <th className="text-left py-2">Mode</th>
                  <th className="text-left py-2">Created</th>
                  <th className="text-left py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((k) => (
                  <tr key={k.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2 font-mono">{k.key_preview}</td>
                    <td className="py-2">{k.merchant_name ?? k.merchant_email ?? k.merchant_id}</td>
                    <td className="py-2">{k.mode}</td>
                    <td className="py-2">{new Date(k.created_at).toLocaleString()}</td>
                    <td className="py-2">
                      <button className="px-2 py-1 rounded bg-violet-600 text-white text-xs" onClick={() => rotateApiKey(k.id)}>
                        Rotate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
