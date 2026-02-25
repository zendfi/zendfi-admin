'use client';

import { useState } from 'react';
import {
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    ChevronDown,
    Send,
    User,
    Phone,
    Mail,
    Star,
    XCircle,
} from 'lucide-react';
import clsx from 'clsx';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type Priority = 'urgent' | 'high' | 'medium' | 'low';

interface Ticket {
    id: string;
    subject: string;
    merchant: string;
    contact: string;
    email: string;
    category: string;
    priority: Priority;
    status: TicketStatus;
    agent: string;
    createdAt: string;
    lastReply: string;
    messages: number;
}

const tickets: Ticket[] = [
    { id: 'TKT-3001', subject: 'Onramp payment gateway timeout — API 504 errors', merchant: 'Paystack Inc.', contact: 'Adaobi Mensah', email: 'adaobi@paystack.io', category: 'API Issue', priority: 'urgent', status: 'open', agent: 'Unassigned', createdAt: '2026-02-22 12:30', lastReply: '5 min ago', messages: 3 },
    { id: 'TKT-3000', subject: 'Settlement delay — 3 days outstanding', merchant: 'Flutterwave', contact: 'Kemi Adeyemi', email: 'kemi@flutterwave.com', category: 'Settlement', priority: 'high', status: 'in_progress', agent: 'Chima O.', createdAt: '2026-02-22 09:15', lastReply: '1 hr ago', messages: 7 },
    { id: 'TKT-2999', subject: 'On-chain settlement failed — hash mismatch', merchant: 'Interswitch', contact: 'Bayo Ogundimu', email: 'bayo@interswitch.ng', category: 'Onchain', priority: 'high', status: 'in_progress', agent: 'Amaka I.', createdAt: '2026-02-22 08:00', lastReply: '2 hr ago', messages: 12 },
    { id: 'TKT-2998', subject: 'KYC document submission — portal not loading', merchant: 'Konga Online', contact: 'Tunde Lawson', email: 'tunde@konga.com', category: 'KYC', priority: 'medium', status: 'open', agent: 'Unassigned', createdAt: '2026-02-21 17:45', lastReply: '16 hr ago', messages: 1 },
    { id: 'TKT-2997', subject: 'Chargeback dispute — TXN-8841', merchant: 'Jumia Nigeria', contact: 'Ngozi Chukwu', email: 'ngozi@jumia.ng', category: 'Dispute', priority: 'medium', status: 'in_progress', agent: 'Chima O.', createdAt: '2026-02-21 14:00', lastReply: '4 hr ago', messages: 9 },
    { id: 'TKT-2996', subject: 'Webhook endpoint not receiving events', merchant: 'Bolt Nigeria', contact: 'Alex Obi', email: 'alex@bolt.ng', category: 'API Issue', priority: 'low', status: 'resolved', agent: 'Amaka I.', createdAt: '2026-02-21 10:00', lastReply: '1 day ago', messages: 5 },
];

const statusConfig: Record<TicketStatus, { label: string; icon: React.ReactNode; classes: string }> = {
    open: { label: 'Open', icon: <AlertCircle size={11} />, classes: 'bg-violet-500/10 text-violet-400 border border-violet-500/20' },
    in_progress: { label: 'In Progress', icon: <Clock size={11} />, classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    resolved: { label: 'Resolved', icon: <CheckCircle2 size={11} />, classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    closed: { label: 'Closed', icon: <XCircle size={11} />, classes: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
};

const priorityConfig: Record<Priority, string> = {
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function SupportPage() {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [reply, setReply] = useState('');
    const [search, setSearch] = useState('');

    const filtered = tickets.filter(
        (t) => !search || t.id.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.merchant.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex gap-6 h-full max-w-screen-2xl overflow-hidden" style={{ minWidth: 0 }}>
            {/* Left: ticket list */}
            <div className={clsx('flex flex-col glass-card rounded-xl transition-all min-w-0 shrink-0', selectedTicket ? 'w-full md:w-2/5 lg:w-80' : 'w-full')}>
                {/* Header stats */}
                <div className="grid grid-cols-4 divide-x divide-[#1e3a5f]/40 border-b border-[#1e3a5f]/40">
                    {[
                        { label: 'Open', value: '3', color: 'text-violet-400' },
                        { label: 'In Progress', value: '2', color: 'text-amber-400' },
                        { label: 'Resolved Today', value: '18', color: 'text-emerald-400' },
                        { label: 'Avg. Response', value: '1.4h', color: 'text-slate-300' },
                    ].map((s) => (
                        <div key={s.label} className="px-4 py-3 text-center">
                            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search & filter */}
                <div className="flex items-center gap-2 p-4 border-b border-[#1e3a5f]/40">
                    <div className="relative flex-1">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-8 pr-3 py-1.5 text-xs w-full"
                        />
                    </div>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition-colors">
                        <Filter size={11} /> <ChevronDown size={10} />
                    </button>
                </div>

                {/* Ticket list */}
                <div className="flex-1 overflow-y-auto divide-y divide-[#1e3a5f]/30">
                    {filtered.map((ticket) => (
                        <button
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={clsx(
                                'w-full text-left px-4 py-4 hover:bg-white/5 transition-colors',
                                selectedTicket?.id === ticket.id && 'bg-violet-500/5 border-l-2 border-violet-500'
                            )}
                        >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                <span className="font-mono text-[10px] text-violet-400">{ticket.id}</span>
                                <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase', priorityConfig[ticket.priority])}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-slate-200 truncate mb-1">{ticket.subject}</p>
                            <p className="text-[11px] text-slate-500 mb-2">{ticket.merchant}</p>
                            <div className="flex items-center justify-between">
                                <span className={clsx('inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full', statusConfig[ticket.status].classes)}>
                                    {statusConfig[ticket.status].icon} {statusConfig[ticket.status].label}
                                </span>
                                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                                    <MessageSquare size={9} /> {ticket.messages} · {ticket.lastReply}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: ticket detail */}
            {selectedTicket && (
                <div className="flex-1 flex flex-col glass-card rounded-xl overflow-hidden min-w-0">
                    {/* Ticket header */}
                    <div className="p-5 border-b border-[#1e3a5f]/40">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs text-violet-400">{selectedTicket.id}</span>
                                    <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase', priorityConfig[selectedTicket.priority])}>
                                        {selectedTicket.priority}
                                    </span>
                                    <span className={clsx('inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full', statusConfig[selectedTicket.status].classes)}>
                                        {statusConfig[selectedTicket.status].icon} {statusConfig[selectedTicket.status].label}
                                    </span>
                                </div>
                                <h2 className="text-sm font-semibold text-slate-100">{selectedTicket.subject}</h2>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="text-slate-500 hover:text-slate-200">
                                <XCircle size={18} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="flex items-center gap-2 text-slate-400">
                                <User size={12} className="text-slate-500" /> {selectedTicket.contact}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Mail size={12} className="text-slate-500" /> {selectedTicket.email}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <MessageSquare size={12} className="text-slate-500" /> {selectedTicket.category}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock size={12} className="text-slate-500" /> {selectedTicket.createdAt}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1e3a5f]/40">
                        <select className="input-field px-2 py-1.5 text-xs">
                            <option>Assign to agent...</option>
                            <option>Chima O.</option>
                            <option>Amaka I.</option>
                        </select>
                        <button className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-medium border border-emerald-500/25 transition-colors">
                            Mark Resolved
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-xs font-medium border border-amber-500/25 transition-colors">
                            Escalate
                        </button>
                        <div className="ml-auto flex items-center gap-1 text-slate-500 text-xs">
                            <Star size={12} />
                            Rate
                        </div>
                    </div>

                    {/* Conversation */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {[
                            { from: 'merchant', name: selectedTicket.contact, time: selectedTicket.createdAt, text: `Hello, we are experiencing ${selectedTicket.subject.toLowerCase()}. This is affecting our customers. Please investigate urgently.` },
                            { from: 'agent', name: selectedTicket.agent !== 'Unassigned' ? selectedTicket.agent : 'ZendFi Support', time: 'Auto-reply', text: 'Thank you for contacting ZendFi Support. Your ticket has been received and is being reviewed. A support agent will reach out to you shortly.' },
                        ].map((msg, i) => (
                            <div key={i} className={clsx('flex gap-3', msg.from === 'agent' ? 'flex-row-reverse' : '')}>
                                <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold', msg.from === 'agent' ? 'bg-gradient-to-br from-violet-600 to-violet-600 text-white' : 'bg-slate-700 text-slate-300')}>
                                    {msg.name.charAt(0)}
                                </div>
                                <div className={clsx('max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed', msg.from === 'agent' ? 'bg-violet-600/20 border border-violet-500/20 text-slate-200 rounded-tr-sm' : 'bg-white/5 border border-[#1e3a5f]/40 text-slate-300 rounded-tl-sm')}>
                                    <p className="font-semibold text-[10px] text-slate-500 mb-1">{msg.name} · {msg.time}</p>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply box */}
                    <div className="p-4 border-t border-[#1e3a5f]/40">
                        <div className="flex items-end gap-3">
                            <textarea
                                rows={2}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type your reply..."
                                className="input-field flex-1 px-3 py-2 text-sm resize-none"
                            />
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors">
                                <Send size={13} /> Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
