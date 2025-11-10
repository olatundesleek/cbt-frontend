import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Reusable Input Component
 * Supports labels, error states, and helper text
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', disabled, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={props.id}
            className='block text-sm font-medium text-neutral-700 mb-1'
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-lg border
            bg-white text-neutral-900 
            placeholder:text-neutral-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500
            ${error ? 'border-error-500' : 'border-neutral-300'}
            ${className}
          `}
          {...props}
        />
        {error && <p className='mt-1 text-sm text-error-500'>{error}</p>}
        {helperText && !error && (
          <p className='mt-1 text-sm text-neutral-500'>{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
