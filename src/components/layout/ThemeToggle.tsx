'use client';

import { useTheme } from '@/hooks/useTheme';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
import ButtonIcon from '../ui/ButtonIcon';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ButtonIcon onClick={toggleTheme} aria-label='Toggle theme'>
      {theme === 'light' ? (
        <BsFillMoonFill size={18} />
      ) : (
        <BsFillSunFill size={18} />
      )}
    </ButtonIcon>
  );
}
