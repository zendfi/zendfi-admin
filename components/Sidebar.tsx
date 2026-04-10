'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Layers,
    ShieldCheck,
    Users,
    HeadphonesIcon,
    ArrowLeftRight,
    BarChart3,
    Settings,
    Webhook,
    ChevronDown,
    Zap,
    Radar,
    Activity,
    SlidersHorizontal,
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import type { CSSProperties, ComponentType } from 'react';
import Image from 'next/image';

type NavItem = {
    name: string;
    href: string;
    icon: ComponentType<{ size?: number; className?: string; style?: CSSProperties }>;
    section: 'monitor' | 'operations' | 'governance';
    badge?: string;
};

const navigation: NavItem[] = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, section: 'monitor' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, section: 'monitor' },

    { name: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight, section: 'operations' },
    { name: 'Payments', href: '/dashboard/payments', icon: Layers, section: 'operations' },
    { name: 'Webhooks', href: '/dashboard/webhooks', icon: Webhook, section: 'operations' },
    { name: 'Compliance Review', href: '/dashboard/compliance', icon: ShieldCheck, section: 'operations', badge: 'risk' },

    { name: 'Support Center', href: '/dashboard/support', icon: HeadphonesIcon, section: 'governance' },
    { name: 'Team Admin', href: '/dashboard/team', icon: Users, section: 'governance' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, section: 'governance' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const grouped = {
        monitor: navigation.filter((item) => item.section === 'monitor'),
        operations: navigation.filter((item) => item.section === 'operations'),
        governance: navigation.filter((item) => item.section === 'governance'),
    };

    const sections: Array<{ title: string; items: NavItem[] }> = [
        { title: 'Monitor', items: grouped.monitor },
        { title: 'Operations', items: grouped.operations },
        { title: 'Governance', items: grouped.governance },
    ];

    return (
        <aside
            style={{
                width: collapsed ? '72px' : '260px',
                background: 'var(--bg-shell)',
                borderRight: '1px solid var(--border)',
            }}
            className="flex flex-col h-screen transition-all duration-300 shrink-0"
        >
            {/* Logo */}
            <div
                className="flex items-center gap-3 px-5 py-5"
                style={{ borderBottom: '1px solid var(--border)' }}
            >
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shrink-0">
                    <Zap size={18} className="text-white" />
                </div>
                {!collapsed && (
                    <div>
                        <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Zendfi Logo"
                width={120}
                height={32}
                className="h-8 w-auto filter hue-rotate-[19deg] dark:hue-rotate-[13deg] brightness-110"
                priority
              />
            </Link>
                        <p className="text-[10px] mt-0.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            Admin Console
                        </p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-3">
                {!collapsed && (
                    <div className="glass-card rounded-xl px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Current Context</p>
                        <div className="mt-2 grid grid-cols-3 gap-1 text-[10px]">
                            <span className="status-pill status-ok"><Activity size={10} /> live</span>
                            <span className="status-pill status-info"><Radar size={10} /> mainnet</span>
                            <span className="status-pill status-warn"><SlidersHorizontal size={10} /> filtered</span>
                        </div>
                    </div>
                )}

                {sections.map(({ title, items }) => (
                    <div key={title} className="space-y-1">
                        {!collapsed && <p className="nav-section-title">{title}</p>}
                        {items.map((item) => {
                            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                                        active ? 'nav-active' : 'nav-idle'
                                    )}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon
                                        size={17}
                                        className="shrink-0 transition-colors"
                                        style={active ? { color: '#7ad7ff' } : { color: 'var(--text-secondary)' }}
                                    />
                                    {!collapsed && (
                                        <>
                                            <span className="flex-1">{item.name}</span>
                                            {item.badge && <span className="status-pill status-warn">{item.badge}</span>}
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User / collapse */}
            <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
                {!collapsed && (
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">AO</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                Admin Officer
                            </p>
                            <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                                admin@zendfi.io
                            </p>
                        </div>
                        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="mt-2 w-full flex items-center justify-center py-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {collapsed ? '→' : '← Collapse'}
                </button>
            </div>
        </aside>
    );
}
