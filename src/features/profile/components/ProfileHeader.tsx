import { FaUser } from 'react-icons/fa';

interface ProfileHeaderProps {
  fullName: string;
  level: string;
  onEditProfile?: () => void;
  role?: 'admin' | 'student' | 'teacher';
}

/**
 * ProfileHeader Component
 * Displays user's profile picture, name, and basic info with edit button
 */
export default function ProfileHeader({
  fullName,
  level,
  onEditProfile,
  role = 'student',
}: ProfileHeaderProps) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex items-center gap-4'>
        {/* Profile Picture */}
        <div className='relative w-20 h-20 rounded-full overflow-hidden bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg'>
          <FaUser className='text-white text-3xl' />
        </div>

        {/* User Info */}
        <div>
          <h2 className='text-2xl font-bold text-neutral-900 capitalize'>
            {fullName}
          </h2>
          {role === 'student' && (
            <p className='text-neutral-600 mt-1'>Class :- {level}</p>
          )}
        </div>
      </div>

      {/* Edit Profile Button */}
      {onEditProfile && (
        <button
          onClick={onEditProfile}
          className='px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors duration-200 border border-primary-200'
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
