import React, { ReactNode } from 'react';
import Card from './Card';

interface Delta {
  value: string | number;
  positive?: boolean;
}

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  delta?: Delta;
  variant?:
    | 'student'
    | 'teacher'
    | 'admin'
    | 'user'
    | 'course'
    | 'test'
    | 'result';
  className?: string;
}

/**
 * DashboardStatCard
 * Reusable card for showing a single dashboard stat with optional icon and trend delta.
 */
export default function DashboardStatCard({
  label,
  value,
  icon,
  subtitle,
  delta,
  variant,
  className = '',
}: DashboardStatCardProps) {
  return (
    <Card className={`flex flex-col gap-2 ${className}`} padding='sm'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          {icon ? (
            <div
              className={
                `w-10 h-10 rounded-lg flex items-center justify-center ` +
                (variant === 'teacher'
                  ? 'bg-success-100 text-success-700'
                  : variant === 'admin'
                  ? 'bg-error-100 text-error-700'
                  : variant === 'course'
                  ? 'bg-success-100 text-success-700'
                  : variant === 'test'
                  ? 'bg-error-100 text-error-700'
                  : variant === 'result'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-primary-100 text-primary-700')
              }
            >
              {icon}
            </div>
          ) : null}

          <div>
            <span className='text-neutral-500 text-sm block'>{label}</span>
            {subtitle ? (
              <span className='text-xs text-neutral-400'>{subtitle}</span>
            ) : null}
          </div>
        </div>

        {delta ? (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              delta.positive
                ? 'bg-success-50 text-success-600'
                : 'bg-error-50 text-error-600'
            }`}
            aria-hidden
          >
            {delta.positive ? '+' : ''}
            {delta.value}
          </div>
        ) : null}
      </div>

      <div className='pt-2'>
        <div className='text-2xl md:text-3xl text-foreground font-bold'>
          {value}
        </div>
      </div>
    </Card>
  );
}
