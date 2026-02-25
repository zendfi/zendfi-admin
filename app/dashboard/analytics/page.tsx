'use client';

import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ArrowLeftRight, Globe, Percent } from 'lucide-react';

const monthlyVolume = [
    { month: 'Sep', volume: 8.2, txns: 320000 },
    { month: 'Oct', volume: 9.4, txns: 380000 },
    { month: 'Nov', volume: 11.1, txns: 420000 },
    { month: 'Dec', volume: 14.8, txns: 580000 },
    { month: 'Jan', volume: 12.3, txns: 470000 },
    { month: 'Feb', volume: 13.9, txns: 520000 },
];

const channelData = [
    { channel: 'Onchain', volume: 5.4 },
    { channel: 'Onramp', volume: 3.8 },
    { channel: 'Off-ramp', volume: 3.2 },
];

const pieData = [
    { name: 'Onchain', value: 44 },
    { name: 'Onramp', value: 31 },
    { name: 'Off-ramp', value: 25 },
];

const PIE_COLORS = ['#9b7dd4', '#10b981', '#8b5cf6'];

const successRateData = [
    { day: 'Mon', rate: 98.1 },
    { day: 'Tue', rate: 98.6 },
    { day: 'Wed', rate: 97.9 },
    { day: 'Thu', rate: 99.1 },
    { day: 'Fri', rate: 98.8 },
    { day: 'Sat', rate: 99.3 },
    { day: 'Sun', rate: 98.4 },
];

const kpis = [
    { label: 'Monthly GMV', value: '₦ 13.9B', change: '+12.5%', up: true, icon: DollarSign },
    { label: 'Avg Ticket Size', value: '₦ 25,480', change: '+3.1%', up: true, icon: ArrowLeftRight },
    { label: 'Conversion Rate', value: '94.7%', change: '+1.2%', up: true, icon: Percent },
    { label: 'Cross-border', value: '₦ 890M', change: '-2.4%', up: false, icon: Globe },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 max-w-screen-2xl">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpis.map((k) => (
                    <div key={k.label} className="glass-card rounded-xl p-5 card-hover">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center">
                                <k.icon size={16} className="text-violet-400" />
                            </div>
                            <span className={`flex items-center gap-0.5 text-xs font-medium ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {k.change}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-0.5">{k.label}</p>
                        <p className="text-2xl font-bold text-slate-100">{k.value}</p>
                    </div>
                ))}
            </div>

            {/* Monthly volume */}
            <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Monthly Transaction Volume</h3>
                <p className="text-xs text-slate-500 mb-5">₦ Billions — last 6 months</p>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={monthlyVolume} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#9b7dd4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#9b7dd4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#6437b430" />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#120d22', border: '1px solid #6437b445', borderRadius: '8px', color: '#e2e8f0', fontSize: 12 }} />
                        <Area type="monotone" dataKey="volume" stroke="#9b7dd4" strokeWidth={2} fill="url(#volGrad)" name="Volume (₦B)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Channel breakdown */}
                <div className="lg:col-span-2 glass-card rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-slate-200 mb-1">Volume by Channel</h3>
                    <p className="text-xs text-slate-500 mb-5">₦ Billions — this month</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={channelData} margin={{ left: -20, right: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#6437b430" />
                            <XAxis dataKey="channel" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#120d22', border: '1px solid #6437b445', borderRadius: '8px', color: '#e2e8f0', fontSize: 12 }} />
                            <Bar dataKey="volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Volume (₦B)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div className="glass-card rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-slate-200 mb-1">Transaction Mix</h3>
                    <p className="text-xs text-slate-500 mb-4">By count %</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#120d22', border: '1px solid #6437b445', borderRadius: '8px', color: '#e2e8f0', fontSize: 12 }} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Success rate */}
            <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Success Rate — Last 7 Days</h3>
                <p className="text-xs text-slate-500 mb-5">Transaction processing success rate %</p>
                <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={successRateData} margin={{ left: -20, right: 0 }}>
                        <defs>
                            <linearGradient id="srGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#6437b430" />
                        <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[96, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#120d22', border: '1px solid #6437b445', borderRadius: '8px', color: '#e2e8f0', fontSize: 12 }} formatter={(v) => [`${v}%`, 'Success Rate']} />
                        <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} fill="url(#srGrad)" name="Success Rate" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
