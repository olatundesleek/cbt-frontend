import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';

interface ProfilePicProps {
  imageUrl?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  role?: 'student' | 'admin' | 'teacher';
}

/**
 * Reusable ProfilePic Component
 * Displays a profile picture or fallback icon
 */
export default function ProfilePic({
  imageUrl,
  name = 'User',
  size = 'md',
  className = '',
  role = 'student',
}: ProfilePicProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  return (
    <Link
      href={role === 'student' ? '/profile' : '/admin/profile'}
      className={`
        relative rounded-full overflow-hidden 
        bg-linear-to-br from-primary-400 to-primary-600 
        flex items-center justify-center shadow-md cursor-pointer
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={name} fill className='object-cover' />
      ) : (
        <FaUser className='text-white' size={iconSizes[size]} />
      )}
    </Link>
  );
}
