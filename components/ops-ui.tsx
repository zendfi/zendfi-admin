'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx('glass-card rounded-2xl p-4 md:p-5', className)}>
      {(title || subtitle || action) && (
        <header className="flex items-start justify-between gap-3 mb-3">
          <div>
            {title && <h3 className="text-sm font-semibold tracking-wide">{title}</h3>}
            {subtitle && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function MetricTile({
  label,
  value,
  delta,
  tone = 'info',
}: {
  label: string;
  value: string | number;
  delta?: string;
  tone?: 'ok' | 'warn' | 'danger' | 'info';
}) {
  return (
    <article className="metric-tile">
      <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      {delta && <StatusPill tone={tone} className="mt-2">{delta}</StatusPill>}
    </article>
  );
}

export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: 'ok' | 'warn' | 'danger' | 'info';
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={clsx('status-pill', `status-${tone}`, className)}>
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background:
            tone === 'ok'
              ? 'var(--ok)'
              : tone === 'warn'
                ? 'var(--warn)'
                : tone === 'danger'
                  ? 'var(--danger)'
                  : 'var(--info)',
        }}
      />
      {children}
    </span>
  );
}

export function InlineMessage({
  kind,
  children,
}: {
  kind: 'error' | 'success' | 'info';
  children: ReactNode;
}) {
  const map = {
    error: 'status-danger',
    success: 'status-ok',
    info: 'status-info',
  } as const;

  return <div className={clsx('status-pill', map[kind])}>{children}</div>;
}

export function ShellTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function ActionButton({
  variant = 'secondary',
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const variantClass =
    variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-secondary';

  return (
    <button
      {...props}
      className={clsx('px-3 py-2 text-xs md:text-sm', variantClass, className, props.disabled && 'opacity-60 cursor-not-allowed')}
    >
      {children}
    </button>
  );
}
