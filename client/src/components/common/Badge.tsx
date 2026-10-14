import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'slate' | 'amber' | 'blue';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  className = ''
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    slate: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    blue: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-xs transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
