interface ButtonIconProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export default function ButtonIcon({
  children,
  onClick,
  ariaLabel,
  disabled,
}: ButtonIconProps) {
  return (
    <button
      onClick={onClick}
      type='button'
      // Only attach aria-label attribute if a valid string is provided
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      className='cursor-pointer disabled:cursor-not-allowed group relative'
      disabled={disabled}
    >
      <span>{children}</span>

      {/* Tooltip renders perfectly now when ariaLabel exists */}
      {ariaLabel && (
        <span className='absolute top-full left-1/2 -translate-x-1/2 mb-2 z-10 hidden px-1 py-1 text-xs text-black bg-white rounded-md whitespace-nowrap group-hover:block'>
          {ariaLabel.replace(/([a-z])([A-Z])/g, '$1 $2').replace('-', ' ')}{' '}
          {/* Convert camelCase to normal text */}
        </span>
      )}
    </button>
  );
}
