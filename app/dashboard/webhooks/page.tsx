'use client';

import { useState } from 'react';
import { Plus, Webhook, CheckCircle2, XCircle, Clock, Copy, RefreshCw, Trash2, Edit3, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type WebhookStatus = 'active' | 'inactive' | 'failing';

interface WebhookEndpoint {
    id: string;
    url: string;
    description: string;
    events: string[];
    status: WebhookStatus;
    successRate: number;
    lastDelivery: string;
    secret: string;
}

const webhooks: WebhookEndpoint[] = [
    { id: 'wh_1', url: 'https://api.paystack.io/webhooks/zendfi', description: 'Paystack payment events', events: ['payment.success', 'payment.failed', 'refund.created'], status: 'active', successRate: 99.8, lastDelivery: '2 min ago', secret: 'sk_••••••••••••8841' },
    { id: 'wh_2', url: 'https://hooks.flutterwave.com/v3/events', description: 'Flutterwave settlement events', events: ['settlement.completed', 'transfer.failed'], status: 'active', successRate: 98.4, lastDelivery: '15 min ago', secret: 'sk_••••••••••••2291' },
    { id: 'wh_3', url: 'https://notify.jumia.com.ng/payments', description: 'Jumia payment notifications', events: ['payment.success', 'chargeback.created'], status: 'failing', successRate: 61.2, lastDelivery: '45 min ago', secret: 'sk_••••••••••••5510' },
    { id: 'wh_4', url: 'https://ops.konga.com/webhooks', description: 'Konga order events', events: ['payment.success'], status: 'inactive', successRate: 0, lastDelivery: 'Never', secret: 'sk_••••••••••••7734' },
];

const events = [
    'payment.success', 'payment.failed', 'payment.pending',
    'refund.created', 'refund.completed',
    'settlement.completed', 'settlement.failed',
    'transfer.created', 'transfer.failed',
    'chargeback.created', 'chargeback.resolved',
    'kyc.approved', 'kyc.rejected',
];

const statusConfig: Record<WebhookStatus, { icon: React.ReactNode; label: string; classes: string }> = {
    active: { icon: <CheckCircle2 size={11} />, label: 'Active', classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    inactive: { icon: <Clock size={11} />, label: 'Inactive', classes: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
    failing: { icon: <XCircle size={11} />, label: 'Failing', classes: 'bg-red-500/10 text-red-400 border border-red-500/20' },
};

export default function WebhooksPage() {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-6 max-w-screen-2xl">
            <div className="flex items-center justify-between">
                <div className="grid grid-cols-3 gap-4 flex-1 max-w-md">
                    {[
                        { label: 'Total Endpoints', value: webhooks.length.toString() },
                        { label: 'Active', value: webhooks.filter((w) => w.status === 'active').length.toString() },
                        { label: 'Failing', value: webhooks.filter((w) => w.status === 'failing').length.toString() },
                    ].map((s) => (
                        <div key={s.label} className="glass-card rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-slate-100">{s.value}</p>
                            <p className="text-[10px] text-slate-500">{s.label}</p>
                        </div>
                    ))}
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors">
                    <Plus size={14} /> Add Endpoint
                </button>
            </div>

            {/* Webhook list */}
            <div className="space-y-4">
                {webhooks.map((wh) => {
                    const sc = statusConfig[wh.status];
                    return (
                        <div key={wh.id} className="glass-card rounded-xl p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                        <Webhook size={15} className="text-violet-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-violet-300 truncate max-w-xs">{wh.url}</span>
                                            <button onClick={() => handleCopy(wh.id, wh.url)} className="text-slate-500 hover:text-slate-300 transition-colors">
                                                {copied === wh.id ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500">{wh.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', sc.classes)}>
                                        {sc.icon} {sc.label}
                                    </span>
                                    <button className="text-slate-500 hover:text-violet-400 transition-colors"><Edit3 size={13} /></button>
                                    <button className="text-slate-500 hover:text-slate-200 transition-colors"><RefreshCw size={13} /></button>
                                    <button className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 mb-1">Success Rate</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={clsx('h-full rounded-full', wh.successRate > 90 ? 'bg-emerald-500' : wh.successRate > 60 ? 'bg-amber-500' : 'bg-red-500')}
                                                style={{ width: `${wh.successRate}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-slate-300">{wh.successRate}%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 mb-1">Last Delivery</p>
                                    <p className="text-xs text-slate-300">{wh.lastDelivery}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 mb-1">Signing Secret</p>
                                    <p className="text-xs font-mono text-slate-400">{wh.secret}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 mb-1">Events</p>
                                    <p className="text-xs text-slate-400">{wh.events.length} subscribed</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {wh.events.map((ev) => (
                                    <span key={ev} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                                        {ev}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="glass-card rounded-2xl w-full max-w-lg mx-4 p-6 border border-[#1e3a5f]/60" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-base font-bold text-slate-100 mb-1">Add Webhook Endpoint</h2>
                        <p className="text-xs text-slate-500 mb-5">Configure a new endpoint to receive event notifications.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Endpoint URL</label>
                                <input type="url" placeholder="https://your-server.com/webhooks" className="input-field px-3 py-2 text-sm w-full" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
                                <input type="text" placeholder="e.g. Production payment events" className="input-field px-3 py-2 text-sm w-full" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Events to subscribe</label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                                    {events.map((ev) => (
                                        <label key={ev} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded border-[#1e3a5f]/60 bg-transparent" />
                                            <span className="text-[11px] font-mono text-slate-400">{ev}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-sm font-medium transition-colors">Cancel</button>
                            <button className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">Save Endpoint</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
