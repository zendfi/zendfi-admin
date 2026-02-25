'use client';

import { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    ChevronDown,
    CheckCircle2,
    Clock,
    XCircle,
    Globe,
    ArrowDownToLine,
    ArrowUpFromLine,
    Eye,
    RefreshCw,
    Building2,
    Calendar,
} from 'lucide-react';
import clsx from 'clsx';

type TxStatus = 'success' | 'pending' | 'failed' | 'refunded';
type TxMethod = 'Onchain' | 'Onramp' | 'Off-ramp';

interface Transaction {
    id: string;
    merchant: string;
    customer: string;
    amount: string;
    fee: string;
    method: TxMethod;
    status: TxStatus;
    reference: string;
    channel: string;
    createdAt: string;
}

const transactions: Transaction[] = [
    { id: 'TXN-9841', merchant: 'Shoprite Ltd', customer: 'Chioma Obi', amount: '₦ 145,000', fee: '₦ 1,450', method: 'Onchain', status: 'success', reference: 'REF-8841', channel: 'API', createdAt: '2026-02-22 15:42' },
    { id: 'TXN-9840', merchant: 'Yellowcard', customer: 'Emeka Nwosu', amount: '₦ 5,000', fee: '₦ 50', method: 'Onramp', status: 'success', reference: 'REF-8840', channel: 'Checkout', createdAt: '2026-02-22 15:39' },
    { id: 'TXN-9839', merchant: 'Paystack Inc.', customer: 'Adaeze Uche', amount: '₦ 2,340,000', fee: '₦ 23,400', method: 'Off-ramp', status: 'pending', reference: 'REF-8839', channel: 'API', createdAt: '2026-02-22 15:28' },
    { id: 'TXN-9838', merchant: 'Jumia Nigeria', customer: 'Tunde Bakare', amount: '₦ 78,500', fee: '₦ 785', method: 'Onchain', status: 'failed', reference: 'REF-8838', channel: 'Mobile SDK', createdAt: '2026-02-22 15:15' },
    { id: 'TXN-9837', merchant: 'Flutterwave', customer: 'Ngozi Achebe', amount: '₦ 500,000', fee: '₦ 5,000', method: 'Onramp', status: 'success', reference: 'REF-8837', channel: 'API', createdAt: '2026-02-22 15:02' },
    { id: 'TXN-9836', merchant: 'Konga Online', customer: 'Biodun Aliyu', amount: '₦ 22,000', fee: '₦ 220', method: 'Onchain', status: 'success', reference: 'REF-8836', channel: 'Checkout', createdAt: '2026-02-22 14:55' },
    { id: 'TXN-9835', merchant: 'Bolt Nigeria', customer: 'Seun Adeleke', amount: '₦ 3,200', fee: '₦ 32', method: 'Onramp', status: 'refunded', reference: 'REF-8835', channel: 'Mobile SDK', createdAt: '2026-02-22 14:41' },
    { id: 'TXN-9834', merchant: 'Buypower', customer: 'Kelechi Okafor', amount: '₦ 15,000', fee: '₦ 150', method: 'Off-ramp', status: 'success', reference: 'REF-8834', channel: 'API', createdAt: '2026-02-22 14:30' },
    { id: 'TXN-9833', merchant: 'Interswitch', customer: 'Amara Eze', amount: '₦ 890,000', fee: '₦ 8,900', method: 'Onchain', status: 'failed', reference: 'REF-8833', channel: 'API', createdAt: '2026-02-22 14:11' },
    { id: 'TXN-9832', merchant: 'Moniepoint', customer: 'Chima Dike', amount: '₦ 64,500', fee: '₦ 645', method: 'Off-ramp', status: 'success', reference: 'REF-8832', channel: 'Checkout', createdAt: '2026-02-22 13:58' },
];

const statusConfig: Record<TxStatus, { label: string; icon: React.ReactNode; classes: string }> = {
    success: { label: 'Success', icon: <CheckCircle2 size={11} />, classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    pending: { label: 'Pending', icon: <Clock size={11} />, classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    failed: { label: 'Failed', icon: <XCircle size={11} />, classes: 'bg-red-500/10 text-red-400 border border-red-500/20' },
    refunded: { label: 'Refunded', icon: <RefreshCw size={11} />, classes: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
};

const methodIcon: Record<TxMethod, React.ReactNode> = {
    Onchain: <Globe size={12} className="text-violet-400" />,
    Onramp: <ArrowDownToLine size={12} className="text-emerald-400" />,
    'Off-ramp': <ArrowUpFromLine size={12} className="text-violet-400" />,
};

const summaryStats = [
    { label: 'Total Today', value: '₦ 1.24B', sub: '48,291 transactions' },
    { label: 'Success Rate', value: '98.4%', sub: '47,578 succeeded' },
    { label: 'Pending', value: '156', sub: 'awaiting confirmation' },
    { label: 'Failed', value: '557', sub: '₦ 4.2M at risk' },
];

type TabFilter = 'all' | TxStatus;

export default function TransactionsPage() {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<TabFilter>('all');
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    const tabs: { label: string; key: TabFilter }[] = [
        { label: 'All', key: 'all' },
        { label: 'Success', key: 'success' },
        { label: 'Pending', key: 'pending' },
        { label: 'Failed', key: 'failed' },
        { label: 'Refunded', key: 'refunded' },
    ];

    const filtered = transactions.filter((tx) => {
        const matchSearch =
            !search ||
            tx.id.toLowerCase().includes(search.toLowerCase()) ||
            tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
            tx.customer.toLowerCase().includes(search.toLowerCase()) ||
            tx.reference.toLowerCase().includes(search.toLowerCase());
        const matchTab = activeTab === 'all' || tx.status === activeTab;
        return matchSearch && matchTab;
    });

    return (
        <div className="space-y-6 max-w-screen-2xl">
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryStats.map((s) => (
                    <div key={s.label} className="glass-card rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                        <p className="text-2xl font-bold text-slate-100">{s.value}</p>
                        <p className="text-[11px] text-slate-600 mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Main table */}
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
                                placeholder="Search transactions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-8 pr-3 py-1.5 text-xs w-52"
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
                                <th className="text-left px-5 py-3 font-medium">Transaction ID</th>
                                <th className="text-left px-4 py-3 font-medium">Merchant</th>
                                <th className="text-left px-4 py-3 font-medium">Customer</th>
                                <th className="text-left px-4 py-3 font-medium">Amount</th>
                                <th className="text-left px-4 py-3 font-medium">Fee</th>
                                <th className="text-left px-4 py-3 font-medium">Method</th>
                                <th className="text-left px-4 py-3 font-medium">Status</th>
                                <th className="text-left px-4 py-3 font-medium">Date</th>
                                <th className="text-left px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((tx) => {
                                const sc = statusConfig[tx.status];
                                return (
                                    <tr key={tx.id} className="table-row-hover border-b border-[#1e3a5f]/20 last:border-0">
                                        <td className="px-5 py-3 font-mono text-xs text-violet-400 font-medium">{tx.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={12} className="text-slate-500 shrink-0" />
                                                <span className="text-xs text-slate-300">{tx.merchant}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{tx.customer}</td>
                                        <td className="px-4 py-3 text-xs font-semibold text-slate-100">{tx.amount}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{tx.fee}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                {methodIcon[tx.method]} {tx.method}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', sc.classes)}>
                                                {sc.icon} {sc.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Calendar size={11} /> {tx.createdAt}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedTx(tx)}
                                                className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                                            >
                                                <Eye size={12} /> View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <p className="text-center text-xs text-slate-500 py-10">No transactions match your search.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-[#1e3a5f]/30">
                    <p className="text-xs text-slate-500">{filtered.length} results</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <button className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">← Prev</button>
                        <span className="text-slate-400 font-medium">Page 1 of 48</span>
                        <button className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">Next →</button>
                    </div>
                </div>
            </div>

            {/* Detail modal */}
            {selectedTx && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setSelectedTx(null)}
                >
                    <div
                        className="glass-card rounded-2xl w-full max-w-lg mx-4 p-6 border border-[#1e3a5f]/60 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <p className="text-xs text-slate-500 font-mono">{selectedTx.id}</p>
                                <h2 className="text-lg font-bold text-slate-100 mt-1">{selectedTx.merchant}</h2>
                            </div>
                            <button onClick={() => setSelectedTx(null)} className="text-slate-500 hover:text-slate-200 transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm mb-6">
                            {[
                                { label: 'Customer', value: selectedTx.customer },
                                { label: 'Amount', value: selectedTx.amount },
                                { label: 'Fee', value: selectedTx.fee },
                                { label: 'Method', value: selectedTx.method },
                                { label: 'Channel', value: selectedTx.channel },
                                { label: 'Reference', value: selectedTx.reference },
                                { label: 'Date', value: selectedTx.createdAt },
                                {
                                    label: 'Status', value: (
                                        <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', statusConfig[selectedTx.status].classes)}>
                                            {statusConfig[selectedTx.status].icon} {statusConfig[selectedTx.status].label}
                                        </span>
                                    )
                                },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center gap-3 py-2 border-b border-[#1e3a5f]/30 last:border-0">
                                    <span className="text-slate-500 w-24 shrink-0">{row.label}</span>
                                    <div className="text-slate-200 font-medium">{row.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 font-semibold text-sm border border-violet-500/30 transition-colors">
                                Download Receipt
                            </button>
                            {selectedTx.status === 'success' && (
                                <button className="flex-1 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 font-semibold text-sm border border-amber-500/30 transition-colors">
                                    Initiate Refund
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
