'use client';

import {
    CheckCircle2, Clock, XCircle, ArrowUpRight, ArrowDownRight,
    Globe, ArrowDownToLine, ArrowUpFromLine, Repeat2, BarChart3
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const hourlyData = [
    { h: '6am', vol: 120 }, { h: '8am', vol: 340 }, { h: '10am', vol: 580 },
    { h: '12pm', vol: 890 }, { h: '2pm', vol: 750 }, { h: '4pm', vol: 670 },
    { h: '6pm', vol: 490 }, { h: '8pm', vol: 320 },
];

const paymentStats = [
    { label: 'Processed Today', value: '₦ 1.24B', change: '+12.5%', up: true, icon: BarChart3 },
    { label: 'Successful', value: '47,523', change: '98.4%', up: true, icon: CheckCircle2 },
    { label: 'Pending', value: '156', change: 'Processing', up: null, icon: Clock },
    { label: 'Refunded', value: '₦ 4.2M', change: '89 txns', up: false, icon: Repeat2 },
];

const methods = [
    { name: 'Onchain Payments', icon: Globe, volume: '₦ 541M', txns: '18,420', success: '99.2%', iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400' },
    { name: 'Onramp', icon: ArrowDownToLine, volume: '₦ 374M', txns: '12,840', success: '98.7%', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
    { name: 'Off-ramp (Withdrawals)', icon: ArrowUpFromLine, volume: '₦ 328M', txns: '10,290', success: '97.9%', iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400' },
];

export default function PaymentsPage() {
    return (
        <div className="space-y-6 max-w-screen-2xl">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentStats.map((s) => (
                    <div key={s.label} className="glass-card rounded-xl p-5 card-hover">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <s.icon size={15} className="text-violet-400" />
                            </div>
                            {s.up !== null && (
                                <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {s.change}
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-500 mb-0.5">{s.label}</p>
                        <p className="text-xl font-bold text-slate-100">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Volume chart */}
            <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Payment Volume — Today</h3>
                <p className="text-xs text-slate-500 mb-4">₦ Millions by hour — all payment types</p>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={hourlyData} margin={{ left: -20, right: 0 }}>
                        <defs>
                            <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#6437b430" />
                        <XAxis dataKey="h" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#120d22', border: '1px solid #6437b445', borderRadius: '8px', color: '#e2e8f0', fontSize: 12 }} formatter={(v) => [`₦ ${v}M`, 'Volume']} />
                        <Area type="monotone" dataKey="vol" stroke="#8b5cf6" strokeWidth={2} fill="url(#payGrad)" name="Volume" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Payment type breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {methods.map((m) => (
                    <div key={m.name} className="glass-card rounded-xl p-5 card-hover">
                        <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center mb-4`}>
                            <m.icon size={18} className={m.iconColor} />
                        </div>
                        <p className="text-xs text-slate-500 mb-0.5">{m.name}</p>
                        <p className="text-xl font-bold text-slate-100 mb-4">{m.volume}</p>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between text-slate-400">
                                <span>Transactions</span><span className="text-slate-300">{m.txns}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Success Rate</span><span className="text-emerald-400 font-semibold">{m.success}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending settlements */}
            <div className="glass-card rounded-xl">
                <div className="flex items-center justify-between p-5 border-b border-[#1e3a5f]/40">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-200">Pending Settlements</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Awaiting batch processing</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors">
                        Process All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-slate-500 border-b border-[#1e3a5f]/30">
                                {['Batch ID', 'Merchant', 'Amount', 'Transactions', 'Scheduled', 'Status'].map((h) => (
                                    <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'STL-0441', merchant: 'Paystack Inc.', amount: '₦ 14.8M', txns: '2,840', scheduled: '2026-02-22 18:00', status: 'pending' },
                                { id: 'STL-0440', merchant: 'Flutterwave', amount: '₦ 8.2M', txns: '1,520', scheduled: '2026-02-22 18:00', status: 'pending' },
                                { id: 'STL-0439', merchant: 'Interswitch', amount: '₦ 22.7M', txns: '4,130', scheduled: '2026-02-22 18:00', status: 'processing' },
                                { id: 'STL-0438', merchant: 'Moniepoint', amount: '₦ 5.9M', txns: '980', scheduled: '2026-02-22 17:00', status: 'completed' },
                            ].map((row) => (
                                <tr key={row.id} className="table-row-hover border-b border-[#1e3a5f]/20 last:border-0">
                                    <td className="px-5 py-3 font-mono text-xs text-violet-400">{row.id}</td>
                                    <td className="px-5 py-3 text-xs text-slate-300">{row.merchant}</td>
                                    <td className="px-5 py-3 text-xs font-semibold text-slate-100">{row.amount}</td>
                                    <td className="px-5 py-3 text-xs text-slate-400">{row.txns}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{row.scheduled}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${row.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            row.status === 'processing' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' :
                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                            {row.status === 'completed' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                                            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
