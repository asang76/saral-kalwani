import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-brand-pink to-brand-pink text-white shadow-btn hover:shadow-btn-hover hover:-translate-y-0.5',
  secondary:
    'bg-white text-brand-pink border border-brand-border hover:bg-brand-pink-bg',
  ghost:
    'bg-transparent text-gray-500 hover:bg-brand-pink-bg hover:text-brand-pink',
  danger:
    'bg-red-500 text-white hover:bg-red-600',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-[15px] rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-sora font-semibold',
        'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
