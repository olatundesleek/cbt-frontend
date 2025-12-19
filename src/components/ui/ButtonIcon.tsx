interface ButtonIconProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export default function ButtonIcon({
  children,
  onClick,
  ariaLabel = '',
  disabled,
}: ButtonIconProps) {
  return (
    <button
      onClick={onClick}
      type='button'
      aria-label={ariaLabel}
      className='cursor-pointer disabled:cursor-not-allowed'
      disabled={disabled}
    >
      {children}
    </button>
  );
}
