import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGate from '@/components/AuthGate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGate>
            <div className="h-screen w-full p-3 md:p-4" style={{ background: 'var(--bg-base)' }}>
                <div className="app-shell flex h-full w-full">
                    <Sidebar />
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                        <TopBar />
                        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-7">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </AuthGate>
    );
}
