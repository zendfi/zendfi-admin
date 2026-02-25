'use client';

import { useState } from 'react';
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    FileText,
    Filter,
    Search,
    Download,
    Flag,
    User,
    Building2,
    Calendar,
    ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';

type CaseStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'escalated';
type RiskLevel = 'high' | 'medium' | 'low';

interface ComplianceCase {
    id: string;
    type: string;
    merchant: string;
    customer: string;
    amount: string;
    riskLevel: RiskLevel;
    status: CaseStatus;
    assignee: string;
    submittedAt: string;
    flag: string;
}

const cases: ComplianceCase[] = [
    { id: 'KYC-3841', type: 'KYC Verification', merchant: 'Apex Traders Ltd', customer: 'Chukwuemeka Obi', amount: '₦ 8,400,000', riskLevel: 'high', status: 'pending', assignee: 'Unassigned', submittedAt: '2026-02-22 13:45', flag: 'PEP Match' },
    { id: 'AML-2291', type: 'AML Investigation', merchant: 'FlowPay Inc.', customer: 'Adaeze Nwosu', amount: '₦ 2,100,000', riskLevel: 'high', status: 'under_review', assignee: 'Ngozi A.', submittedAt: '2026-02-22 11:30', flag: 'Unusual Pattern' },
    { id: 'KYC-3840', type: 'KYC Verification', merchant: 'NovaCash Solutions', customer: 'Tunde Bakare', amount: '—', riskLevel: 'medium', status: 'pending', assignee: 'Unassigned', submittedAt: '2026-02-22 10:15', flag: 'Document Mismatch' },
    { id: 'VEL-0142', type: 'Velocity Breach', merchant: 'SwiftRoute Ltd', customer: 'Emeka Dike', amount: '₦ 12,700,000', riskLevel: 'medium', status: 'escalated', assignee: 'Kelechi O.', submittedAt: '2026-02-22 09:00', flag: 'Volume Spike' },
    { id: 'KYC-3839', type: 'KYC Verification', merchant: 'Jumia Nigeria', customer: 'Amara Eze', amount: '₦ 340,000', riskLevel: 'low', status: 'approved', assignee: 'Ngozi A.', submittedAt: '2026-02-22 08:20', flag: '' },
    { id: 'AML-2290', type: 'AML Investigation', merchant: 'PayFlex Ltd', customer: 'Biodun Aliyu', amount: '₦ 5,600,000', riskLevel: 'high', status: 'rejected', assignee: 'Kelechi O.', submittedAt: '2026-02-21 17:10', flag: 'Sanctioned Entity' },
    { id: 'KYC-3838', type: 'KYC Verification', merchant: 'Bolt Nigeria', customer: 'Chisom Okafor', amount: '₦ 80,000', riskLevel: 'low', status: 'approved', assignee: 'Ngozi A.', submittedAt: '2026-02-21 16:00', flag: '' },
    { id: 'VEL-0141', type: 'Velocity Breach', merchant: 'Buypower Nigeria', customer: 'Seun Adeleke', amount: '₦ 900,000', riskLevel: 'medium', status: 'under_review', assignee: 'Kelechi O.', submittedAt: '2026-02-21 14:30', flag: 'Multiple Accounts' },
];

const statusConfig: Record<CaseStatus, { label: string; icon: React.ReactNode; classes: string }> = {
    pending: { label: 'Pending', icon: <Clock size={12} />, classes: 'bg-slate-500/15 text-slate-400 border border-slate-500/20' },
    under_review: { label: 'Under Review', icon: <Eye size={12} />, classes: 'bg-violet-500/15 text-violet-400 border border-violet-500/20' },
    approved: { label: 'Approved', icon: <CheckCircle2 size={12} />, classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' },
    rejected: { label: 'Rejected', icon: <XCircle size={12} />, classes: 'bg-red-500/15 text-red-400 border border-red-500/20' },
    escalated: { label: 'Escalated', icon: <AlertTriangle size={12} />, classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/20' },
};

const riskConfig: Record<RiskLevel, string> = {
    high: 'bg-red-500/15 text-red-400 border border-red-500/20',
    medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
};

const summaryStats = [
    { label: 'Total Cases', value: '47', icon: FileText, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Pending Review', value: '12', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'High Risk', value: '8', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Resolved Today', value: '21', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

type TabFilter = 'all' | CaseStatus | RiskLevel;

export default function CompliancePage() {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<TabFilter>('all');
    const [selectedCase, setSelectedCase] = useState<ComplianceCase | null>(null);

    const tabs: { label: string; key: TabFilter }[] = [
        { label: 'All Cases', key: 'all' },
        { label: 'Pending', key: 'pending' },
        { label: 'Under Review', key: 'under_review' },
        { label: 'High Risk', key: 'high' },
        { label: 'Escalated', key: 'escalated' },
    ];

    const filtered = cases.filter((c) => {
        const matchSearch =
            !search ||
            c.id.toLowerCase().includes(search.toLowerCase()) ||
            c.merchant.toLowerCase().includes(search.toLowerCase()) ||
            c.customer.toLowerCase().includes(search.toLowerCase());
        const matchTab =
            activeTab === 'all' ||
            c.status === activeTab ||
            c.riskLevel === activeTab;
        return matchSearch && matchTab;
    });

    return (
        <div className="space-y-6 max-w-screen-2xl">
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryStats.map((s) => (
                    <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                            <s.icon size={18} className={s.color} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">{s.label}</p>
                            <p className="text-2xl font-bold text-slate-100 mt-0.5">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main panel */}
            <div className="glass-card rounded-xl">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-[#1e3a5f]/40">
                    <div className="flex items-center gap-2 flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={clsx(
                                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                                    activeTab === tab.key
                                        ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search cases..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-8 pr-3 py-1.5 text-xs w-48"
                            />
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition-colors">
                            <Filter size={12} /> Filter <ChevronDown size={11} />
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition-colors">
                            <Download size={12} /> Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-slate-500 border-b border-[#1e3a5f]/30">
                                <th className="text-left px-5 py-3 font-medium">Case ID</th>
                                <th className="text-left px-4 py-3 font-medium">Type</th>
                                <th className="text-left px-4 py-3 font-medium">Merchant</th>
                                <th className="text-left px-4 py-3 font-medium">Customer</th>
                                <th className="text-left px-4 py-3 font-medium">Amount</th>
                                <th className="text-left px-4 py-3 font-medium">Risk</th>
                                <th className="text-left px-4 py-3 font-medium">Status</th>
                                <th className="text-left px-4 py-3 font-medium">Flag</th>
                                <th className="text-left px-4 py-3 font-medium">Assignee</th>
                                <th className="text-left px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => {
                                const sc = statusConfig[c.status];
                                return (
                                    <tr key={c.id} className="table-row-hover border-b border-[#1e3a5f]/20 last:border-0">
                                        <td className="px-5 py-3 font-mono text-xs text-violet-400 font-medium">{c.id}</td>
                                        <td className="px-4 py-3 text-xs text-slate-300">{c.type}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={12} className="text-slate-500 shrink-0" />
                                                <span className="text-xs text-slate-300">{c.merchant}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <User size={12} className="text-slate-500 shrink-0" />
                                                <span className="text-xs text-slate-400">{c.customer}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs font-semibold text-slate-200">{c.amount}</td>
                                        <td className="px-4 py-3">
                                            <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded uppercase', riskConfig[c.riskLevel])}>
                                                {c.riskLevel}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', sc.classes)}>
                                                {sc.icon} {sc.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {c.flag && (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                                    <Flag size={9} /> {c.flag}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{c.assignee}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedCase(c)}
                                                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                                            >
                                                Review →
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail modal */}
            {selectedCase && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setSelectedCase(null)}
                >
                    <div
                        className="glass-card rounded-2xl w-full max-w-lg mx-4 p-6 border border-[#1e3a5f]/60 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <p className="text-xs text-slate-500 font-mono">{selectedCase.id}</p>
                                <h2 className="text-lg font-bold text-slate-100 mt-1">{selectedCase.type}</h2>
                            </div>
                            <button onClick={() => setSelectedCase(null)} className="text-slate-500 hover:text-slate-200 transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm mb-6">
                            {[
                                { label: 'Merchant', value: selectedCase.merchant, icon: <Building2 size={13} className="text-slate-500" /> },
                                { label: 'Customer', value: selectedCase.customer, icon: <User size={13} className="text-slate-500" /> },
                                { label: 'Amount', value: selectedCase.amount, icon: null },
                                { label: 'Risk Level', value: selectedCase.riskLevel.toUpperCase(), icon: <AlertTriangle size={13} className="text-slate-500" /> },
                                { label: 'Submitted', value: selectedCase.submittedAt, icon: <Calendar size={13} className="text-slate-500" /> },
                                { label: 'Flag', value: selectedCase.flag || '—', icon: <Flag size={13} className="text-slate-500" /> },
                                { label: 'Assignee', value: selectedCase.assignee, icon: null },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center gap-3 py-2 border-b border-[#1e3a5f]/30 last:border-0">
                                    <span className="text-slate-500 w-24 shrink-0">{row.label}</span>
                                    <div className="flex items-center gap-1.5 text-slate-200 font-medium">{row.icon}{row.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-semibold text-sm border border-emerald-500/30 transition-colors">
                                Approve
                            </button>
                            <button className="flex-1 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 font-semibold text-sm border border-amber-500/30 transition-colors">
                                Escalate
                            </button>
                            <button className="flex-1 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 font-semibold text-sm border border-red-500/30 transition-colors">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
