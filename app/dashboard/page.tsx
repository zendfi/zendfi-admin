'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

type DashboardResponse = {
  platform_metrics: {
    total_merchants: number;
    active_merchants_30d: number;
    new_merchants_30d: number;
    total_payments: number;
    total_volume_usd: number;
    payments_today: number;
    volume_today: number;
  };
  payment_breakdown: {
    pending: number;
    confirmed: number;
    failed: number;
    expired: number;
  };
  growth_metrics: {
    volume_growth_30d_percent: number;
    volume_30d: number;
    volume_prev_30d: number;
  };
  fraud_metrics: {
    total_flags_today: number;
    unresolved_flags: number;
    blocked_wallets: number;
    blocked_ips: number;
    high_risk_payments_today: number;
    estimated_fraud_prevented_usd: number;
  };
  dispute_metrics: {
    open_disputes: number;
    resolved_customer_favor: number;
    resolved_merchant_favor: number;
  };
  refund_metrics: {
    pending: number;
    completed: number;
  };
};

export default function OverviewPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<DashboardResponse>('/admin/dashboard')
      .then(setData)
      .catch(() => setError('Failed to load dashboard metrics'));
  }, []);

  if (error) return <p className="text-red-400 text-sm">{error}</p>;
  if (!data) return <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>;

  const cards = [
    ['Total Merchants', data.platform_metrics.total_merchants],
    ['Active (30d)', data.platform_metrics.active_merchants_30d],
    ['Total Payments', data.platform_metrics.total_payments],
    ['Payments Today', data.platform_metrics.payments_today],
    ['Volume Today (USD)', data.platform_metrics.volume_today.toFixed(2)],
    ['30d Growth %', data.growth_metrics.volume_growth_30d_percent.toFixed(2)],
    ['Fraud Flags Today', data.fraud_metrics.total_flags_today],
    ['Unresolved Flags', data.fraud_metrics.unresolved_flags],
    ['Blocked Wallets', data.fraud_metrics.blocked_wallets],
    ['Open Disputes', data.dispute_metrics.open_disputes],
    ['Refunds Pending', data.refund_metrics.pending],
    ['Refunds Completed', data.refund_metrics.completed],
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-3">
        {cards.map(([label, value]) => (
          <div key={label} className="glass-card rounded-xl p-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-2xl font-bold mt-1">{String(value)}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2">Payment Breakdown</h3>
          <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <li>Pending: {data.payment_breakdown.pending}</li>
            <li>Confirmed: {data.payment_breakdown.confirmed}</li>
            <li>Failed: {data.payment_breakdown.failed}</li>
            <li>Expired: {data.payment_breakdown.expired}</li>
          </ul>
        </div>

        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2">Fraud Snapshot</h3>
          <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <li>High-risk payments today: {data.fraud_metrics.high_risk_payments_today}</li>
            <li>Blocked IPs: {data.fraud_metrics.blocked_ips}</li>
            <li>Estimated fraud prevented (USD): {data.fraud_metrics.estimated_fraud_prevented_usd.toFixed(2)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
