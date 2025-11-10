import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PasswordChange } from '@/types/profile.types';
import { FaLock } from 'react-icons/fa';

interface PasswordChangeSectionProps {
  onChangePassword?: (data: PasswordChange) => void;
  isLoading?: boolean;
}

/**
 * PasswordChangeSection Component
 * Handles password change functionality
 */
export default function PasswordChangeSection({
  onChangePassword,
  isLoading = false,
}: PasswordChangeSectionProps) {
  const [formData, setFormData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<PasswordChange>>({});

  const handleChange = (field: keyof PasswordChange, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordChange> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onChangePassword) {
      onChangePassword(formData);
      // Reset form on successful submission
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <Card>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center'>
          <FaLock className='text-primary-600' />
        </div>
        <div>
          <h3 className='text-lg font-semibold text-neutral-900'>
            Account Settings
          </h3>
          <p className='text-sm text-neutral-600'>Change your password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Current Password'
          type='password'
          value={formData.currentPassword}
          onChange={(e) => handleChange('currentPassword', e.target.value)}
          error={errors.currentPassword}
          placeholder='Enter current password'
        />

        <Input
          label='New Password'
          type='password'
          value={formData.newPassword}
          onChange={(e) => handleChange('newPassword', e.target.value)}
          error={errors.newPassword}
          placeholder='Enter new password'
          helperText='Must be at least 8 characters'
        />

        <Input
          label='Confirm New Password'
          type='password'
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          placeholder='Confirm new password'
        />

        <div className='pt-2'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Updating Password...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
