'use client';

import Logo from './Logo';
import Link from 'next/link';
import ProfilePic from '../../features/profile/components/ProfilePic';
import { usePathname } from 'next/navigation';
import { IoIosNotifications } from 'react-icons/io';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import ButtonIcon from '../ui/ButtonIcon';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';
import useLogout from '@/hooks/useLogout';
import { SpinnerMini } from '../ui';
import { useUserStore } from '@/store/useUserStore';
import { useNotification } from '@/hooks/useNotification';
import useDashboard from '@/features/dashboard/queries/useDashboard';

const navigationLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Tests', href: '/tests' },
  { name: 'Results', href: '/results' },
  { name: 'Profile', href: '/profile' },
];

export default function StudentDashboardHeader() {
  const userRole = useUserStore((state) => state.role);
  const { data: notificationData } = useNotification();
  const {
    data: dashboardData,
    isLoading: isDashboardDataLoading,
    error: dashboardError,
  } = useDashboard();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, isLoggingOut } = useLogout();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className='mx-auto px-4 py-4 bg-primary-50 shadow relative'>
      <div className='flex items-center justify-between'>
        {/* Logo */}
        <div>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <ul className='hidden lg:flex flex-1 justify-center'>
          {navigationLinks.map((link) => (
            <li key={link.name} className='mx-4'>
              <Link
                href={link.href}
                className={`text-neutral-800 hover:text-primary-500 transition-colors ${
                  pathname === link.href ? 'font-semibold text-primary-500' : ''
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side Icons */}
        <div className='flex gap-2 sm:gap-4 items-center text-primary-900'>
          <div className='relative'>
            <ButtonIcon
              // onClick={() => toast('Notifications')}
              ariaLabel='Notifications'
              // className='hidden sm:flex'
            >
              <IoIosNotifications size={24} />
            </ButtonIcon>
            {!isDashboardDataLoading &&
              dashboardData &&
              !dashboardError &&
              notificationData?.data?.data.length &&
              notificationData.data.data.length > 0 && (
                <span className='text-xs border border-white bg-white text-primary-500 font-black rounded-full w-4 h-4 absolute flex justify-center items-center  -top-2 -right-2 p-2'>
                  {isDashboardDataLoading
                    ? 0
                    : notificationData?.data.data.length || 0}
                </span>
              )}
          </div>
          {/* Uncomment theme toggle during future updates for light/dark mode */}
          {/* <div className='hidden sm:block'>
            <ThemeToggle />
          </div> */}
          <div className='hidden sm:block'>
            <ButtonIcon
              onClick={logout}
              disabled={isLoggingOut}
              ariaLabel='Logout'
            >
              {isLoggingOut ? (
                <SpinnerMini color='text-primary' />
              ) : (
                <HiArrowRightOnRectangle size={24} />
              )}
            </ButtonIcon>
          </div>
          <div className='hidden sm:block'>
            <ProfilePic role={userRole} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className='lg:hidden p-2 rounded-md hover:bg-primary-100 transition-colors'
            aria-label='Toggle menu'
          >
            {isMobileMenuOpen ? (
              <HiX size={28} className='text-primary-900' />
            ) : (
              <HiMenuAlt3 size={28} className='text-primary-900' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='lg:hidden absolute top-full left-0 right-0 bg-primary-50 shadow-lg z-50 border-t border-primary-100'>
          <ul className='flex flex-col py-4'>
            {navigationLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block px-6 py-3 text-neutral-800 hover:bg-primary-100 transition-colors ${
                    pathname === link.href
                      ? 'font-semibold text-primary-500 bg-primary-100'
                      : ''
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Bottom Section */}
          <div className='border-t border-primary-100 px-6 py-4 flex items-center justify-between sm:hidden'>
            <div className='flex gap-4 items-center'>
              <div className='relative'>
                <ButtonIcon
                  onClick={() => toast('Notifications')}
                  ariaLabel='Notifications'
                  // className='hidden sm:flex'
                >
                  <IoIosNotifications size={24} />
                </ButtonIcon>
                {!isDashboardDataLoading &&
                  dashboardData &&
                  !dashboardError &&
                  notificationData?.data?.data.length &&
                  notificationData.data.data.length > 0 && (
                    <span className='text-xs border border-white bg-white text-primary-500 font-black rounded-full w-4 h-4 absolute flex justify-center items-center  -top-2 -right-2 p-2'>
                      {isDashboardDataLoading
                        ? 0
                        : notificationData?.data.data.length || 0}
                    </span>
                  )}
              </div>
              {/* <ThemeToggle /> */}
              <ButtonIcon
                onClick={logout}
                disabled={isLoggingOut}
                ariaLabel='Logout'
              >
                {isLoggingOut ? (
                  <SpinnerMini color='text-primary' />
                ) : (
                  <HiArrowRightOnRectangle size={24} />
                )}
              </ButtonIcon>
            </div>
            <ProfilePic />
          </div>
        </div>
      )}
    </nav>
  );
}
