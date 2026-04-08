'use client';

import { useEffect, useMemo, useState } from 'react';
import { ApiError, apiRequest } from '@/lib/api';

type DashboardSnapshot = {
  platform_metrics: {
    total_merchants: number;
    total_payments: number;
    total_volume_usd: number;
    volume_today: number;
  };
  growth_metrics: {
    volume_growth_30d_percent: number;
  };
  fraud_metrics: {
    platform_fraud_score_avg_24h?: number;
    estimated_fraud_prevented_usd: number;
  };
};

type WalletBalanceResponse = {
  system_wallets: Array<{
    wallet_type: string;
    wallet_address: string;
    balances: Record<string, number>;
    pending_settlements_usd?: number | null;
    is_active: boolean;
  }>;
  alerts: Array<{ severity: string; message: string }>;
};

type GasAnalyticsResponse = {
  network: string;
  period_days: number;
  analytics: Array<{
    date: string;
    transaction_type: string;
    transaction_count: number;
    avg_gas_usd: string;
    total_gas_usd: string;
  }>;
};

type ProfitabilityResponse = {
  summary: {
    total_transactions: number;
    total_gas_spent_usd: string;
    total_fee_margin_usd: string;
    net_margin_usd: string;
    profitability_status: string;
  };
  daily_breakdown: Array<{
    date: string;
    transaction_count: number;
    net_margin: string;
  }>;
};

function toNum(v: string | number | null | undefined): number {
  if (typeof v === 'number') return v;
  if (!v) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(7);
  const [dashboard, setDashboard] = useState<DashboardSnapshot | null>(null);
  const [wallets, setWallets] = useState<WalletBalanceResponse | null>(null);
  const [gas, setGas] = useState<GasAnalyticsResponse | null>(null);
  const [profit, setProfit] = useState<ProfitabilityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const [d, w, g, p] = await Promise.all([
        apiRequest<DashboardSnapshot>('/admin/dashboard'),
        apiRequest<WalletBalanceResponse>('/admin/wallets/balances'),
        apiRequest<GasAnalyticsResponse>(`/admin/gas-analytics?network=mainnet-beta&days=${days}`),
        apiRequest<ProfitabilityResponse>('/admin/gas-profitability?network=mainnet-beta&days=30'),
      ]);
      setDashboard(d);
      setWallets(w);
      setGas(g);
      setProfit(p);
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to load analytics (${e.status})` : 'Failed to load analytics');
    }
  }

  useEffect(() => {
    load();
  }, [days]);

  const gasTotals = useMemo(() => {
    const rows = gas?.analytics ?? [];
    return {
      txCount: rows.reduce((sum, r) => sum + r.transaction_count, 0),
      gasSpent: rows.reduce((sum, r) => sum + toNum(r.total_gas_usd), 0),
    };
  }, [gas]);

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Platform Analytics</h2>
        <div className="flex items-center gap-2">
          <select className="input-field px-2 py-1 text-xs" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <button className="px-2 py-1 rounded bg-violet-600 text-white text-xs" onClick={load}>Refresh</button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {dashboard && (
        <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard label="Merchants" value={dashboard.platform_metrics.total_merchants.toString()} />
          <MetricCard label="Payments" value={dashboard.platform_metrics.total_payments.toString()} />
          <MetricCard label="Total Volume" value={`$${dashboard.platform_metrics.total_volume_usd.toFixed(2)}`} />
          <MetricCard label="Volume Today" value={`$${dashboard.platform_metrics.volume_today.toFixed(2)}`} />
          <MetricCard label="Growth (30d)" value={`${dashboard.growth_metrics.volume_growth_30d_percent.toFixed(2)}%`} />
          <MetricCard label="Fraud Prevented" value={`$${dashboard.fraud_metrics.estimated_fraud_prevented_usd.toFixed(2)}`} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">Gas Cost Analytics</h3>
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            Transactions: {gasTotals.txCount} | Total gas spent: ${gasTotals.gasSpent.toFixed(4)}
          </p>
          <div className="overflow-auto max-h-72">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Count</th>
                  <th className="text-left py-2">Avg Gas</th>
                  <th className="text-left py-2">Total Gas</th>
                </tr>
              </thead>
              <tbody>
                {(gas?.analytics ?? []).map((row, idx) => (
                  <tr key={`${row.date}-${row.transaction_type}-${idx}`} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2">{row.date}</td>
                    <td className="py-2">{row.transaction_type}</td>
                    <td className="py-2">{row.transaction_count}</td>
                    <td className="py-2">${toNum(row.avg_gas_usd).toFixed(6)}</td>
                    <td className="py-2">${toNum(row.total_gas_usd).toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">Gas Profitability (30d)</h3>
          {profit && (
            <div className="space-y-2 mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>Total tx: {profit.summary.total_transactions}</p>
              <p>Total gas spent: ${toNum(profit.summary.total_gas_spent_usd).toFixed(6)}</p>
              <p>Total fee margin: ${toNum(profit.summary.total_fee_margin_usd).toFixed(6)}</p>
              <p>Net margin: ${toNum(profit.summary.net_margin_usd).toFixed(6)}</p>
              <p>Status: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{profit.summary.profitability_status}</span></p>
            </div>
          )}
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Tx</th>
                  <th className="text-left py-2">Net Margin</th>
                </tr>
              </thead>
              <tbody>
                {(profit?.daily_breakdown ?? []).map((row, idx) => (
                  <tr key={`${row.date}-${idx}`} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2">{row.date}</td>
                    <td className="py-2">{row.transaction_count}</td>
                    <td className="py-2">${toNum(row.net_margin).toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3">System Wallet Balances</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Address</th>
                <th className="text-left py-2">SOL</th>
                <th className="text-left py-2">USDC</th>
                <th className="text-left py-2">USDT</th>
                <th className="text-left py-2">Pending Settlements</th>
              </tr>
            </thead>
            <tbody>
              {(wallets?.system_wallets ?? []).map((w) => (
                <tr key={`${w.wallet_type}-${w.wallet_address}`} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2">{w.wallet_type}</td>
                  <td className="py-2 font-mono text-xs">{w.wallet_address}</td>
                  <td className="py-2">{toNum(w.balances.SOL).toFixed(4)}</td>
                  <td className="py-2">{toNum(w.balances.USDC).toFixed(4)}</td>
                  <td className="py-2">{toNum(w.balances.USDT).toFixed(4)}</td>
                  <td className="py-2">{w.pending_settlements_usd ? `$${w.pending_settlements_usd.toFixed(2)}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-xl p-3">
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
