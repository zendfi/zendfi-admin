'use client';

import { useState } from 'react';
import {
    UserPlus,
    Shield,
    MoreVertical,
    Search,
    Mail,
    Check,
    X,
    Crown,
    Eye,
    Edit3,
    Trash2,
    Users,
    Lock,
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

type Role = 'super_admin' | 'admin' | 'compliance' | 'support' | 'finance' | 'viewer';
type MemberStatus = 'active' | 'inactive' | 'pending';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: MemberStatus;
    lastActive: string;
    permissions: string[];
    avatar: string;
}

const members: TeamMember[] = [
    { id: '1', name: 'Oluwaseun Adeyemi', email: 'seun@zendfi.io', role: 'super_admin', status: 'active', lastActive: '2 min ago', permissions: ['all'], avatar: 'OA' },
    { id: '2', name: 'Ngozi Achebe', email: 'ngozi@zendfi.io', role: 'compliance', status: 'active', lastActive: '15 min ago', permissions: ['compliance', 'reports', 'aml'], avatar: 'NA' },
    { id: '3', name: 'Kelechi Okafor', email: 'kelechi@zendfi.io', role: 'support', status: 'active', lastActive: '1 hr ago', permissions: ['tickets', 'transactions_view'], avatar: 'KO' },
    { id: '4', name: 'Amaka Ibe', email: 'amaka@zendfi.io', role: 'finance', status: 'active', lastActive: '3 hr ago', permissions: ['settlements', 'reports', 'payouts'], avatar: 'AI' },
    { id: '5', name: 'Emeka Dike', email: 'emeka@zendfi.io', role: 'admin', status: 'active', lastActive: 'Yesterday', permissions: ['merchants', 'transactions', 'settings'], avatar: 'ED' },
    { id: '6', name: 'Fatima Ibrahim', email: 'fatima@zendfi.io', role: 'viewer', status: 'inactive', lastActive: '5 days ago', permissions: ['dashboard_view'], avatar: 'FI' },
    { id: '7', name: 'Chima Eze', email: 'chima@zendfi.io', role: 'support', status: 'pending', lastActive: 'Never', permissions: ['tickets'], avatar: 'CE' },
];

const roleConfig: Record<Role, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    super_admin: { label: 'Super Admin', color: 'text-amber-400', bg: 'bg-amber-500/15 border border-amber-500/25', icon: <Crown size={11} /> },
    admin: { label: 'Admin', color: 'text-violet-400', bg: 'bg-violet-500/15 border border-violet-500/25', icon: <Shield size={11} /> },
    compliance: { label: 'Compliance', color: 'text-violet-400', bg: 'bg-violet-500/15 border border-violet-500/25', icon: <Shield size={11} /> },
    support: { label: 'Support', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border border-cyan-500/25', icon: <Users size={11} /> },
    finance: { label: 'Finance', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border border-emerald-500/25', icon: <Lock size={11} /> },
    viewer: { label: 'Viewer', color: 'text-slate-400', bg: 'bg-slate-500/15 border border-slate-500/25', icon: <Eye size={11} /> },
};

const statusColors: Record<MemberStatus, string> = {
    active: 'bg-emerald-400',
    inactive: 'bg-slate-500',
    pending: 'bg-amber-400',
};

const permissionMatrix = [
    { feature: 'Dashboard Overview', super_admin: true, admin: true, compliance: true, support: true, finance: true, viewer: true },
    { feature: 'All Transactions', super_admin: true, admin: true, compliance: true, support: false, finance: true, viewer: false },
    { feature: 'Compliance Review', super_admin: true, admin: true, compliance: true, support: false, finance: false, viewer: false },
    { feature: 'AML / KYC Actions', super_admin: true, admin: false, compliance: true, support: false, finance: false, viewer: false },
    { feature: 'Support Tickets', super_admin: true, admin: true, compliance: false, support: true, finance: false, viewer: false },
    { feature: 'Settlements / Payouts', super_admin: true, admin: true, compliance: false, support: false, finance: true, viewer: false },
    { feature: 'Team Management', super_admin: true, admin: true, compliance: false, support: false, finance: false, viewer: false },
    { feature: 'Webhooks Config', super_admin: true, admin: true, compliance: false, support: false, finance: false, viewer: false },
    { feature: 'System Settings', super_admin: true, admin: false, compliance: false, support: false, finance: false, viewer: false },
    { feature: 'Export Reports', super_admin: true, admin: true, compliance: true, support: false, finance: true, viewer: false },
];

export default function TeamPage() {
    const { theme } = useTheme();
    const dark = theme !== 'light';
    const [search, setSearch] = useState('');
    const [activeView, setActiveView] = useState<'members' | 'permissions'>('members');
    const [showInviteModal, setShowInviteModal] = useState(false);

    const filtered = members.filter(
        (m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-screen-2xl">
            {/* Header + actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-[#120d22] border border-[#1e3a5f]/40 rounded-xl p-1"
                 style={{
                    background: dark ? 'rgba(18,13,34,0.9)' : 'rgba(255,255,255,0.95)',
                    borderColor: dark ? 'rgba(100,55,180,0.28)' : 'rgba(196,177,245,0.5)',
                }}>
                    {(['members', 'permissions'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setActiveView(v)}
                            className={clsx(
                                'px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                                activeView === v ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-slate-500 hover:text-slate-300'
                            )}
                        >
                            {v === 'members' ? 'Team Members' : 'Role Permissions'}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className={clsx(
                        'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors',
                        dark ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-violet-600 hover:bg-violet-500 dark:text-white'
                    )}
                >
                    <UserPlus size={14} /> Invite Member
                </button>
            </div>

            {activeView === 'members' ? (
                <div className="glass-card rounded-xl">
                    {/* Search */}
                    <div className="flex items-center gap-3 p-5 border-b border-[#1e3a5f]/40">
                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-8 pr-3 py-1.5 text-xs w-52"
                            />
                        </div>
                        <p className="text-xs text-slate-500 ml-auto">{filtered.length} members</p>
                    </div>

                    {/* Members table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-slate-500 border-b border-[#1e3a5f]/30">
                                    <th className="text-left px-5 py-3 font-medium">Member</th>
                                    <th className="text-left px-4 py-3 font-medium">Role</th>
                                    <th className="text-left px-4 py-3 font-medium">Status</th>
                                    <th className="text-left px-4 py-3 font-medium">Permissions</th>
                                    <th className="text-left px-4 py-3 font-medium">Last Active</th>
                                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((m) => {
                                    const rc = roleConfig[m.role];
                                    return (
                                        <tr key={m.id} className="table-row-hover border-b border-[#1e3a5f]/20 last:border-0">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                            {m.avatar}
                                                        </div>
                                                        <span className={clsx('absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#120d22]', statusColors[m.status])} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-200">{m.name}</p>
                                                        <p className="text-[11px] text-slate-500">{m.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', rc.bg, rc.color)}>
                                                    {rc.icon} {rc.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={clsx('text-[11px] font-medium capitalize', m.status === 'active' ? 'text-emerald-400' : m.status === 'pending' ? 'text-amber-400' : 'text-slate-500')}>
                                                    {m.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {m.permissions.slice(0, 2).map((p) => (
                                                        <span key={p} className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/5 text-slate-500 border border-[#1e3a5f]/40">
                                                            {p}
                                                        </span>
                                                    ))}
                                                    {m.permissions.length > 2 && (
                                                        <span className="text-[9px] text-slate-600">+{m.permissions.length - 2}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-500">{m.lastActive}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button className="text-slate-500 hover:text-violet-400 transition-colors"><Edit3 size={13} /></button>
                                                    <button className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                                                    <button className="text-slate-500 hover:text-slate-200 transition-colors"><MoreVertical size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Permissions matrix */
                <div className="glass-card rounded-xl overflow-x-auto">
                    <div className="p-5 border-b border-[#1e3a5f]/40">
                        <h3 className="text-sm font-semibold text-slate-200">Role Permission Matrix</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Overview of what each role can access</p>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-slate-500 border-b border-[#1e3a5f]/30">
                                <th className="text-left px-5 py-3 font-medium">Feature</th>
                                {Object.entries(roleConfig).map(([k, v]) => (
                                    <th key={k} className="px-4 py-3 font-medium text-center whitespace-nowrap">
                                        <span className={clsx('inline-flex items-center gap-1', v.color)}>{v.icon} {v.label}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissionMatrix.map((row) => (
                                <tr key={row.feature} className="table-row-hover border-b border-[#1e3a5f]/20 last:border-0">
                                    <td className="px-5 py-3 text-xs text-slate-300">{row.feature}</td>
                                    {(['super_admin', 'admin', 'compliance', 'support', 'finance', 'viewer'] as Role[]).map((role) => (
                                        <td key={role} className="px-4 py-3 text-center">
                                            {row[role] ? (
                                                <Check size={14} className="text-emerald-400 mx-auto" />
                                            ) : (
                                                <X size={14} className="text-slate-700 mx-auto" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Invite modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
                    <div className="glass-card rounded-2xl w-full max-w-md mx-4 p-6 border border-[#1e3a5f]/60 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-base font-bold text-slate-100 mb-1">Invite Team Member</h2>
                        <p className="text-xs text-slate-500 mb-5">An invitation email will be sent to the recipient.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Full Name</label>
                                <input type="text" placeholder="e.g. Chioma Obi" className="input-field px-3 py-2 text-sm w-full" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Email Address</label>
                                <div className="relative">
                                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="email" placeholder="chioma@company.com" className="input-field pl-8 pr-3 py-2 text-sm w-full" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Role</label>
                                <select className="input-field px-3 py-2 text-sm w-full">
                                    <option>Select a role...</option>
                                    {Object.entries(roleConfig).map(([k, v]) => (
                                        <option key={k} value={k}>{v.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowInviteModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-sm font-medium transition-colors">
                                Cancel
                            </button>
                            <button className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
