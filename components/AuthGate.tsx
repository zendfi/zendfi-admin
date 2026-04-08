'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuthToken } from '@/lib/auth';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAuthToken();
    if (!token && pathname !== '/login') {
      router.replace('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
