'use client';
import Card from '@/components/ui/Card';
import ProfileHeader from './ProfileHeader';
import PersonalInfoSection from './PersonalInfoSection';
import AcademicInfoSection from './AcademicInfoSection';
import PasswordChangeSection from './PasswordChangeSection';
import useProfile from '../hooks/useProfile';
import { useUpdatePassword, useUpdateProfile } from '../hooks/useUpdateProfile';
import { PersonalInformation, PasswordChange } from '@/types/profile.types';

/**
 * StudentProfilePage Component
 * Main profile page that composes all profile sections
 */
export default function StudentProfilePage() {
  const { profileData, isProfileLoading, profileError } = useProfile();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutate: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();

  // Handler for saving personal information
  const handleSavePersonalInfo = (data: PersonalInformation) => {
    if (!profileData) return;
    const payload = {
      firstname: data.firstname ?? profileData.firstname,
      lastname: data.lastname ?? profileData.lastname,
      username: data.username,
    };
    updateProfile(payload);
  };

  // Handler for changing password
  const handleChangePassword = (data: PasswordChange) => {
    updatePassword({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  // Handler for edit profile button (optional)
  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // Could open a modal or navigate to edit page
  };

  // Loading state
  if (isProfileLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center space-y-3'>
          <div className='w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto'></div>
          <p className='text-neutral-600'>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (profileError || !profileData) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Card className='max-w-md'>
          <div className='text-center space-y-3'>
            <div className='w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto'>
              <svg
                className='w-8 h-8 text-error-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-foreground'>
              Failed to Load Profile
            </h3>
            <p className='text-neutral-600'>
              {profileError?.message ||
                'Unable to load your profile data. Please try again.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className='mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Page Title */}
      <div>
        <h1 className='text-2xl font-bold text-neutral-900'>Profile</h1>
        <p className='text-neutral-600 mt-1'>
          View and manage your personal information
        </p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <ProfileHeader
          fullName={`${profileData.firstname} ${profileData.lastname}`}
          level={profileData.class?.className || 'Not Assigned'}
          onEditProfile={handleEditProfile}
        />
      </Card>

      {/* Two Column Layout for Forms */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Left Column - Personal Information */}
        <PersonalInfoSection
          data={{
            username: profileData.username,
            firstname: profileData.firstname,
            lastname: profileData.lastname,
            email: '',
            phoneNumber: '',
            address: '',
          }}
          onSave={handleSavePersonalInfo}
          isLoading={false}
          isMutating={isUpdatingProfile}
        />

        {/* Right Column - Academic Information */}
        <AcademicInfoSection
          data={{
            className: profileData.class?.className || 'Not Assigned',
            registeredCourses: [],
          }}
        />
      </div>

      {/* Password Change Section - Full Width */}
      <div className='max-w-2xl'>
        <PasswordChangeSection
          onChangePassword={handleChangePassword}
          isLoading={isUpdatingPassword}
        />
      </div>
    </div>
  );
}
