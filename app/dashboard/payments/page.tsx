'use client';

import { useEffect, useState } from 'react';
import { ApiError, apiRequest } from '@/lib/api';
import { ActionButton, InlineMessage, Panel, ShellTitle, StatusPill } from '@/components/ops-ui';

type SetupFeePayment = {
  id: string;
  merchant_id: string;
  merchant_name?: string | null;
  merchant_email?: string | null;
  amount_usd: number;
  payment_method: string;
  status: string;
  created_at: string;
  completed_at?: string | null;
};

type SetupFeeResponse = {
  payments: SetupFeePayment[];
  total: number;
  limit: number;
  offset: number;
};

type MerchantLookupResponse = {
  merchant: {
    id: string;
    name: string;
    email: string;
    live_access_enabled: boolean;
  };
};

type SettlementRow = {
  id: string;
  payment_id: string;
  payment_token?: string | null;
  settlement_token?: string | null;
  amount_settled?: string | null;
  status?: string | null;
  provider?: string | null;
  created_at: string;
  completed_at?: string | null;
  transaction_signature?: string | null;
};

export default function PaymentsPage() {
  const [setupFees, setSetupFees] = useState<SetupFeePayment[]>([]);
  const [statusFilter, setStatusFilter] = useState('');

  const [lookupEmail, setLookupEmail] = useState('');
  const [merchant, setMerchant] = useState<MerchantLookupResponse['merchant'] | null>(null);
  const [settlements, setSettlements] = useState<SettlementRow[]>([]);
  const [grantReason, setGrantReason] = useState('manual_enable_from_admin_console');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadSetupFees() {
    setError(null);
    const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    try {
      const data = await apiRequest<SetupFeeResponse>(`/admin/setup-fees${query}`);
      setSetupFees(data.payments);
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to load setup-fee payments (${e.status})` : 'Failed to load setup-fee payments');
    }
  }

  useEffect(() => {
    loadSetupFees();
  }, []);

  async function findMerchant() {
    if (!lookupEmail.trim()) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await apiRequest<MerchantLookupResponse>(`/admin/merchants/by-email?email=${encodeURIComponent(lookupEmail.trim())}`);
      setMerchant(data.merchant);
      const rows = await apiRequest<SettlementRow[]>(`/admin/settlements/${data.merchant.id}`);
      setSettlements(rows);
    } catch (e) {
      setMerchant(null);
      setSettlements([]);
      setError(e instanceof ApiError ? `Merchant lookup failed (${e.status})` : 'Merchant lookup failed');
    }
    setBusy(false);
  }

  async function grantLiveAccess() {
    if (!merchant) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await apiRequest('/admin/setup-fees/enable', {
        method: 'POST',
        body: { merchant_id: merchant.id, reason: grantReason || 'manual_enable_from_admin_console' },
      });
      setSuccess('Live access enabled for merchant');
      await findMerchant();
      await loadSetupFees();
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to enable live access (${e.status})` : 'Failed to enable live access');
    }
    setBusy(false);
  }

  async function disableLiveAccess() {
    if (!merchant) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await apiRequest(`/admin/setup-fees/disable/${merchant.id}`, { method: 'POST' });
      setSuccess('Live access disabled for merchant');
      await findMerchant();
      await loadSetupFees();
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to disable live access (${e.status})` : 'Failed to disable live access');
    }
    setBusy(false);
  }

  return (
    <div className="space-y-4 max-w-7xl">
      <ShellTitle
        title="Payments And Settlement Operations"
        subtitle="Merchant enablement, setup-fee governance, and settlement audit lane"
        action={<ActionButton variant="primary" onClick={loadSetupFees}>Refresh</ActionButton>}
      />

      {error && <InlineMessage kind="error">{error}</InlineMessage>}
      {success && <InlineMessage kind="success">{success}</InlineMessage>}

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Merchant Lookup" subtitle="Find merchant and execute access-control actions">
          <div className="flex gap-2">
            <input
              className="input-field flex-1 px-3 py-2"
              placeholder="merchant@email.com"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
            />
            <ActionButton onClick={findMerchant} disabled={busy}>Find</ActionButton>
          </div>

          {merchant && (
            <div className="border rounded-lg p-3 space-y-2" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-medium">{merchant.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{merchant.email}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Live access: <StatusPill tone={merchant.live_access_enabled ? 'ok' : 'warn'}>{merchant.live_access_enabled ? 'enabled' : 'disabled'}</StatusPill>
              </p>
              <input
                className="input-field w-full px-3 py-2"
                placeholder="Grant reason"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
              />
              <div className="flex gap-2">
                <ActionButton variant="primary" onClick={grantLiveAccess} disabled={busy}>Enable Live Access</ActionButton>
                <ActionButton variant="danger" onClick={disableLiveAccess} disabled={busy}>Disable Live Access</ActionButton>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Settlement History" subtitle="Recent settlements for selected merchant">
          <div className="overflow-auto max-h-72">
            <table className="w-full text-sm ops-table">
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left py-2">Settlement</th>
                  <th className="text-left py-2">Token</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">When</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((s) => (
                  <tr key={s.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2 font-mono text-xs">{s.id.slice(0, 8)}...</td>
                    <td className="py-2">{s.settlement_token ?? s.payment_token ?? '-'}</td>
                    <td className="py-2">{s.amount_settled ?? '-'}</td>
                    <td className="py-2">{s.status ?? '-'}</td>
                    <td className="py-2">{new Date(s.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <Panel title="Setup Fee Payments" subtitle="Track lifecycle of setup fee collection and admin grants">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <input
              className="input-field px-2 py-1 text-xs"
              placeholder="status filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <ActionButton variant="primary" onClick={loadSetupFees}>Apply</ActionButton>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm ops-table">
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="text-left py-2">Payment</th>
                <th className="text-left py-2">Merchant</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Method</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {setupFees.map((p) => (
                <tr key={p.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2 font-mono text-xs">{p.id.slice(0, 8)}...</td>
                  <td className="py-2">{p.merchant_name ?? p.merchant_email ?? '-'}</td>
                  <td className="py-2">${Number(p.amount_usd).toFixed(2)}</td>
                  <td className="py-2">{p.payment_method}</td>
                  <td className="py-2">{p.status}</td>
                  <td className="py-2">{new Date(p.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
