'use client';

import { Bell, Search, RefreshCw, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { clearAuthSession, getAdminProfile } from '@/lib/auth';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'Overview', subtitle: 'Command summary across core payment and risk pipelines' },
    '/dashboard/transactions': { title: 'Transactions', subtitle: 'Queue triage and payment recovery operations' },
    '/dashboard/payments': { title: 'Payments', subtitle: 'Settlements, setup-fee governance, and merchant enablement' },
    '/dashboard/analytics': { title: 'Analytics', subtitle: 'Throughput, gas economics, and infrastructure health' },
    '/dashboard/compliance': { title: 'Compliance Review', subtitle: 'Fraud signal resolution and blocklist operations' },
    '/dashboard/support': { title: 'Support Center', subtitle: 'Merchant-level diagnostics and dispute workflows' },
    '/dashboard/team': { title: 'Team Admin', subtitle: 'Operator account provisioning and access posture' },
    '/dashboard/webhooks': { title: 'Webhooks', subtitle: 'Delivery reliability and dead-letter resolution' },
    '/dashboard/settings': { title: 'Settings', subtitle: 'Global policy, notification, and security controls' },
};

export default function TopBar() {
    const pathname = usePathname();
    const page = pageTitles[pathname] || { title: 'Dashboard', subtitle: '' };
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const dark = theme !== 'light';
    const admin = getAdminProfile();

    return (
        <header
            className="h-16 border-b flex items-center justify-between px-5 md:px-6 shrink-0 sticky top-0 z-30 transition-colors duration-300"
            style={{
                background: dark ? 'rgba(10,24,48,0.92)' : 'rgba(248,251,255,0.94)',
                borderColor: 'var(--border)',
                backdropFilter: 'blur(12px)',
            }}
        >
            {/* Page title */}
            <div>
                <h1 className="text-base md:text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {page.title}
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)', maxWidth: 620 }}>
                    {page.subtitle}
                </p>
            </div>

            {/* Right: search + actions */}
            <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative hidden sm:block">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search merchant, payment, dispute..."
                        className="input-field pl-8 pr-4 py-1.5 text-sm w-48 focus:w-72 transition-all duration-200"
                    />
                </div>

                {/* Refresh */}
                <button
                    className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                    style={{
                        background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(33,83,149,0.08)',
                        color: 'var(--text-secondary)',
                    }}
                    title="Refresh data"
                >
                    <RefreshCw size={14} />
                </button>

                {/* Notifications */}
                <button
                    className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                    style={{
                        background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(33,83,149,0.08)',
                        color: 'var(--text-secondary)',
                    }}
                    title="Notifications"
                >
                    <Bell size={14} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-1"
                        />
                </button>

                {/* Theme toggle */}
                <button
                    onClick={() => setTheme(dark ? 'light' : 'dark')}
                    className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                    style={{
                        background: dark ? 'rgba(56,189,248,0.14)' : 'rgba(30,104,214,0.1)',
                        color: dark ? '#7dd3fc' : '#1d4ed8',
                    }}
                    title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {dark ? <Sun size={15} /> : <Moon size={15} />}
                </button>

                {/* Live indicator */}
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-green" />
                    <span className="text-xs text-emerald-400 font-medium">Live / Mainnet</span>
                </div>

                <button
                    className="px-2.5 py-1.5 rounded-lg text-xs border"
                    style={{
                        borderColor: 'var(--border)',
                        color: 'var(--text-secondary)',
                    }}
                    title={admin ? `${admin.email} (${admin.role})` : 'Logged in admin'}
                    onClick={() => {
                        clearAuthSession();
                        router.replace('/login');
                    }}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
