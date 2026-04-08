export const AUTH_TOKEN_KEY = 'zendfi_admin_token';
export const AUTH_ADMIN_KEY = 'zendfi_admin_profile';
export const AUTH_CSRF_KEY = 'zendfi_admin_csrf';

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'support';
};

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getCsrfToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_CSRF_KEY);
}

export function setCsrfToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_CSRF_KEY, token);
}

export function setAuthSession(token: string, admin: AdminProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_ADMIN_KEY, JSON.stringify(admin));
}

export function getAdminProfile(): AdminProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminProfile;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ADMIN_KEY);
  localStorage.removeItem(AUTH_CSRF_KEY);
}
