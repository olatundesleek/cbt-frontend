import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Reusable Card Component
 * Provides consistent styling for card-based layouts
 */
export default function Card({
  children,
  className = '',
  padding = 'md',
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-xl border border-neutral-200 
        shadow-sm hover:shadow-md transition-shadow duration-200
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
