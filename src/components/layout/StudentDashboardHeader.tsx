'use client';

import Logo from './Logo';
import Link from 'next/link';
import ProfilePic from '../../features/profile/components/ProfilePic';
import { usePathname } from 'next/navigation';
import { IoIosNotifications } from 'react-icons/io';
import ButtonIcon from '../ui/ButtonIcon';
import toast from 'react-hot-toast';
import { ThemeToggle } from './ThemeToggle';

const navigationLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Tests', href: '/tests' },
  { name: 'Results', href: '/results' },
  { name: 'Profile', href: '/profile' },
];

export default function StudentDashboardHeader() {
  const pathname = usePathname();

  return (
    <nav className='mx-auto px-4 py-4 flex items-center justify-between bg-primary-50 shadow'>
      <div>
        <Logo />
      </div>

      <ul className='w-full flex-1 flex justify-center'>
        {navigationLinks.map((link) => (
          <li key={link.name} className='mx-4'>
            <Link
              href={link.href}
              className={`text-neutral-800 ${
                pathname === link.href
                  ? 'font-semibold text-primary-500 hover:text-primary-500'
                  : ''
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className='flex gap-4 items-center text-primary-900'>
        <ButtonIcon
          onClick={() => toast('Right sidebar toggled')}
          ariaLabel='Notifications'
        >
          <IoIosNotifications size={24} />
        </ButtonIcon>
        {/* <ButtonIcon
          onClick={() => toast('Dark mode toggled')}
          ariaLabel='Toggle Dark Mode'
        >
          <BsFillMoonFill size={18} />
        </ButtonIcon> */}
        <ThemeToggle />
        <ProfilePic />
      </div>
    </nav>
  );
}
