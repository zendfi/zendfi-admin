'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { InlineMessage, MetricTile, Panel, ShellTitle, StatusPill } from '@/components/ops-ui';

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

  if (error) return <InlineMessage kind="error">{error}</InlineMessage>;
  if (!data) return <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>;

  return (
    <div className="space-y-5 max-w-7xl">
      <ShellTitle
        title="Ops Snapshot"
        subtitle="Realtime command summary across throughput, fraud posture, disputes, and refunds"
      />

      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricTile label="Merchants" value={data.platform_metrics.total_merchants} delta={`${data.platform_metrics.new_merchants_30d} new / 30d`} tone="info" />
        <MetricTile label="Active 30d" value={data.platform_metrics.active_merchants_30d} />
        <MetricTile label="Payments Today" value={data.platform_metrics.payments_today} />
        <MetricTile label="Total Payments" value={data.platform_metrics.total_payments} />
        <MetricTile label="Volume Today" value={`$${data.platform_metrics.volume_today.toFixed(2)}`} tone="ok" />
        <MetricTile label="30d Growth" value={`${data.growth_metrics.volume_growth_30d_percent.toFixed(2)}%`} tone={data.growth_metrics.volume_growth_30d_percent >= 0 ? 'ok' : 'warn'} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Payment Breakdown" subtitle="Current distribution by processing status">
          <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <li>Pending: {data.payment_breakdown.pending}</li>
            <li>Confirmed: {data.payment_breakdown.confirmed}</li>
            <li>Failed: {data.payment_breakdown.failed}</li>
            <li>Expired: {data.payment_breakdown.expired}</li>
          </ul>
        </Panel>

        <Panel title="Fraud Posture" subtitle="Live risk indicators and fraud prevention effectiveness">
          <div className="flex flex-wrap gap-2 mb-3">
            <StatusPill tone="warn">Flags today: {data.fraud_metrics.total_flags_today}</StatusPill>
            <StatusPill tone="danger">Unresolved: {data.fraud_metrics.unresolved_flags}</StatusPill>
            <StatusPill tone="info">Blocked wallets: {data.fraud_metrics.blocked_wallets}</StatusPill>
          </div>
          <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <li>High-risk payments today: {data.fraud_metrics.high_risk_payments_today}</li>
            <li>Blocked IPs: {data.fraud_metrics.blocked_ips}</li>
            <li>Estimated fraud prevented (USD): {data.fraud_metrics.estimated_fraud_prevented_usd.toFixed(2)}</li>
          </ul>
        </Panel>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Disputes" subtitle="Current case outcomes">
          <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
            <p>Open: {data.dispute_metrics.open_disputes}</p>
            <p>Resolved customer favor: {data.dispute_metrics.resolved_customer_favor}</p>
            <p>Resolved merchant favor: {data.dispute_metrics.resolved_merchant_favor}</p>
          </div>
        </Panel>

        <Panel title="Refunds" subtitle="Pending and completed counts">
          <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
            <p>Pending: {data.refund_metrics.pending}</p>
            <p>Completed: {data.refund_metrics.completed}</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
