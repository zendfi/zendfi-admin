'use client';

import { useEffect, useState } from 'react';
import { ApiError, apiRequest } from '@/lib/api';

type FraudStats = {
  total_flags_today: number;
  total_flags_this_week: number;
  unresolved_flags: number;
  blocked_wallets: number;
  blocked_ips: number;
  high_risk_payments_today: number;
};

type FraudFlag = {
  id: string;
  merchant_id?: string | null;
  wallet_address?: string | null;
  ip_address_text?: string | null;
  rule_name: string;
  severity: string;
  fraud_score: number;
  resolved: boolean;
  created_at: string;
};

type BlockedWallet = {
  id: string;
  wallet_address: string;
  reason: string;
  created_at: string;
};

type BlockedIp = {
  id: string;
  ip_address_text: string;
  reason: string;
  created_at: string;
};

type FraudRule = {
  id: string;
  name: string;
  severity: string;
  score_contribution: number;
  is_enabled: boolean;
};

export default function CompliancePage() {
  const [stats, setStats] = useState<FraudStats | null>(null);
  const [flags, setFlags] = useState<FraudFlag[]>([]);
  const [wallets, setWallets] = useState<BlockedWallet[]>([]);
  const [ips, setIps] = useState<BlockedIp[]>([]);
  const [rules, setRules] = useState<FraudRule[]>([]);

  const [walletToBlock, setWalletToBlock] = useState('');
  const [ipToBlock, setIpToBlock] = useState('');
  const [reason, setReason] = useState('manual_review');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const [statsData, flagsData, walletsData, ipsData, rulesData] = await Promise.all([
        apiRequest<FraudStats>('/admin/fraud/stats'),
        apiRequest<FraudFlag[]>('/admin/fraud/flags?resolved=false&limit=100'),
        apiRequest<BlockedWallet[]>('/admin/fraud/blocked-wallets'),
        apiRequest<BlockedIp[]>('/admin/fraud/blocked-ips'),
        apiRequest<FraudRule[]>('/admin/fraud/rules'),
      ]);
      setStats(statsData);
      setFlags(flagsData);
      setWallets(walletsData);
      setIps(ipsData);
      setRules(rulesData);
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to load compliance data (${e.status})` : 'Failed to load compliance data');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function resolveFlag(id: string, resolutionType: 'safe_false_positive' | 'confirmed_fraud' | 'other') {
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/admin/fraud/flags/${id}/resolve`, {
        method: 'POST',
        body: { resolution_type: resolutionType, resolution_notes: 'Resolved in admin console' },
      });
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to resolve flag (${e.status})` : 'Failed to resolve flag');
    }
    setBusy(false);
  }

  async function blockWallet() {
    if (!walletToBlock.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await apiRequest('/admin/fraud/blocked-wallets', {
        method: 'POST',
        body: { wallet_address: walletToBlock.trim(), reason },
      });
      setWalletToBlock('');
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to block wallet (${e.status})` : 'Failed to block wallet');
    }
    setBusy(false);
  }

  async function blockIp() {
    if (!ipToBlock.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await apiRequest('/admin/fraud/blocked-ips', {
        method: 'POST',
        body: { ip_address: ipToBlock.trim(), reason },
      });
      setIpToBlock('');
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to block IP (${e.status})` : 'Failed to block IP');
    }
    setBusy(false);
  }

  async function unblockWallet(id: string) {
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/admin/fraud/wallets/${id}/unblock`, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to unblock wallet (${e.status})` : 'Failed to unblock wallet');
    }
    setBusy(false);
  }

  async function unblockIp(ip: string) {
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/admin/fraud/blocked-ips/${encodeURIComponent(ip)}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to unblock IP (${e.status})` : 'Failed to unblock IP');
    }
    setBusy(false);
  }

  async function toggleRule(rule: FraudRule) {
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/admin/fraud/rules/${rule.id}`, {
        method: 'PATCH',
        body: { is_enabled: !rule.is_enabled },
      });
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? `Failed to update rule (${e.status})` : 'Failed to update rule');
    }
    setBusy(false);
  }

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Fraud And Compliance Operations</h2>
        <button className="px-2 py-1 rounded bg-violet-600 text-white text-xs" onClick={load}>Refresh</button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {stats && (
        <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard label="Flags Today" value={stats.total_flags_today} />
          <MetricCard label="Flags (7d)" value={stats.total_flags_this_week} />
          <MetricCard label="Unresolved" value={stats.unresolved_flags} />
          <MetricCard label="Blocked Wallets" value={stats.blocked_wallets} />
          <MetricCard label="Blocked IPs" value={stats.blocked_ips} />
          <MetricCard label="High Risk (24h)" value={stats.high_risk_payments_today} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Block Wallet Or IP</h3>
          <input
            className="input-field w-full px-3 py-2"
            placeholder="Wallet address"
            value={walletToBlock}
            onChange={(e) => setWalletToBlock(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              className="input-field flex-1 px-3 py-2"
              placeholder="IP address"
              value={ipToBlock}
              onChange={(e) => setIpToBlock(e.target.value)}
            />
            <input
              className="input-field w-44 px-3 py-2"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded bg-rose-700 text-white text-xs" onClick={blockWallet} disabled={busy}>Block Wallet</button>
            <button className="px-3 py-2 rounded bg-rose-700 text-white text-xs" onClick={blockIp} disabled={busy}>Block IP</button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">Fraud Rules</h3>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg px-3 py-2 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-medium">{rule.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Severity: {rule.severity} | Score: {rule.score_contribution}
                  </p>
                </div>
                <button
                  className={`px-2 py-1 text-xs rounded ${rule.is_enabled ? 'bg-emerald-700' : 'bg-zinc-700'} text-white`}
                  disabled={busy}
                  onClick={() => toggleRule(rule)}
                >
                  {rule.is_enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3">Unresolved Fraud Flags</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="text-left py-2">Flag</th>
                <th className="text-left py-2">Rule</th>
                <th className="text-left py-2">Severity</th>
                <th className="text-left py-2">Score</th>
                <th className="text-left py-2">Wallet/IP</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flags.map((flag) => (
                <tr key={flag.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2 font-mono text-xs">{flag.id.slice(0, 8)}...</td>
                  <td className="py-2">{flag.rule_name}</td>
                  <td className="py-2">{flag.severity}</td>
                  <td className="py-2">{flag.fraud_score}</td>
                  <td className="py-2">{flag.wallet_address ?? flag.ip_address_text ?? '-'}</td>
                  <td className="py-2 space-x-2">
                    <button className="px-2 py-1 text-xs rounded bg-emerald-700 text-white" disabled={busy} onClick={() => resolveFlag(flag.id, 'safe_false_positive')}>False Positive</button>
                    <button className="px-2 py-1 text-xs rounded bg-rose-700 text-white" disabled={busy} onClick={() => resolveFlag(flag.id, 'confirmed_fraud')}>Confirm Fraud</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">Blocked Wallets</h3>
          <div className="space-y-2">
            {wallets.map((w) => (
              <div key={w.id} className="border rounded-lg px-3 py-2 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-xs font-mono">{w.wallet_address}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{w.reason}</p>
                </div>
                <button className="px-2 py-1 text-xs rounded bg-zinc-700 text-white" disabled={busy} onClick={() => unblockWallet(w.id)}>Unblock</button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">Blocked IPs</h3>
          <div className="space-y-2">
            {ips.map((ip) => (
              <div key={ip.id} className="border rounded-lg px-3 py-2 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-xs font-mono">{ip.ip_address_text}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ip.reason}</p>
                </div>
                <button className="px-2 py-1 text-xs rounded bg-zinc-700 text-white" disabled={busy} onClick={() => unblockIp(ip.ip_address_text)}>Unblock</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card rounded-xl p-3">
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
