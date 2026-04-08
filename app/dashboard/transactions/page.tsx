'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

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
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Flagged Payments Recovery</h2>
        <button className="px-2 py-1 rounded bg-violet-600 text-white text-xs" onClick={load}>Refresh</button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="glass-card rounded-xl p-4 overflow-auto">
        <table className="w-full text-sm">
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
                <td className="py-2">{r.status ?? '-'}</td>
                <td className="py-2">{r.flag_reason ?? '-'}</td>
                <td className="py-2 space-x-2">
                  <button
                    className="px-2 py-1 text-xs rounded bg-cyan-700 text-white"
                    disabled={loadingId === r.id}
                    onClick={() => action(r.id, 'verify')}
                  >
                    Retry Verify
                  </button>
                  <button
                    className="px-2 py-1 text-xs rounded bg-emerald-700 text-white"
                    disabled={loadingId === r.id || !r.is_onramp}
                    onClick={() => action(r.id, 'settle')}
                  >
                    Retry Settle
                  </button>
                  <button
                    className="px-2 py-1 text-xs rounded bg-amber-700 text-white"
                    disabled={loadingId === r.id}
                    onClick={() => action(r.id, 'redrive')}
                  >
                    Redrive Jobs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
