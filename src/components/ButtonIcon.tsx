interface ButtonIconProps {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
}

export default function ButtonIcon({
  children,
  onClick,
  ariaLabel = '',
}: ButtonIconProps) {
  return (
    <button
      onClick={onClick}
      type='button'
      aria-label={ariaLabel}
      className='cursor-pointer'
    >
      {children}
    </button>
  );
}
