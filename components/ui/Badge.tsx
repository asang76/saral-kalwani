import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'purple' | 'warning' | 'error' | 'default';
  className?: string;
}

const variantClasses: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  purple: 'bg-brand-purple-soft text-brand-purple border-brand-border',
  warning: 'bg-amber-50 text-amber-600 border-amber-100',
  error: 'bg-red-50 text-red-500 border-red-100',
  default: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full',
        'text-xs font-semibold border',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
