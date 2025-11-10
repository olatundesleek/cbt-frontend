import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable Badge Component
 * Used for tags, labels, and status indicators
 */
export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
}: BadgeProps) {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    secondary: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    error: 'bg-error-50 text-error-700 border-error-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full border font-medium
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
}
