import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGate from '@/components/AuthGate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGate>
            <div className="flex h-screen w-full" style={{ background: 'var(--bg-base)' }}>
                <Sidebar />
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <TopBar />
                    <main
                        className="flex-1 overflow-y-auto overflow-x-hidden p-6"
                        style={{ background: 'var(--bg-base)' }}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </AuthGate>
    );
}
