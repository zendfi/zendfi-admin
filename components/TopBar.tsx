'use client';

import { Bell, Search, RefreshCw, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'Overview', subtitle: 'Payment infrastructure overview' },
    '/dashboard/transactions': { title: 'Transactions', subtitle: 'All payment transactions' },
    '/dashboard/payments': { title: 'Payments', subtitle: 'Payment processing & settlements' },
    '/dashboard/analytics': { title: 'Analytics', subtitle: 'Insights & performance reports' },
    '/dashboard/compliance': { title: 'Compliance Review', subtitle: 'KYC/AML verification queue' },
    '/dashboard/support': { title: 'Support Center', subtitle: 'Customer support tickets' },
    '/dashboard/team': { title: 'Team & Permissions', subtitle: 'Manage team members and roles' },
    '/dashboard/webhooks': { title: 'Webhooks', subtitle: 'Event endpoint management' },
    '/dashboard/settings': { title: 'Settings', subtitle: 'Account and system configuration' },
};

export default function TopBar() {
    const pathname = usePathname();
    const page = pageTitles[pathname] || { title: 'Dashboard', subtitle: '' };
    const { theme, setTheme } = useTheme();
    const dark = theme !== 'light';

    return (
        <header
            className="h-16 border-b flex items-center justify-between px-6 shrink-0 sticky top-0 z-30 transition-colors duration-300"
            style={{
                background: dark ? 'rgba(18,13,34,0.92)' : 'rgba(255,255,255,0.92)',
                borderColor: dark ? 'rgba(100,55,180,0.28)' : 'rgba(196,177,245,0.5)',
                backdropFilter: 'blur(12px)',
            }}
        >
            {/* Page title */}
            <div>
                <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {page.title}
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
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
                        placeholder="Search..."
                        className="input-field pl-8 pr-4 py-1.5 text-sm w-44 focus:w-60 transition-all duration-200"
                    />
                </div>

                {/* Refresh */}
                <button
                    className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                    style={{
                        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
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
                        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
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
                        background: dark ? 'rgba(251,191,36,0.1)' : 'rgba(155,125,212,0.12)',
                        color: dark ? '#fbbf24' : '#9b7dd4',
                    }}
                    title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {dark ? <Sun size={15} /> : <Moon size={15} />}
                </button>

                {/* Live indicator */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-green" />
                    <span className="text-xs text-emerald-400 font-medium">Live</span>
                </div>
            </div>
        </header>
    );
}
