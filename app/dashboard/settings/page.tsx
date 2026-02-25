'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Save, Key, Copy, RefreshCw, Shield, Bell, Globe, Database, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

type SettingsTab = 'general' | 'api_keys' | 'security' | 'notifications';

const apiKeys = [
    { id: 'pk_1', label: 'Live Public Key', value: 'pk_live_••••••••••••••••8841', type: 'public', env: 'live' },
    { id: 'sk_1', label: 'Live Secret Key', value: 'sk_live_••••••••••••••••2291', type: 'secret', env: 'live' },
    { id: 'pk_2', label: 'Test Public Key', value: 'pk_test_••••••••••••••••5510', type: 'public', env: 'test' },
    { id: 'sk_2', label: 'Test Secret Key', value: 'sk_test_••••••••••••••••7734', type: 'secret', env: 'test' },
];

export default function SettingsPage() {
    const { theme } = useTheme();
    const dark = theme !== 'light';
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [saved, setSaved] = useState(false);
    const [revealed, setRevealed] = useState<string[]>([]);

    const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
        { key: 'general', label: 'General', icon: <Globe size={14} /> },
        { key: 'api_keys', label: 'API Keys', icon: <Key size={14} /> },
        { key: 'security', label: 'Security', icon: <Shield size={14} /> },
        { key: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const toggleReveal = (id: string) => {
        setRevealed((r) => r.includes(id) ? r.filter((x) => x !== id) : [...r, id]);
    };

    return (
        <div className="max-w-3xl space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 rounded-xl p-1 w-fit border"
                style={{
                    background: dark ? 'rgba(18,13,34,0.9)' : 'rgba(255,255,255,0.95)',
                    borderColor: dark ? 'rgba(100,55,180,0.28)' : 'rgba(196,177,245,0.5)',
                }}>
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={clsx(
                            'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all',
                            activeTab === t.key ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-slate-500 hover:text-slate-300'
                        )}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* General */}
            {activeTab === 'general' && (
                <div className="glass-card rounded-xl divide-y divide-[#1e3a5f]/40">
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-slate-200 mb-1">Business Profile</h3>
                        <p className="text-xs text-slate-500">Your organization details displayed across the platform.</p>
                    </div>
                    <div className="p-5 space-y-4">
                        {[
                            { label: 'Business Name', value: 'ZendFi Technologies Ltd', type: 'text' },
                            { label: 'Support Email', value: 'support@zendfi.io', type: 'email' },
                            { label: 'Business Address', value: '12 Marina Road, Lagos Island, Lagos', type: 'text' },
                            { label: 'Website URL', value: 'https://zendfi.io', type: 'url' },
                            { label: 'Settlement Account', value: '0123456789 — GTBank', type: 'text' },
                        ].map((f) => (
                            <div key={f.label} className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-xs text-slate-400 font-medium">{f.label}</label>
                                <input type={f.type} defaultValue={f.value} className="input-field col-span-2 px-3 py-2 text-sm" />
                            </div>
                        ))}
                    </div>
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-slate-200 mb-4">Platform Configuration</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Maintenance Mode', desc: 'Temporarily disable all payment processing', checked: false },
                                { label: 'Two-Factor Auth Required', desc: 'Enforce 2FA for all admin accounts', checked: true },
                                { label: 'Live Mode', desc: 'Accept real transactions (disable for test mode)', checked: true },
                            ].map((toggle) => (
                                <div key={toggle.label} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="text-xs font-medium text-slate-200">{toggle.label}</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">{toggle.desc}</p>
                                    </div>
                                    <button className={clsx('w-10 h-5 rounded-full transition-colors relative', toggle.checked ? 'bg-violet-600' : 'bg-slate-700')}>
                                        <span className={clsx('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', toggle.checked ? 'translate-x-5' : 'translate-x-0.5')} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* API Keys */}
            {activeTab === 'api_keys' && (
                <div className="glass-card rounded-xl divide-y divide-[#1e3a5f]/40">
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-slate-200 mb-1">API Keys</h3>
                        <p className="text-xs text-slate-500">Keep your secret keys secure. Never expose them in client-side code.</p>
                    </div>
                    <div className="divide-y divide-[#1e3a5f]/30">
                        {apiKeys.map((k) => (
                            <div key={k.id} className="p-5 flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-xs font-medium text-slate-200">{k.label}</p>
                                        <span className={clsx('text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded font-bold', k.env === 'live' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400')}>
                                            {k.env}
                                        </span>
                                    </div>
                                    <p className="text-xs font-mono text-slate-400 truncate">
                                        {revealed.includes(k.id) ? 'sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx8841' : k.value}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {k.type === 'secret' && (
                                        <button onClick={() => toggleReveal(k.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors">
                                            {revealed.includes(k.id) ? <EyeOff size={13} /> : <Eye size={13} />}
                                        </button>
                                    )}
                                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors">
                                        <Copy size={13} />
                                    </button>
                                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors">
                                        <RefreshCw size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
                <div className="glass-card rounded-xl divide-y divide-[#1e3a5f]/40">
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-slate-200 mb-1">Security Settings</h3>
                        <p className="text-xs text-slate-500">Configure authentication and access security policies.</p>
                    </div>
                    <div className="p-5 space-y-4">
                        {(
                            [
                                { label: 'Session Timeout', kind: 'select', options: ['15 minutes', '30 minutes', '1 hour', '4 hours'] },
                                { label: 'IP Allowlist', kind: 'input', placeholder: '192.168.1.0/24, 10.0.0.1' },
                                { label: 'Password Policy', kind: 'select', options: ['Standard (8+ chars)', 'Strong (12+ chars, special chars)', 'Very Strong (16+ chars)'] },
                            ] as (
                                | { label: string; kind: 'select'; options: string[] }
                                | { label: string; kind: 'input'; placeholder: string }
                            )[]
                        ).map((f) => (
                            <div key={f.label} className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-xs text-slate-400 font-medium">{f.label}</label>
                                {f.kind === 'select' ? (
                                    <select className="input-field col-span-2 px-3 py-2 text-sm">
                                        {f.options.map((o) => <option key={o}>{o}</option>)}
                                    </select>
                                ) : (
                                    <input type="text" placeholder={f.placeholder} className="input-field col-span-2 px-3 py-2 text-sm" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-slate-200 mb-3">Recent Security Events</h3>
                        {[
                            { event: 'Admin login', user: 'seun@zendfi.io', ip: '197.211.58.104', time: '2026-02-22 15:30', ok: true },
                            { event: 'Failed login attempt', user: 'unknown', ip: '45.95.147.28', time: '2026-02-22 14:12', ok: false },
                            { event: 'API key rotated', user: 'ngozi@zendfi.io', ip: '197.211.58.104', time: '2026-02-21 11:45', ok: true },
                        ].map((e, i) => (
                            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#1e3a5f]/20 last:border-0">
                                {e.ok ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> : <Shield size={14} className="text-red-400 shrink-0" />}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-200">{e.event} — <span className="text-slate-400">{e.user}</span></p>
                                    <p className="text-[11px] text-slate-600">IP: {e.ip}</p>
                                </div>
                                <span className="text-[10px] text-slate-600 shrink-0">{e.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
                <div className="glass-card rounded-xl divide-y divide-[#1e3a5f]/40">
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-slate-200 mb-1">Notification Preferences</h3>
                        <p className="text-xs text-slate-500">Choose what alerts and updates you receive.</p>
                    </div>
                    <div className="p-5 space-y-3">
                        {[
                            { label: 'Transaction Failures', desc: 'Alert when payment failure rate exceeds threshold', email: true, sms: false, push: true },
                            { label: 'Compliance Alerts', desc: 'Notify on new KYC/AML flags', email: true, sms: true, push: true },
                            { label: 'Settlement Completed', desc: 'Confirm when settlement batches are processed', email: true, sms: false, push: false },
                            { label: 'New Support Ticket', desc: 'Alert on incoming merchant support requests', email: false, sms: false, push: true },
                            { label: 'Security Events', desc: 'Failed logins, key rotations, permission changes', email: true, sms: true, push: true },
                            { label: 'System Downtime', desc: 'Notify on service degradation or outages', email: true, sms: true, push: true },
                            { label: 'Weekly Report', desc: 'Summary of volume, success rates, and compliance', email: true, sms: false, push: false },
                        ].map((n) => (
                            <div key={n.label} className="grid grid-cols-5 items-center gap-3 py-2.5 border-b border-[#1e3a5f]/20 last:border-0">
                                <div className="col-span-2">
                                    <p className="text-xs font-medium text-slate-200">{n.label}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                                </div>
                                {(['email', 'sms', 'push'] as const).map((ch) => (
                                    <div key={ch} className="flex flex-col items-center gap-1">
                                        <p className="text-[9px] text-slate-600 uppercase tracking-wide">{ch}</p>
                                        <button className={clsx('w-8 h-4 rounded-full transition-colors relative', n[ch] ? 'bg-violet-500' : 'bg-slate-700')}>
                                            <span className={clsx('absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform', n[ch] ? 'translate-x-4' : 'translate-x-0.5')} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Save button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className={clsx(
                        'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                        saved ? 'bg-emerald-600 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'
                    )}
                >
                    {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
                </button>
            </div>
        </div>
    );
}
