'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { ActionButton, InlineMessage, Panel, ShellTitle, StatusPill } from '@/components/ops-ui';

type DlqEntry = {
  id: string;
  merchant_id: string;
  payment_id: string;
  webhook_url: string;
  total_attempts: number;
  failure_reason: string;
  last_response_code?: number | null;
  resolution_status: string;
  last_failure_at: string;
};

type MetricsRow = {
  merchant_id: string;
  event_type: string;
  total_webhooks?: number | null;
  delivered_count?: number | null;
  failed_count?: number | null;
  exhausted_count?: number | null;
  dlq_count?: number | null;
  success_rate_percent?: number | null;
};

export default function WebhooksPage() {
  const [dlq, setDlq] = useState<DlqEntry[]>([]);
  const [metrics, setMetrics] = useState<MetricsRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const [dlqData, metricData] = await Promise.all([
        apiRequest<DlqEntry[]>('/admin/webhooks/dlq'),
        apiRequest<MetricsRow[]>('/admin/webhooks/metrics'),
      ]);
      setDlq(dlqData);
      setMetrics(metricData);
    } catch {
      setError('Failed to load webhook data');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function resolve(id: string, status: 'resolved' | 'ignored') {
    await apiRequest(`/admin/webhooks/dlq/${id}/resolve`, {
      method: 'POST',
      body: { resolution_status: status },
    });
    await load();
  }

  return (
    <div className="space-y-4 max-w-7xl">
      <ShellTitle
        title="Webhook Reliability Ops"
        subtitle="Monitor dead letters, resolve failures, and track delivery performance by event type"
        action={<ActionButton variant="primary" onClick={load}>Refresh</ActionButton>}
      />

      {error && <InlineMessage kind="error">{error}</InlineMessage>}

      <Panel title="Dead-Letter Queue" subtitle="Items that exhausted retry policy and need operator action">
        <div className="overflow-auto">
          <table className="w-full text-sm ops-table">
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Webhook URL</th>
                <th className="text-left py-2">Attempts</th>
                <th className="text-left py-2">Failure</th>
                <th className="text-left py-2">Last Failure</th>
                <th className="text-left py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {dlq.map((d) => (
                <tr key={d.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2 font-mono text-xs">{d.id.slice(0, 8)}...</td>
                  <td className="py-2">{d.webhook_url}</td>
                  <td className="py-2">{d.total_attempts}</td>
                  <td className="py-2">{d.failure_reason}</td>
                  <td className="py-2">{new Date(d.last_failure_at).toLocaleString()}</td>
                  <td className="py-2 space-x-2">
                    <ActionButton variant="primary" className="inline-flex" onClick={() => resolve(d.id, 'resolved')}>Resolve</ActionButton>
                    <ActionButton variant="danger" className="inline-flex" onClick={() => resolve(d.id, 'ignored')}>Ignore</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Delivery Metrics" subtitle="Success rates and failure concentration by merchant and event">
        <div className="overflow-auto">
          <table className="w-full text-sm ops-table">
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="text-left py-2">Merchant</th>
                <th className="text-left py-2">Event Type</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Delivered</th>
                <th className="text-left py-2">Failed</th>
                <th className="text-left py-2">DLQ</th>
                <th className="text-left py-2">Success %</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, idx) => (
                <tr key={`${m.merchant_id}-${m.event_type}-${idx}`} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2 font-mono text-xs">{m.merchant_id.slice(0, 8)}...</td>
                  <td className="py-2">{m.event_type}</td>
                  <td className="py-2">{m.total_webhooks ?? 0}</td>
                  <td className="py-2">{m.delivered_count ?? 0}</td>
                  <td className="py-2">{m.failed_count ?? 0}</td>
                  <td className="py-2">{m.dlq_count ?? 0}</td>
                  <td className="py-2">
                    <StatusPill tone={(m.success_rate_percent ?? 0) > 95 ? 'ok' : (m.success_rate_percent ?? 0) > 80 ? 'warn' : 'danger'}>
                      {(m.success_rate_percent ?? 0).toFixed(2)}%
                    </StatusPill>
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
