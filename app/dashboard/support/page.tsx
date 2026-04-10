'use client';

import { useState } from 'react';
import { ApiError, apiRequest } from '@/lib/api';
import { ActionButton, InlineMessage, Panel, ShellTitle, StatusPill } from '@/components/ops-ui';

type MerchantLookup = {
  merchant: {
    id: string;
    name: string;
    email: string;
    wallet_address: string;
    live_access_enabled: boolean;
    webhook_url?: string | null;
    created_at: string;
  };
  stats?: {
    total_payments?: number;
    confirmed_payments?: number;
    total_volume_usd?: string;
    last_payment_at?: string | null;
  };
  api_keys?: Array<{
    id: string;
    mode: string;
    is_active: boolean;
    created_at: string;
    last_used_at?: string | null;
  }>;
};

type SecurityEventsResponse = {
  events: Array<{
    event_type?: string;
    severity?: string;
    created_at?: string;
    details?: unknown;
  }>;
};

type TimelineResponse = {
  timeline: Array<{
    period: string;
    total_requests: number;
    successful_requests: number;
    blocked_requests: number;
    avg_response_time_ms: number;
  }>;
};

export default function SupportPage() {
  const [email, setEmail] = useState('');
  const [merchantData, setMerchantData] = useState<MerchantLookup | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventsResponse['events']>([]);
  const [timeline, setTimeline] = useState<TimelineResponse['timeline']>([]);

  const [disputeId, setDisputeId] = useState('');
  const [outcome, setOutcome] = useState<'merchant_favor' | 'customer_favor' | 'closed'>('merchant_favor');
  const [resolutionNotes, setResolutionNotes] = useState('resolved via support console');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function findMerchant() {
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const lookup = await apiRequest<MerchantLookup>(`/admin/merchants/by-email?email=${encodeURIComponent(email.trim())}`);
      setMerchantData(lookup);

      const [eventsData, timelineData] = await Promise.all([
        apiRequest<SecurityEventsResponse>(`/admin/audit/merchants/${lookup.merchant.id}/security-events`),
        apiRequest<TimelineResponse>(`/admin/audit/merchants/${lookup.merchant.id}/timeline`),
      ]);
      setSecurityEvents(eventsData.events ?? []);
      setTimeline(timelineData.timeline ?? []);
    } catch (e) {
      setMerchantData(null);
      setSecurityEvents([]);
      setTimeline([]);
      setError(e instanceof ApiError ? `Support lookup failed (${e.status})` : 'Support lookup failed');
    }
    setBusy(false);
  }

  async function resolveDispute() {
    if (!disputeId.trim()) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await apiRequest(`/admin/disputes/${disputeId.trim()}/resolve`, {
        method: 'POST',
        body: { outcome, resolution_notes: resolutionNotes || null },
      });
      setSuccess('Dispute resolved successfully');
      setDisputeId('');
    } catch (e) {
      setError(e instanceof ApiError ? `Dispute resolution failed (${e.status})` : 'Dispute resolution failed');
    }
    setBusy(false);
  }

  return (
    <div className="space-y-4 max-w-7xl">
      <ShellTitle
        title="Support Operations"
        subtitle="Merchant diagnostics, security event context, and dispute resolution lane"
        action={<ActionButton variant="primary" onClick={findMerchant}>Refresh Merchant Context</ActionButton>}
      />

      {error && <InlineMessage kind="error">{error}</InlineMessage>}
      {success && <InlineMessage kind="success">{success}</InlineMessage>}

      <Panel title="Merchant Support Lookup" subtitle="Load account context to investigate incidents quickly" className="space-y-3">
        <div className="flex gap-2">
          <input
            className="input-field flex-1 px-3 py-2"
            placeholder="merchant@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ActionButton disabled={busy} onClick={findMerchant}>Search</ActionButton>
        </div>

        {merchantData && (
          <div className="border rounded-lg p-3" style={{ borderColor: 'var(--border)' }}>
            <p className="font-medium">{merchantData.merchant.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{merchantData.merchant.email}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Wallet: {merchantData.merchant.wallet_address}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Live access: <StatusPill tone={merchantData.merchant.live_access_enabled ? 'ok' : 'warn'}>{merchantData.merchant.live_access_enabled ? 'enabled' : 'disabled'}</StatusPill>
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Total payments: {merchantData.stats?.total_payments ?? 0} | Confirmed: {merchantData.stats?.confirmed_payments ?? 0} | Volume: {merchantData.stats?.total_volume_usd ?? '0'}
            </p>
          </div>
        )}
      </Panel>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Security Events" subtitle="Recent security-relevant events for selected merchant">
          <div className="overflow-auto max-h-72">
            <table className="w-full text-sm ops-table">
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Severity</th>
                </tr>
              </thead>
              <tbody>
                {securityEvents.map((event, idx) => (
                  <tr key={`${event.created_at}-${idx}`} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2">{event.created_at ? new Date(event.created_at).toLocaleString() : '-'}</td>
                    <td className="py-2">{event.event_type ?? '-'}</td>
                    <td className="py-2">{event.severity ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="API Usage Timeline (24h)" subtitle="Traffic stability and abuse/blocked signals">
          <div className="overflow-auto max-h-72">
            <table className="w-full text-sm ops-table">
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left py-2">Period</th>
                  <th className="text-left py-2">Requests</th>
                  <th className="text-left py-2">Success</th>
                  <th className="text-left py-2">Blocked</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((row, idx) => (
                  <tr key={`${row.period}-${idx}`} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2">{row.period}</td>
                    <td className="py-2">{row.total_requests}</td>
                    <td className="py-2">{row.successful_requests}</td>
                    <td className="py-2">{row.blocked_requests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <Panel title="Dispute Resolution" subtitle="Resolve support escalations directly from admin console" className="space-y-3">
        <div className="grid md:grid-cols-4 gap-2">
          <input
            className="input-field px-3 py-2 md:col-span-2"
            placeholder="Dispute UUID"
            value={disputeId}
            onChange={(e) => setDisputeId(e.target.value)}
          />
          <select className="input-field px-3 py-2" value={outcome} onChange={(e) => setOutcome(e.target.value as 'merchant_favor' | 'customer_favor' | 'closed')}>
            <option value="merchant_favor">merchant_favor</option>
            <option value="customer_favor">customer_favor</option>
            <option value="closed">closed</option>
          </select>
          <ActionButton variant="primary" disabled={busy} onClick={resolveDispute}>Resolve</ActionButton>
        </div>
        <input
          className="input-field w-full px-3 py-2"
          placeholder="Resolution notes"
          value={resolutionNotes}
          onChange={(e) => setResolutionNotes(e.target.value)}
        />
      </Panel>
    </div>
  );
}
