'use client';

import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ArrowLeftRight,
    ShieldAlert,
    Users,
    TrendingUp,
    Activity,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
} from 'recharts';

const volumeData = [
    { time: '00:00', volume: 1.2, success: 1.1, failed: 0.1 },
    { time: '04:00', volume: 0.8, success: 0.75, failed: 0.05 },
    { time: '08:00', volume: 2.4, success: 2.2, failed: 0.2 },
    { time: '12:00', volume: 4.1, success: 3.8, failed: 0.3 },
    { time: '16:00', volume: 3.7, success: 3.4, failed: 0.3 },
    { time: '20:00', volume: 2.9, success: 2.7, failed: 0.2 },
    { time: '24:00', volume: 1.5, success: 1.4, failed: 0.1 },
];

const txByMethod = [
    { method: 'Onchain', count: 18420 },
    { method: 'Onramp', count: 12840 },
    { method: 'Off-ramp', count: 10290 },
];

const recentTx = [
    { id: 'TXN-9841', merchant: 'Shoprite Ltd', amount: '₦ 145,000', status: 'success', method: 'Onchain', time: '2 min ago' },
    { id: 'TXN-9840', merchant: 'Yellowcard', amount: '₦ 5,000', status: 'success', method: 'Onramp', time: '5 min ago' },
    { id: 'TXN-9839', merchant: 'Paystack Inc.', amount: '₦ 2,340,000', status: 'pending', method: 'Off-ramp', time: '12 min ago' },
    { id: 'TXN-9838', merchant: 'Jumia Nigeria', amount: '₦ 78,500', status: 'failed', method: 'Onchain', time: '15 min ago' },
    { id: 'TXN-9837', merchant: 'Flutterwave', amount: '₦ 500,000', status: 'success', method: 'Onramp', time: '18 min ago' },
    { id: 'TXN-9836', merchant: 'Konga Online', amount: '₦ 22,000', status: 'success', method: 'Onchain', time: '25 min ago' },
];

const statusIcon: Record<string, React.ReactNode> = {
    success: <CheckCircle2 size={14} className="text-emerald-400" />,
    pending: <Clock size={14} className="text-amber-400" />,
    failed: <XCircle size={14} className="text-red-400" />,
};

const statusBadge: Record<string, string> = {
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    failed: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const stats = [
    {
        label: 'Total Volume (Today)',
        value: '₦ 1.24B',
        change: '+12.5%',
        up: true,
        icon: DollarSign,
        iconBg: 'bg-violet-500/15',
        iconColor: 'text-violet-400',
    },
    {
        label: 'Transactions',
        value: '48,291',
        change: '+8.3%',
        up: true,
        icon: ArrowLeftRight,
        iconBg: 'bg-violet-500/15',
        iconColor: 'text-violet-400',
    },
    {
        label: 'Success Rate',
        value: '98.4%',
        change: '+0.2%',
        up: true,
        icon: TrendingUp,
        iconBg: 'bg-emerald-500/15',
        iconColor: 'text-emerald-400',
    },
    {
        label: 'Compliance Alerts',
        value: '12',
        change: '+3',
        up: false,
        icon: ShieldAlert,
        iconBg: 'bg-amber-500/15',
        iconColor: 'text-amber-400',
    },
    {
        label: 'Active Merchants',
        value: '3,847',
        change: '+24',
        up: true,
        icon: Users,
        iconBg: 'bg-pink-500/15',
        iconColor: 'text-pink-400',
    },
    {
        label: 'API Uptime',
        value: '99.97%',
        change: '+0.01%',
        up: true,
        icon: Activity,
        iconBg: 'bg-cyan-500/15',
        iconColor: 'text-cyan-400',
    },
];

export default function OverviewPage() {
    return (
        <div className="space-y-6 max-w-screen-2xl">
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="glass-card rounded-xl p-4 card-hover">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                                <s.icon size={16} className={s.iconColor} />
                            </div>
                            <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {s.change}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-0.5">{s.label}</p>
                        <p className="text-xl font-bold text-slate-100">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Volume area chart */}
                <div className="lg:col-span-2 glass-card rounded-xl p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-200">Transaction Volume</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Last 24 hours — ₦ Billions</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> Success</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Failed</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={volumeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#9b7dd4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#9b7dd4" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#6437b430" />
                            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#120d22', border: '1px solid #6437b445', borderRadius: '8px', color: '#e2e8f0', fontSize: 12 }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Area type="monotone" dataKey="success" stroke="#9b7dd4" strokeWidth={2} fill="url(#colorSuccess)" name="Success (₦B)" />
                            <Area type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} fill="url(#colorFailed)" name="Failed (₦B)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Tx by method */}
                <div className="glass-card rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-slate-200 mb-1">By Payment Method</h3>
                    <p className="text-xs text-slate-500 mb-5">Transaction count today</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={txByMethod} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#6437b430" />
                            <XAxis dataKey="method" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#120d22', border: '1px solid #6437b445', borderRadius: '8px', color: '#e2e8f0', fontSize: 12 }}
                            />
                            <Bar dataKey="count" fill="#9b7dd4" radius={[4, 4, 0, 0]} name="Transactions" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent transactions */}
            <div className="glass-card rounded-xl">
                <div className="flex items-center justify-between p-5 border-b border-[#1e3a5f]/40">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-200">Recent Transactions</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Live feed — auto-refreshing</p>
                    </div>
                    <a href="/dashboard/transactions" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                        View all →
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-slate-500 border-b border-[#1e3a5f]/30">
                                <th className="text-left px-5 py-3 font-medium">Transaction ID</th>
                                <th className="text-left px-4 py-3 font-medium">Merchant</th>
                                <th className="text-left px-4 py-3 font-medium">Amount</th>
                                <th className="text-left px-4 py-3 font-medium">Method</th>
                                <th className="text-left px-4 py-3 font-medium">Status</th>
                                <th className="text-left px-4 py-3 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTx.map((tx) => (
                                <tr key={tx.id} className="table-row-hover border-b border-[#1e3a5f]/20 last:border-0">
                                    <td className="px-5 py-3 font-mono text-xs text-violet-400">{tx.id}</td>
                                    <td className="px-4 py-3 text-slate-300">{tx.merchant}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-100">{tx.amount}</td>
                                    <td className="px-4 py-3 text-slate-400">{tx.method}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadge[tx.status]}`}>
                                            {statusIcon[tx.status]}
                                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">{tx.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom row: system health + compliance alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System health */}
                <div className="glass-card rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-slate-200 mb-4">System Health</h3>
                    {[
                        { name: 'Payment Gateway', status: 'Operational', uptime: '99.97%', dot: 'bg-emerald-400', text: 'text-emerald-400', pulse: true },
                        { name: 'Fraud Detection', status: 'Operational', uptime: '99.99%', dot: 'bg-emerald-400', text: 'text-emerald-400', pulse: true },
                        { name: 'KYC Engine', status: 'Degraded', uptime: '97.2%', dot: 'bg-amber-400', text: 'text-amber-400', pulse: false },
                        { name: 'Settlement Service', status: 'Operational', uptime: '99.95%', dot: 'bg-emerald-400', text: 'text-emerald-400', pulse: true },
                        { name: 'Webhook Delivery', status: 'Operational', uptime: '99.9%', dot: 'bg-emerald-400', text: 'text-emerald-400', pulse: true },
                    ].map((svc) => (
                        <div key={svc.name} className="flex items-center justify-between py-2.5 border-b border-[#1e3a5f]/20 last:border-0">
                            <div className="flex items-center gap-2.5">
                                <span className={`w-2 h-2 rounded-full ${svc.dot} ${svc.pulse ? 'pulse-green' : ''}`} />
                                <span className="text-sm text-slate-300">{svc.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs ${svc.text} font-medium`}>{svc.status}</span>
                                <span className="text-xs text-slate-500">{svc.uptime}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compliance alerts */}
                <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-200">Compliance Alerts</h3>
                        <a href="/dashboard/compliance" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all →</a>
                    </div>
                    {[
                        { type: 'High Risk Transaction', merchant: 'Apex Traders Ltd', amount: '₦ 8.4M', severity: 'high' },
                        { type: 'KYC Pending', merchant: 'NovaCash Solutions', amount: '—', severity: 'medium' },
                        { type: 'AML Flag — Unusual Pattern', merchant: 'FlowPay Inc.', amount: '₦ 2.1M', severity: 'high' },
                        { type: 'Velocity Limit Breach', merchant: 'SwiftRoute Ltd', amount: '₦ 12.7M', severity: 'medium' },
                    ].map((alert, i) => (
                        <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#1e3a5f]/20 last:border-0">
                            <div className={`mt-0.5 shrink-0 ${alert.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
                                <AlertTriangle size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-slate-200">{alert.type}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{alert.merchant} · {alert.amount}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${alert.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                                }`}>{alert.severity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
