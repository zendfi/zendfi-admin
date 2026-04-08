import { clearAuthSession, getAuthToken, getCsrfToken, setCsrfToken } from './auth';

const CONFIGURED_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
};

function resolveApiBase(): string {
  if (CONFIGURED_API_BASE) return CONFIGURED_API_BASE;

  if (typeof window === 'undefined') return '';

  const host = window.location.hostname.toLowerCase();

  // Production fallback for admin/dashboard hosts when env var is missing.
  if (
    host === 'zendfi-admin.vercel.app' ||
    host.endsWith('.zendfi.tech')
  ) {
    return 'https://api.zendfi.tech';
  }

  // Local dev convenience fallback.
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8080';
  }

  return '';
}

function isMutating(method: string): boolean {
  return ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const apiBase = resolveApiBase();
  if (!apiBase) {
    throw new ApiError('API base URL is not configured', 500, {
      hint: 'Set NEXT_PUBLIC_API_BASE_URL in deployment environment variables.',
    });
  }

  const method = options.method ?? 'GET';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.auth !== false) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  if (isMutating(method)) {
    const csrf = getCsrfToken();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }

  const res = await fetch(`${apiBase}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401 || res.status === 403) {
    clearAuthSession();
  }

  if (!res.ok) {
    let details: unknown = null;
    try {
      details = await res.json();
    } catch {
      details = await res.text();
    }
    throw new ApiError('Request failed', res.status, details);
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

export async function hydrateCsrfToken(): Promise<void> {
  const data = await apiRequest<{ token: string }>('/admin/csrf-token');
  if (data?.token) setCsrfToken(data.token);
}
