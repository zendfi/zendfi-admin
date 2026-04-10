'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { ActionButton, InlineMessage, Panel, ShellTitle, StatusPill } from '@/components/ops-ui';

type FlaggedPayment = {
  id: string;
  merchant_name?: string | null;
  merchant_email?: string | null;
  customer_email?: string | null;
  amount_usd: number;
  status?: string | null;
  transaction_signature?: string | null;
  mode?: string | null;
  is_onramp: boolean;
  flag_reason?: string | null;
  flagged_at?: string | null;
};

type FlaggedResponse = {
  flagged_payments: FlaggedPayment[];
  count: number;
};

export default function TransactionsPage() {
  const [rows, setRows] = useState<FlaggedPayment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const data = await apiRequest<FlaggedResponse>('/admin/payments/flagged');
      setRows(data.flagged_payments);
    } catch {
      setError('Failed to load flagged payments');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function action(paymentId: string, kind: 'verify' | 'settle' | 'redrive') {
    setLoadingId(paymentId);
    setError(null);
    try {
      if (kind === 'verify') {
        await apiRequest(`/admin/payments/${paymentId}/retry-verify`, { method: 'POST' });
      } else if (kind === 'settle') {
        await apiRequest(`/admin/payments/${paymentId}/retry-settle-onramp`, { method: 'POST' });
      } else {
        await apiRequest(`/admin/payments/${paymentId}/redrive-verification-jobs`, { method: 'POST' });
      }
      await load();
    } catch {
      setError('Recovery action failed');
    }
    setLoadingId(null);
  }

  return (
    <div className="space-y-4 max-w-7xl">
      <ShellTitle
        title="Flagged Payment Recovery"
        subtitle="Manual intervention lane for verification, onramp settlement retry, and job redrive"
        action={<ActionButton variant="primary" onClick={load}>Refresh Queue</ActionButton>}
      />

      {error && <InlineMessage kind="error">{error}</InlineMessage>}

      <Panel title="Recovery Queue" subtitle="Prioritize items by reason and payment mode">
        <div className="overflow-auto">
        <table className="w-full text-sm ops-table">
          <thead>
            <tr style={{ color: 'var(--text-muted)' }}>
              <th className="text-left py-2">Payment</th>
              <th className="text-left py-2">Merchant</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Reason</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="py-2 font-mono text-xs">{r.id.slice(0, 8)}...</td>
                <td className="py-2">{r.merchant_name ?? r.merchant_email ?? '-'}</td>
                <td className="py-2">${r.amount_usd.toFixed(2)}</td>
                <td className="py-2"><StatusPill tone={r.status === 'failed' ? 'danger' : 'warn'}>{r.status ?? '-'}</StatusPill></td>
                <td className="py-2 max-w-72">{r.flag_reason ?? '-'}</td>
                <td className="py-2 space-x-2">
                  <ActionButton
                    className="inline-flex"
                    disabled={loadingId === r.id}
                    onClick={() => action(r.id, 'verify')}
                  >
                    Retry Verify
                  </ActionButton>
                  <ActionButton
                    variant="primary"
                    className="inline-flex"
                    disabled={loadingId === r.id || !r.is_onramp}
                    onClick={() => action(r.id, 'settle')}
                  >
                    Retry Settle
                  </ActionButton>
                  <ActionButton
                    variant="danger"
                    className="inline-flex"
                    disabled={loadingId === r.id}
                    onClick={() => action(r.id, 'redrive')}
                  >
                    Redrive Jobs
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Panel>
    </div>
  );
}
